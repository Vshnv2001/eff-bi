from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health_check, name="health_check"),
    path("users/", views.create_user, name="create_user"),
    path("users/<int:user_id>/", views.user_details, name="user_details"),
    path("users/org/<int:org_id>/", views.get_users_by_organization, name="get_users_by_organization"),
    path("organizations/", views.create_organization, name="create_organization"),
    path("organizations/<int:org_id>/", views.organization_details, name="organization_details"),
    path("connection/", views.create_connection, name="create_connection")
]
