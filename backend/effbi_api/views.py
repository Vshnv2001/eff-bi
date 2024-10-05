from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from supertokens_python.recipe.multitenancy.syncio import list_all_tenants
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from .models import User, Organization

class SessionInfoAPI(APIView):
    @method_decorator(verify_session())
    def get(self, request, format=None):
        session_ = request.supertokens
        return JsonResponse(
            {
                "sessionHandle": session_.get_handle(),
                "userId": session_.get_user_id(),
                "accessTokenPayload": session_.get_access_token_payload(),
            }
        )

class TenantsAPI(APIView):
    def get(self, request, format=None):
        tenantReponse = list_all_tenants()

        tenantsList = []

        for tenant in tenantReponse.tenants:
            tenantsList.append(tenant.to_json())

        return JsonResponse({
            "status": "OK",
            "tenants": tenantsList,
        })

def health_check(request):
    return JsonResponse({'message': 'Server is running successfully'}, status=200)

def create_user(request):
    return JsonResponse({'message': 'User created successfully'}, status=201)
        
def get_user(request, user_id):
    return JsonResponse({'message': 'User retrieved successfully'}, status=200)

def update_user(request, user_id):
    return JsonResponse({'message': 'User updated successfully'}, status=200)

def delete_user(request, user_id):
    return JsonResponse({'message': 'User deleted successfully'}, status=200)

def get_users_by_organization(request, org_id):
    return JsonResponse({'message': 'Users retrieved successfully'}, status=200)

def create_organization(request):
    return JsonResponse({'message': 'Organization created successfully'}, status=201)

def get_organization(request, org_id):
    return JsonResponse({'message': 'Organization retrieved successfully'}, status=200)

def update_organization(request, org_id):
    return JsonResponse({'message': 'Organization updated successfully'}, status=200)

def delete_organization(request, org_id):
    return JsonResponse({'message': 'Organization deleted successfully'}, status=200)