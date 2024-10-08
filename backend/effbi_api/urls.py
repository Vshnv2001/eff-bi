from django.urls import path
from . import views

user_paths = [
    path("users/", views.create_user, name="create_user"),
    path("users/<int:user_id>/", views.user_details, name="user_details"),
    path("users/org/<int:org_id>/", views.get_users_by_organization, name="get_users_by_organization"),
]

organization_paths = [
    path("organizations/", views.create_organization, name="create_organization"),
    path("organizations/<int:org_id>/", views.organization_details, name="organization_details"),
]

connection_paths = [
    path("connection/", views.create_connection, name="create_connection"),
]

query_paths = [
    path("query/", views.query_databases, name="query_databases"),
]

user_access_paths = [
    path("user-access-permissions/<int:user_id>", views.get_user_access_permissions, name="user_access_permissions")
]

session_info_paths = [
    path("sessioninfo/", views.SessionInfoAPI.as_view()),
]

tenants_paths = [
    path("tenants/", views.TenantsAPI.as_view()),
]

urlpatterns = [
    path("health/", views.health_check, name="health_check"),
    *user_paths,
    *organization_paths,
    *connection_paths,
    *query_paths,
    *user_access_paths,
    *session_info_paths,
    *tenants_paths,
]

