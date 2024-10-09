from django.http import JsonResponse
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from supertokens_python.recipe.multitenancy.syncio import list_all_tenants
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import User, UserAccessPermissions
from .helpers.table_preprocessing import get_database_schemas_and_tables, process_table
import concurrent.futures

from .serializer import UserPermissionsSerializer


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
def create_connection(request):
    try:
        uri = request.data.get('uri', None)
        user_id = request.data.get('user_id', None)
        if not uri or not user_id:
            return JsonResponse({'error': "Both uri and user_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        organization = user.organization

        # update organization with uri
        organization.database_uri = uri
        organization.save()

        db_data = get_database_schemas_and_tables(uri)
        if not db_data:
            return JsonResponse(
                {'error': "No data retrieved from the database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        tasks = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            for schema_name, tables in db_data.items():
                for table_name, table_info in tables.items():
                    task = executor.submit(process_table, schema_name, table_name, table_info, uri, organization)
                    tasks.append(task)

            for future in concurrent.futures.as_completed(tasks):
                org_table = future.result()
                org_table.save()
                add_permissions_to_user(user_id, org_table.id, 'Admin')

        return JsonResponse({'message': 'meta data created and saved'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def query_databases(request):
    text = request.data.get('text', None)
    org_id = request.data.get('org_id', None)
    user_id = request.data.get('user_id', None)

    if not text or not org_id or not user_id:
        return JsonResponse({'error': "Text, user_id and org_id are required"}, status=status.HTTP_400_BAD_REQUEST)

    # TODO: implement text to sql, execute sql, return ans
    # TODO: use websockets to stream the data to user
    # TODO: store history of the user's NLP and generated sql query
    return JsonResponse({'message': 'data generated!'}, status=200)


def add_permissions_to_user(user_id, table_id, permission):
    """
    Utility function to add permissions for a user to a specific table.
    """
    if UserAccessPermissions.objects.filter(user_id=user_id, table_id=table_id, permission=permission).exists():
        return {'error': 'Permission already exists for this user and table'}, status.HTTP_409_CONFLICT

    data = {
        'user_id': user_id,
        'table_id': table_id,
        'permission': permission
    }
    serializer = UserPermissionsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        # If 'Admin' permission is requested, 'View' permission will also be granted (if not already granted)
        if (permission == 'Admin' and
                not UserAccessPermissions.objects.filter(user_id=user_id, table_id=table_id,
                                                         permission='View').exists()):
            add_permissions_to_user(user_id, table_id, 'View')
        return {'message': 'User permissions added successfully'}, status.HTTP_201_CREATED
    else:
        return serializer.errors, status.HTTP_400_BAD_REQUEST


