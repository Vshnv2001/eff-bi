from django.http import JsonResponse
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from supertokens_python.recipe.multitenancy.syncio import list_all_tenants
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from .models import UserAccessPermissions
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import User, Organization, OrgTables
from .serializer import UserSerializer, OrganizationSerializer, UserPermissionsSerializer
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
def create_user(request):
    try:
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer)
            serializer.save()
            return JsonResponse(
                {'message': 'User created successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PATCH", "DELETE"])
def user_details(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)

        if request.method == "GET":
            # Return user details
            serializer = UserSerializer(user)
            return JsonResponse({'message': 'User retrieved successfully', 'user': serializer.data}, status=200)

        elif request.method == "PATCH":
            # Update user details where necessary
            serializer = UserSerializer(instance=user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {'message': 'User updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK
                )
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            # Delete user instance
            user.delete()
            return JsonResponse({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def create_organization(request):
    try:
        serializer = OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            organization = serializer.save()
            return JsonResponse(
                {'message': 'Organization created successfully', 'organization': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PATCH", "DELETE"])
def organization_details(request, org_id):
    try:
        organization = get_object_or_404(Organization, id=org_id)

        if request.method == "GET":
            # Return organization details
            serializer = OrganizationSerializer(organization)
            return JsonResponse(
                {'message': 'Organization retrieved successfully', 'organization': serializer.data}, status=200
            )

        elif request.method == "PATCH":
            # Update organization details where necessary
            serializer = OrganizationSerializer(instance=organization, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {'message': 'Organization updated successfully', 'organization': serializer.data}, status=200
                )
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            # Delete organization instance
            organization.delete()
            return JsonResponse({'message': f'Organization with id:{org_id} deleted successfully'}, status=204)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
@api_view(["GET"])
def get_users_by_organization(request, org_id):
    try:
        # Check that organization exists
        get_object_or_404(Organization, id=org_id)

        users = User.objects.filter(organization=org_id)
        serializer = UserSerializer(users, many=True)
        return JsonResponse(
            {'message': 'Users retrieved successfully', 'users': serializer.data}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(["GET"])
def get_user_access_permissions(request, user_id):
    """
    Get all permissions for a user
    :param request:
    :param user_id: relevant user id
    :return: JsonResponse(
    #    {'message': 'User permissions:',
    #     'data': [
    #         {table_name: name1,
    #          permissions: ['Admin']},
    #         {table_name: name2,
    #          permissions: ['View']},
    #     ]
    # })
    """
    # Check that user is valid
    get_object_or_404(User, id=user_id)
    # Query the UserAccessPermissions table and get all instances of the current user's permission
    permissions = UserAccessPermissions.objects.filter(user_id=user_id)
    serializer = UserPermissionsSerializer(permissions, many=True)

    data = []
    for permission in serializer.data:
        print(permission)
        data.append({
            # query table names from orgTable and map from tableid to name
            'table_name': OrgTables.objects.get(id=permission['table_id']).table_name,
            'permission': permission['permission']
        })
    return JsonResponse({'message': 'User permissions:', 'data': data}, status=200)


@api_view(["POST"])
def add_user_access_permissions(request):
    """
    Add permissions for a user to access a specific table
    :param request: { user_email, table_id, permission }
    :return:
    """
    user_email = request.data.get('user_email', None)
    # Check if user exists
    user = get_object_or_404(User, email=user_email)

    # Check if the permission already exists
    user_id = user.id
    table_id = request.data.get('table_id')
    permission = request.data.get('permission')
    if UserAccessPermissions.objects.filter(user_id=user_id, table_id=table_id, permission=permission).exists():
        return JsonResponse({'error': 'Permission already exists for this user and table'},
                            status=status.HTTP_409_CONFLICT)

    data = {
        'user_id': user.id,
        'table_id': request.data.get('table_id'),
        'permission': request.data.get('permission')
    }
    serializer = UserPermissionsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'User permissions added successfully'}, status=status.HTTP_201_CREATED)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
