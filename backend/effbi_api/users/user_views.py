from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from ..models import User, Organization
from ..serializer import UserSerializer
import logging 

logger = logging.getLogger(__name__)


@api_view(["POST"])
def create_user(request):
    try:
        # logger.info(request.data)
        user_data = request.data.copy() 
        is_super_admin = user_data.pop('is_super_admin', False)

        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            # logger.info(serializer)
            serializer.save()

            if is_super_admin:
                organization_id = user_data.get("organization")
                try:
                    organization = Organization.objects.get(id=organization_id)
                    organization.super_user.append(user_data.get('id'))
                    organization.save()
                except Organization.DoesNotExist:
                    return JsonResponse(
                        {'error': f'Organization with id {organization_id} not found.'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )

            return JsonResponse(
                {'message': 'User created successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PATCH", "DELETE"])
def user_details(request, user_id):
    try:
        logger.info(user_id)
        user = get_object_or_404(User, id=str(user_id))
        logger.info("USER: " + str(user))

        if request.method == "GET":
            # Return user details
            serializer = UserSerializer(user)
            result_dict = serializer.data
            result_dict['organization_name'] = user.organization.name
            logger.info("RESULT DICT: " + str(result_dict))
            return JsonResponse({'message': 'User retrieved successfully', 'user': result_dict}, status=200)

        elif request.method == "PATCH":
            # Update user details where necessary
            serializer = UserSerializer(instance=user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {'message': 'User updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK
                )
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            # Delete user instance
            user.delete()
            return JsonResponse({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.info(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_users_by_organization(request, org_id):
    try:
        # Check that organization exists
        get_object_or_404(Organization, id=org_id)

        users = User.objects.filter(organization=org_id)
        serializer = UserSerializer(users, many=True)
        return JsonResponse(
            {'message': 'Users retrieved successfully', 'users': serializer.data}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_organization_uri(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)
        org_uri = user.organization.database_uri
        logger.info("hit get organization uri")
        return JsonResponse({'message': 'Organization URI retrieved successfully', 'database_uri': org_uri}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.info(str(e))
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)