from ..helpers.table_processing import get_sample_table_data
from django.http import JsonResponse, HttpRequest
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from ..models import User
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
import concurrent.futures
from ..user_access_permissions.user_access_views import get_accessible_tables, add_permissions_to_user
from ..helpers.table_preprocessing import get_database_schemas_and_tables, process_table
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
                add_permissions_to_user(user_id, org_table.id, 'Admin')

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
