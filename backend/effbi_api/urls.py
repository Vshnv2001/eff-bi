from django.urls import path, include
from . import views

urlpatterns = [
    path("sessioninfo/", views.SessionInfoAPI.as_view()),
    path("tenants/", views.TenantsAPI.as_view()),
    path("health/", views.health_check, name="health_check"),
    path("users/", include("effbi_api.users.urls")),
    path("organizations/", include("effbi_api.organizations.urls")),
    path("user-access-permissions/", include("effbi_api.user-access-permissions.urls")),
    path("connection/", views.create_connection, name="create_connection"),
    path("query/", views.query_databases, name="query_databases"),
]
