from django.db import transaction
from django.http import JsonResponse, HttpRequest
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from ..models import User, OrgTables, Organization
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
import concurrent.futures
from ..user_access_permissions.user_access_views import get_accessible_tables, add_permissions_to_user
from ..helpers.table_preprocessing import get_database_schemas_and_tables, process_table, get_column_descriptions
from ..helpers.table_processing import get_sample_table_data
import concurrent.futures


@api_view(["POST"])
@verify_session()
def create_connection(request):
    try:
        uri = request.data.get('uri', None)
        db_type = request.data.get('db_type', None)
        user_id = request.supertokens.get_user_id()
        # user_id = request.data.get('user_id', None)
        if not uri or not user_id or not db_type:
            print("uri, user_id and db_type are required")
            return JsonResponse({'error': "uri, user_id and db_type are required"},
                                status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        organization = user.organization

        db_data = get_database_schemas_and_tables(uri, db_type)

        if not db_data:
            return JsonResponse({'error': "No data retrieved from the database."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        tasks = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            for schema_name, tables in db_data.items():
                for table_name, table_info in tables.items():
                    # print("TABLE NAME: ", table_name)
                    task = executor.submit(
                        process_table, schema_name, table_name, table_info, uri, organization)
                    tasks.append(task)

            for future in concurrent.futures.as_completed(tasks):
                org_table = future.result()
                org_table.save()
                super_users = Organization.objects.get(id=organization.id).super_user
                for super_user in super_users:
                    add_permissions_to_user(super_user, org_table.id, 'Admin')

        # update organization last because if processing fails
        # we want them to resend the uri, but the frontend will
        # disable the field if there is a uri present, regardless
        # if the processing of table meta data was successful or not
        organization.database_uri = uri
        organization.save()

        return JsonResponse({'message': 'meta data created and saved'}, status=201)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_view_data_tables(request, user_id):
    '''
    Get all tables accessible by user and returns a JsonResponse with 3 sample data rows
    for each table.
    Example response:
    {
    "tables": [
        {
            "table_name": "rider_exits",
            "column_headers": ["rider,"stage","reason"],
            "rows": [[195, 1, "withdrawal"], [76, 4, "DNS"], [45, 8, "DNS"]],
            "table_description": ""
        },
        {
        "table_name": "locations",
        "column_headers": ["name", "country"],
        "rows": [["Agen", "FRA"], ["Alexandrie", "ITA"], ["Aoste", "FRA"]],
        "table_description": ""
        }
    ]}
    '''
    # Check that user is valid
    user = get_object_or_404(User, id=user_id)

    # Gets all table_id of tables accessible by user
    table_ids = get_accessible_tables(user_id)

    # Get organization uri
    org_uri = user.organization.database_uri

    # Get sample table data
    try:
        result = get_sample_table_data(table_ids, org_uri)
        return JsonResponse({"tables": result}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def refresh_connection(request):
    '''
    Refreshes table data
    '''
    user_id = request.data.get('user_id', None)
    user = get_object_or_404(User, id=user_id)

    organization = user.organization
    success = refresh_org_tables(organization, organization.database_uri)
    print(success)
    if success:
        return JsonResponse({'message': 'Tables refreshed successfully'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Failed to refresh tables'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def refresh_org_tables(organization, uri):
    '''
    Utility function to refresh all tables for an organization
    '''

    # TODO: Expand this to other DBMS types
    # Get all tables in new db instance
    try:
        db_data = get_database_schemas_and_tables(uri, db_type='postgresql')
        if not db_data:
            return JsonResponse({'error': "No data retrieved from the database."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        with transaction.atomic():
            # Get all current tables in organization
            curr_tables = OrgTables.objects.filter(organization=organization)

            # Get names of tables, and keep track of their respective schema in new db instance
            new_tables = {}
            for schema_name, tables in db_data.items():
                for table_name in tables:
                    new_tables[table_name] = schema_name

            # Initialize lists to keep track of tasks -> Ensure thread safety while managing DB operations
            update_tasks = []
            delete_tasks = []
            new_table_tasks = []

            # Using ThreadPoolExecutor to handle existing table checks and updates
            with concurrent.futures.ThreadPoolExecutor() as executor:
                for table in curr_tables:
                    # Check if table still exists in new db instance
                    table_name = table.table_name

                    # Case 1: Current table is deleted
                    if table_name not in new_tables:
                        delete_tasks.append(table)

                    # Case 2: Table still exists, but columns may have changed
                    else:
                        schema_name = new_tables[table_name]
                        new_types = db_data[schema_name][table_name]['types']

                        # Get new column descriptions and types and replace
                        task = executor.submit(get_column_descriptions, table_name, schema_name, uri)
                        update_tasks.append((table, task, new_types, schema_name))
                        del new_tables[table_name]
                # Case 3: New tables that have been added
                for table_name in new_tables:
                    schema_name = new_tables[table_name]
                    table_info = db_data[schema_name][table_name]
                    task = executor.submit(process_table, schema_name, table_name, table_info, uri, organization)
                    new_table_tasks.append(task)

                # Handle all tasks
                handle_updates(update_tasks)
                handle_deletes(delete_tasks)
                handle_new_tables(new_table_tasks, organization)

        return True

    except Exception as e:
        return False


def handle_new_tables(new_table_tasks, organization):
    super_users = organization.super_user
    for future in new_table_tasks:
        org_table = future.result()
        org_table.save()
        for super_user in super_users:
            add_permissions_to_user(super_user, org_table.id, 'Admin')


def handle_deletes(delete_tasks):
    # Handling deletions
    for table in delete_tasks:
        table.delete()


def handle_updates(update_tasks):
    for table, future, new_types, new_schema in update_tasks:
        new_column_descriptions, new_table_description = future.result()
        # Overwrite existing information
        table.column_descriptions = new_column_descriptions
        table.column_types = new_types
        table.table_description = new_table_description
        table.table_schema = new_schema
        table.save()
