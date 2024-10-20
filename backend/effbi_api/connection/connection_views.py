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
                    print("TABLE NAME: ", table_name)
                    task = executor.submit(
                        process_table, schema_name, table_name, table_info, uri, organization)
                    tasks.append(task)

            for future in concurrent.futures.as_completed(tasks):
                org_table = future.result()
                org_table.save()
                super_user = Organization.objects.get(id=organization.id).super_user
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
    org_id = request.data.get('org_id', None)
    if not org_id:
        return JsonResponse({'error': 'Organization ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    organization = get_object_or_404(Organization, id=org_id)
    success = refresh_org_tables(org_id, organization.database_uri)
    if success:
        return JsonResponse({'message': 'Tables refreshed successfully'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Failed to refresh tables'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def refresh_org_tables(org_id, uri):
    '''
    Utility function to refresh all tables for an organization
    '''
    # Get all tables for respective organization
    curr_tables = OrgTables.objects.filter(organization=org_id)

    # Get all tables in new db instance
    # TODO: Expand this to other DBMS types
    db_data = get_database_schemas_and_tables(uri, db_type='postgresql')
    if not db_data:
        return JsonResponse({'error': "No data retrieved from the database."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Get names of tables, and keep track of their respective schema in new db instance
    new_tables = {}
    for schema_name, tables in db_data.items():
        for table_name in tables:
            new_tables[table_name] = schema_name

    print(new_tables)
    for table in curr_tables:
        # Check if table still exists in new db instance
        table_name = table.table_name
        # Case 1: Current table is deleted
        if table_name not in new_tables:
            table.delete()

        # Case 2: Table still exists, but columns may have changed
        else:
            table_info = db_data[table.table_schema][table_name]
            new_types = table_info['types']

            # Get new column descriptions and types and replace
            new_column_descriptions, new_table_description = get_column_descriptions(table_name, new_tables[table_name], uri)

            # Overwrite existing information
            table.column_descriptions = new_column_descriptions
            table.column_types = new_types
            table.table_description = new_table_description
            table.table_schema = new_tables[table_name]

            print(table)
            table.save()

            del new_tables[table_name]

    # Case 3: New tables have been added
    for table_name in new_tables:
        org_table = process_table(new_tables[table_name], table_name, db_data[new_tables[table_name]][table_name], uri, org_id)
        org_table.save()
        super_user = Organization.objects.get(id=org_id).super_user
        add_permissions_to_user(super_user, org_table.id, 'Admin')

    return True

