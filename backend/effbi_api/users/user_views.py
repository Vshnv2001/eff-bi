from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from ..models import User, Organization
from ..serializer import UserSerializer


@api_view(["POST"])
def create_user(request):
    try:
        # print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # print(serializer)
            serializer.save()
            return JsonResponse(
                {'message': 'User created successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PATCH", "DELETE"])
def user_details(request, user_id):
    try:
        print(user_id)
        user = get_object_or_404(User, id=str(user_id))
        print("USER: ", user)

        if request.method == "GET":
            # Return user details
            serializer = UserSerializer(user)
            return JsonResponse({'message': 'User retrieved successfully', 'user': serializer.data}, status=200)

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
        print(e)
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

