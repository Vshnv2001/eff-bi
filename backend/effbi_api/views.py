from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import User, Organization, OrgTables
from .serializer import UserSerializer, OrganizationSerializer
from .helpers.table_preprocessing import get_database_schemas_and_tables, get_column_descriptions


@api_view(["GET"])
def health_check(request):
    return JsonResponse({'message': 'Server is running successfully'}, status=200)


@api_view(["POST"])
def create_user(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse(
                {'message': 'User created successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PATCH", "DELETE"])
def user_details(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        if request.method == "GET":
            serializer = UserSerializer(user)
            return JsonResponse({'message': 'User retrieved successfully', 'user': serializer.data}, status=200)

        elif request.method == "PATCH":
            serializer = UserSerializer(instance=user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {'message': 'User updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK
                )
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            user.delete()
            return JsonResponse({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return JsonResponse({'error': f'No user with id:{user_id} exists'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(["GET", "PATCH", "DELETE"])
def organization_details(request, org_id):
    try:
        organization = Organization.objects.get(id=org_id)

        if request.method == "GET":
            serializer = OrganizationSerializer(organization)
            return JsonResponse(
                {'message': 'Organization retrieved successfully', 'organization': serializer.data}, status=200
            )

        elif request.method == "PATCH":
            serializer = OrganizationSerializer(instance=organization, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {'message': 'Organization updated successfully', 'organization': serializer.data}, status=200
                )
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            print(organization)
            organization.delete()
            return JsonResponse({'message': 'Organization deleted successfully'}, status=200)

    except Organization.DoesNotExist:
        return JsonResponse({'error': f'No organization with id:{org_id} exists'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_users_by_organization(request, org_id):
    try:
        organization = Organization.objects.get(id=org_id)
        users = User.objects.filter(organization=org_id)
        serializer = UserSerializer(users, many=True)
        return JsonResponse(
            {'message': 'Users retrieved successfully', 'users': serializer.data}, status=status.HTTP_200_OK
        )

    except Organization.DoesNotExist:
        return JsonResponse({'error': f'No organization with id:{org_id} exists'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def create_connection(request):
    try:
        uri = request.data.get('uri', None)
        org_id = request.data.get('org_id', None)

        if not uri or not org_id:
            return JsonResponse({'error': "Both uri and org_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        organization = get_object_or_404(Organization, id=org_id)
        organization.uri = uri
        organization.save()
        
        db_data = get_database_schemas_and_tables(uri)
    
        if not db_data:
            print("No data retrieved from the database.")
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        for schema_name, tables in db_data.items():
            for table_name, table_info in tables.items():
                
                column_types = {col_name: col_type for col_name, col_type in zip(table_info['columns'], table_info['types'])}
                column_descriptions = get_column_descriptions(table_name, schema_name, uri)

                org_table = OrgTables(
                    table_name=table_name,
                    table_schema=schema_name,
                    column_descriptions=column_descriptions,  
                    column_types=column_types,
                    organization=organization
                )
                org_table.save()
            return JsonResponse({'message': 'meta data created and saved'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
