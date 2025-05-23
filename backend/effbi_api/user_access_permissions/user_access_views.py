from django.http import JsonResponse
from rest_framework import status

from ..serializer import UserPermissionsSerializer
from ..models import UserAccessPermissions, OrgTables, User
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from ..models import User
from django.core.exceptions import ObjectDoesNotExist
import logging
from supertokens_python.recipe.session.framework.django.syncio import verify_session

logger = logging.getLogger(__name__)

@api_view(["GET"])
@verify_session()
def get_user_permissions_by_table(request, table_id):
    """
    Get all the users who have permission on the table.
    Response
    {
    data: [
        {
            user_id : id,
            user_email: email,
            permissions: 'Admin'
        },  
      ]
    }
    """
    try:
        table = get_object_or_404(OrgTables, id=table_id)
        user_id = request.supertokens.get_user_id()
        # logger.info(table)
        permissions = UserAccessPermissions.objects.select_related('user_id').filter(table_id=table_id)
        permissions_data = [
            {
                'user_id': permission.user_id.id,
                'user_email': permission.user_id.email,
                'permissions': permission.permission
            }
            for permission in permissions
        ]
        logger.info("TABLE PERMISSIONS DATA: " + str(permissions_data))

        filtered_permissions_data = filter_permissions(permissions_data)
        logger.info("FILTERED PERMISSIONS DATA: " + str(filtered_permissions_data))
        if not filtered_permissions_data:
            logger.info("NO PERMISSIONS FOUND")
            return JsonResponse({'message': 'No permissions found for this table.'}, status=204)

        return JsonResponse({'data': filtered_permissions_data})

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Table does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


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
    # logger.info("PERMISSIONS: " + str(permissions))

    # {OrgTable: permission}
    table_permissions = {}
    for perm in permissions:
        # Admin permission is the highest level
        if perm.permission == 'Admin' or perm.table_id not in table_permissions:
            table_permissions[perm.table_id] = perm.permission
    
    # logger.info("TABLE PERMISSIONS: " + str(table_permissions))

    data = [{
        'table_name': table.table_name,
        'table_id': table.id,
        'permissions': permission} for table, permission in table_permissions.items()
    ]
    # logger.info("DATA: " + str(data))
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
    remove_user_permission(user_id, table_id, 'Admin')
    result, success = remove_user_permission(user_id, table_id, 'View')
    return JsonResponse(result, status=success)


def remove_user_permission(user_id, table_id, permission):
    """
    Utility function to add permissions for a user to a specific table.
    """
    check = UserAccessPermissions.objects.filter(user_id=user_id, table_id=table_id, permission=permission)
    if not check.exists():
        return {'error': f'User does not have {permission} permission for this table'}, status.HTTP_404_NOT_FOUND

    check.delete()
    return {'message': 'User permission removed successfully'}, status.HTTP_200_OK


def filter_permissions(permissions):
    user_permissions = {}
    
    for perm in permissions:
        user_id = perm['user_id']
        
        if user_id not in user_permissions or perm['permissions'] == 'Admin':
            user_permissions[user_id] = perm
    
    return list(user_permissions.values())


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
    # Check that user is in the same organization before adding permissions
    user = get_object_or_404(User, id=user_id)
    table = get_object_or_404(OrgTables, id=table_id)
    if user.organization != table.organization:
        return {'error': 'User and table must be in the same organization'}, status.HTTP_400_BAD_REQUEST

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


def get_accessible_tables(user_id):
    """
    Get all tables that a user has access to (either admin or view).
    """
    permissions = UserAccessPermissions.objects.filter(user_id=user_id).select_related('table_id')
    tables = set([permission.table_id for permission in permissions])
    return tables
