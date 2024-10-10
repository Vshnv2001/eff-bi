from django.http import JsonResponse
from rest_framework import status

from ..views import add_permissions_to_user
from ..models import UserAccessPermissions
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from ..models import User


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
                table_id: id1,
    #          permissions: 'Admin'},
    #         {table_name: name2,
                table_id: id2,
    #          permissions: 'View'},
    #     ]
    # })
    """
    # Check that user is valid
    get_object_or_404(User, id=user_id)
    # Query the UserAccessPermissions table and get all instances of the current user's permission
    permissions = UserAccessPermissions.objects.filter(user_id=user_id).select_related('table_id')

    # {OrgTable: permission}
    table_permissions = {}
    for perm in permissions:
        # Admin permission is the highest level
        if perm.permission == 'Admin' or perm.table_id not in table_permissions:
            table_permissions[perm.table_id] = perm.permission

    data = [{
        'table_name': table.table_name,
        'table_id': table.id,
        'permissions': permission} for table, permission in table_permissions.items()
    ]
    return JsonResponse({'message': 'User permissions:', 'data': data}, status=status.HTTP_200_OK)


@api_view(["POST"])
def add_user_access_permissions(request):
    """
    Add permissions for a user to access a specific table.
    If 'Admin' permission is requested, 'View' permission will also be automatically granted.
    :param request: { user_email, table_id, permission }
    :return: JsonResponse(result, status=success)
    """
    # TODO: Add security checks to ensure requester is an Admin

    user_email = request.data.get('user_email', None)
    # Check if user exists
    user = get_object_or_404(User, email=user_email)

    user_id = user.id
    table_id = request.data.get('table_id')
    permission = request.data.get('permission')

    result, success = add_permissions_to_user(user_id, table_id, permission)
    return JsonResponse(result, status=success)


@api_view(["DELETE"])
def delete_user_admin_permission(request, user_email, table_id):
    """
    Delete permissions for a user's admin rights to a specific table.
    User still retains 'View' permissions.
    :param request: { user_email, table_id }
    :return: JsonResponse(result, status=success)
    """

    # Check if user exists
    user = get_object_or_404(User, email=user_email)

    user_id = user.id
    result, success = remove_user_permission(user_id, table_id, 'Admin')
    return JsonResponse(result, status=success)


@api_view(["DELETE"])
def delete_user_permissions(request, user_email, table_id):
    """
    Delete permissions for a user to access a specific table.
    :param request: { user_email, table_id }
    :return: JsonResponse(result, status=success)
    """
    # Check if user exists
    user = get_object_or_404(User, email=user_email)

    user_id = user.id
    result, success = remove_user_permission(user_id, table_id, 'Admin')
    if success != status.HTTP_200_OK:
        return JsonResponse(result, success)
    result, success = remove_user_permission(user_id, table_id, 'View')
    return JsonResponse(result, status=success)


def remove_user_permission(user_id, table_id, permission):
    """
    Utility function to add permissions for a user to a specific table.
    """
    permission = UserAccessPermissions.objects.filter(user_id=user_id, table_id=table_id, permission=permission)
    if not permission.exists():
        return {'error': 'User does not have this permission for this table'}, status.HTTP_404_NOT_FOUND

    permission.delete()
    return {'message': 'User permission removed successfully'}, status.HTTP_200_OK
