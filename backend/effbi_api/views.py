from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

# Create your views here.

from .models import User, Organization

def health_check(request):
    return JsonResponse({'message': 'Server is running'}, status=200)

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


