from .helpers.table_processing import get_sample_table_data
from django.http import JsonResponse, HttpRequest
from .llm.State import State
from .llm.pipeline import response_pipeline
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from supertokens_python.recipe.multitenancy.syncio import list_all_tenants
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from .models import Dashboard, Tile, UserAccessPermissions
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import User
import concurrent.futures
from .user_access_permissions.user_access_views import get_accessible_tables, add_permissions_to_user
from .serializer import DashboardSerializer, TileSerializer
from .helpers.table_preprocessing import get_database_schemas_and_tables, process_table
import concurrent.futures

class SessionInfoAPI(APIView):
    @method_decorator(verify_session())
    def get(self, request, format=None):
        session_ = request.supertokens
        return JsonResponse(
            {
                "sessionHandle": session_.get_handle(),
                "userId": session_.get_user_id(),
                "accessTokenPayload": session_.get_access_token_payload(),
            }
        )


class TenantsAPI(APIView):
    def get(self, request, format=None):
        tenantReponse = list_all_tenants()

        tenantsList = []

        for tenant in tenantReponse.tenants:
            tenantsList.append(tenant.to_json())

        return JsonResponse({
            "status": "OK",
            "tenants": tenantsList,
        })


@api_view(["GET"])
def health_check(request):
    return JsonResponse({'message': 'Server is running successfully'}, status=200)


@api_view(["POST"])
@verify_session()
def create_dashboard(request):
    try:
        user_id = request.supertokens.get_user_id()
        print(user_id)
        user = get_object_or_404(User, id=user_id)
        org_id = user.organization.id
        request.data['organization'] = org_id
        request.data['created_by'] = user.first_name + " " + user.last_name
        print(request.data)
        serializer = DashboardSerializer(data=request.data)
        if serializer.is_valid():
            dashboard = serializer.save()
            print(dashboard)
            return JsonResponse(
                {'message': 'Dashboard created successfully',
                    'dashboard': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(["GET"])
@verify_session()
def get_dashboards(request: HttpRequest):
    session = request.supertokens
    user_id = session.get_user_id()
    print(user_id)
    user = get_object_or_404(User, id=user_id)
    org_id = user.organization
    dashboards = Dashboard.objects.filter(organization=org_id)
    serializer = DashboardSerializer(dashboards, many=True)
    return JsonResponse({'data': serializer.data}, status=200)

@api_view(["GET"])
@verify_session()
def get_dashboard_name(request: HttpRequest):
    print("get_dashboard_name called")
    user_id = request.supertokens.get_user_id()
    user = get_object_or_404(User, id=user_id)
    org_id = user.organization.id
    dash_id = request.GET.get('dash_id', None)
    print("dash_id: ", dash_id, "org_id: ", org_id)
    dashboard = get_object_or_404(Dashboard, dash_id=dash_id, organization=org_id)
    return JsonResponse({'data': dashboard.title}, status=200)


@api_view(["GET"])
@verify_session()
def get_dashboard_tiles(request: HttpRequest):
    print("get tiles request called")
    user_id = request.supertokens.get_user_id()
    dash_id = request.GET.get('dash_id', None)
    user = get_object_or_404(User, id=user_id)
    org_id = user.organization.id
    print("dash_id: ", dash_id)
    tiles = Tile.objects.filter(dash_id=dash_id, organization=org_id)
    print("filtered tiles: ", tiles)
    serializer = TileSerializer(tiles, many=True)
    print("data", serializer.data)
    return JsonResponse({'data': serializer.data}, status=200)


@api_view(["POST"])
@verify_session()
def create_dashboard_tile(request: HttpRequest):
    try:
        dash_id = request.data.get('dash_id', None)
        print(dash_id)
        if not dash_id:
            return JsonResponse({'error': "Dash_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        user_id = request.supertokens.get_user_id()
        user = get_object_or_404(User, id=user_id)
        org_id = user.organization.id
        db_uri = user.organization.database_uri
        response : State = response_pipeline(request.data.get('description'), db_uri, org_id)
        print("Pipeline complete")
        request.data['organization'] = org_id
        request.data['sql_query'] = response.sql_query
        request.data['component'] = response.visualization.get('visualization', '')
        request.data['tile_props'] = response.formatted_data
        print(request.data)
        serializer = TileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'data': serializer.data}, status=201)
        print(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
