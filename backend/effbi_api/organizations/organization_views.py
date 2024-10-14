from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from ..models import Organization
from ..serializer import OrganizationSerializer

@api_view(["POST"])
def create_organization(request):
    try:
        # print(request.data)
        name = request.data.get('name', None)
        database_uri = request.data.get('database_uri', "")
        
        max_id = Organization.objects.order_by('-id').first()
        if max_id:
            max_id = max_id.id
        else:
            max_id = 0
        
        if not name:
            return JsonResponse({'error': 'Organization name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        organization = Organization(id=max_id + 1, name=name, database_uri=database_uri)
        organization.save()

        # Prepare response data
        organization_data = {
            'id': organization.id,
            'name': organization.name,
            'database_uri': organization.database_uri,
        }

        return JsonResponse(
            {'message': 'Organization created successfully', 'organization': organization_data},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        # print(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET", "PATCH", "DELETE"])
def organization_details(request, org_id):
    try:
        organization = get_object_or_404(Organization, id=org_id)

        if request.method == "GET":
            # Return organization details
            serializer = OrganizationSerializer(organization)
            return JsonResponse(
                {'message': 'Organization retrieved successfully', 'organization': serializer.data}, status=200
            )

        elif request.method == "PATCH":
            # Update organization details where necessary
            serializer = OrganizationSerializer(instance=organization, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {'message': 'Organization updated successfully', 'organization': serializer.data}, status=200
                )
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            # Delete organization instance
            organization.delete()
            return JsonResponse({'message': f'Organization with id:{org_id} deleted successfully'}, status=204)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

