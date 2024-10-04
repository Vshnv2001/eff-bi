from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view

# Create your views here.

from .models import User, Organization
from .serializer import UserSerializer, OrganizationSerializer


@api_view(["GET"])
def health_check(request):
    return JsonResponse({'message': 'Server is running successfully'}, status=200)


@api_view(["POST"])
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


@api_view(["POST"])
def create_organization(request):
    try:
        serializer = OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            organization = serializer.save()
            return JsonResponse(
                {'message': 'Organization created successfully', 'organization': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_organization(request, org_id):
    return JsonResponse({'message': 'Organization retrieved successfully'}, status=200)

def update_organization(request, org_id):
    return JsonResponse({'message': 'Organization updated successfully'}, status=200)

def delete_organization(request, org_id):
    return JsonResponse({'message': 'Organization deleted successfully'}, status=200)


