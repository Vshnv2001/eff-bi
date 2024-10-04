from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health_check, name="health_check"),
    path("users/", views.create_user, name="create_user"),
    path("users/<int:user_id>/", views.get_user, name="get_user"),
    path("users/update/<int:user_id>/", views.update_user, name="update_user"),
    path("users/delete/<int:user_id>/", views.delete_user, name="delete_user"),
    path("users/org/<int:org_id>/", views.get_users_by_organization, name="get_users_by_organization"),
    path("organizations/", views.create_organization, name="create_organization"),
    path("organizations/<int:org_id>/", views.get_organization, name="get_organization"),
    path("organizations/<int:org_id>/", views.update_organization, name="update_organization"),
    path("organizations/<int:org_id>/", views.delete_organization, name="delete_organization"),
]
