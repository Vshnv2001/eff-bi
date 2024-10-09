from django.urls import path
from . import user_views

urlpatterns = [
    path("", user_views.create_user, name="create_user"),
    path("<str:user_id>/", user_views.user_details, name="user_details"),
    path("org/<int:org_id>/", user_views.get_users_by_organization, name="get_users_by_organization")
]
