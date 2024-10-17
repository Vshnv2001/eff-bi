from django.urls import path, include
from . import views
from .users import user_views
from .user_access_permissions import user_access_views
from .organizations import organization_views

user_paths = [
    path("", user_views.create_user, name="create_user"),
    path("<str:user_id>/", user_views.user_details, name="user_details"),
    path("org/<int:org_id>/", user_views.get_users_by_organization, name="get_users_by_organization"),
    path("uri/<str:user_id>/", user_views.get_organization_uri, name="get_organization_uri"),
]

organization_paths = [
    path("", organization_views.create_organization, name="create_organization"),
    path("<int:org_id>/", organization_views.organization_details, name="organization_details"),
]

connection_paths = [
    path("connection/", views.create_connection, name="create_connection"),
]

dashboard_paths = [
    path("dashboard/", views.create_dashboard, name="create_dashboard"),
    path("dashboards/", views.get_dashboards, name="get_dashboards"),
]

query_paths = [
    path("query/", views.query_databases, name="query_databases"),
]

user_access_paths = [
    path("<str:user_id>/", user_access_views.get_user_access_permissions,
         name="get_user_access_permissions"),
    path("", user_access_views.add_user_access_permissions, name="add_user_access_permissions"),
    path("delete/<str:user_email>/<str:table_id>/", user_access_views.delete_user_permissions,
         name="delete_user_permissions"),
    path("delete-admin/<str:user_email>/<str:table_id>/",
         user_access_views.delete_user_admin_permission,
         name="delete_user_admin_permission"),
    path("table/<str:table_id>",
         user_access_views.get_user_permissions_by_table,
         name="get_user_permissions_by_table")
]

session_info_paths = [
    path("sessioninfo/", views.SessionInfoAPI.as_view()),
]

tenants_paths = [
    path("tenants/", views.TenantsAPI.as_view()),
]

urlpatterns = [
    path("health/", views.health_check, name="health_check"),
    path("users/", include(user_paths)),
    path("organizations/", include(organization_paths)),
    path("user-access-permissions/", include(user_access_paths)),
    path("connection/", views.create_connection, name="create_connection"),
    path("query/", views.query_databases, name="query_databases"),
    path("tables/<str:user_id>", views.get_view_data_tables, name="get_view_data_tables"),
    path("sessioninfo/", views.SessionInfoAPI.as_view()),
    path("tenants/", views.TenantsAPI.as_view()),
    path("dashboard/", views.create_dashboard, name="create_dashboard"),
    path("dashboards/", views.get_dashboards, name="get_dashboards"),
    path("dashboard-tiles/", views.get_dashboard_tiles, name="get_dashboard_tiles"),
    path("dashboard-tile/", views.create_dashboard_tile, name="create_dashboard_tile"),
]