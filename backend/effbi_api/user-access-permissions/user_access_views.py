from django.http import JsonResponse
from ..views import add_permissions_to_user
from ..models import UserAccessPermissions
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from ..models import User, OrgTables
from ..serializer import UserPermissionsSerializer


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
    #          permissions: 'Admin'},
    #         {table_name: name2,
    #          permissions: 'View'},
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
        data.append({
            # query table names from orgTable and map from tableid to name
            'table_name': OrgTables.objects.get(id=permission['table_id']).table_name,
            'permission': permission['permission']
        })
    return JsonResponse({'message': 'User permissions:', 'data': data}, status=200)


@api_view(["POST"])
def add_user_access_permissions(request):
    """
    Add permissions for a user to access a specific table.
    If 'Admin' permission is requested, 'View' permission will also be automatically granted.
    :param request: { user_email, table_id, permission }
    :return: JsonResponse(result, status=success)
    """
    user_email = request.data.get('user_email', None)
    # Check if user exists
    user = get_object_or_404(User, email=user_email)

    user_id = user.id
    table_id = request.data.get('table_id')
    permission = request.data.get('permission')

    result, success = add_permissions_to_user(user_id, table_id, permission)
    return JsonResponse(result, status=success)


