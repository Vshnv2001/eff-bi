from django.urls import path, include
from . import user_access_views

urlpatterns = [
    path("<str:user_id>/", user_access_views.get_user_access_permissions, name="get_user_access_permissions"),
    path("", user_access_views.add_user_access_permissions, name="add_user_access_permissions")
]
