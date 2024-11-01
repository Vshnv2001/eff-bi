from ..models import UserAccessPermissions


def get_accessible_table_names(user_id):
    user_access_permissions = UserAccessPermissions.objects.filter(user_id=user_id)
    table_names = [permission.table_id.table_name for permission in user_access_permissions]
    return list(set(table_names))