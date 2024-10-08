from django.urls import path
from . import views

urlpatterns = [
    path("sessioninfo/", views.SessionInfoAPI.as_view()),
    path("tenants/", views.TenantsAPI.as_view()),
    path("health/", views.health_check, name="health_check"),
    path("users/", views.create_user, name="create_user"),
    path("users/<int:user_id>/", views.user_details, name="user_details"),
    path("users/org/<int:org_id>/", views.get_users_by_organization, name="get_users_by_organization"),
    path("organizations/", views.create_organization, name="create_organization"),
    path("organizations/<int:org_id>/", views.organization_details, name="organization_details"),
    path("connection/", views.create_connection, name="create_connection"),
    path("query/", views.query_databases, name="query_databases"),
    path("user-access-permissions/<int:user_id>", views.get_user_access_permissions, name="user_access_permissions")
]
