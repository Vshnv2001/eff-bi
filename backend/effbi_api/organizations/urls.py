from django.urls import path
from . import organization_views

urlpatterns = [
    path("", organization_views.create_organization, name="create_organization"),
    path("<int:org_id>/", organization_views.organization_details, name="organization_details")
]
