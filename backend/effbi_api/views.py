from .helpers.table_processing import get_sample_table_data
from django.http import JsonResponse, HttpRequest
from .llm.State import State
from .llm.pipeline import refresh_dashboard_tile_pipeline, response_pipeline
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from supertokens_python.recipe.multitenancy.syncio import list_all_tenants
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from .models import Dashboard, Tile, User
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .serializer import DashboardSerializer, TileSerializer
import logging

logger = logging.getLogger(__name__)


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


@api_view(["GET"])
def health_check(request):
    return JsonResponse({'message': 'Server is running successfully'}, status=200)


@api_view(["POST"])
@verify_session()
def create_dashboard(request):
    try:
        user_id = request.supertokens.get_user_id()
        logger.info(user_id)
        user = get_object_or_404(User, id=user_id)
        org_id = user.organization.id
        request.data['organization'] = org_id
        request.data['created_by'] = user.first_name + " " + user.last_name
        logger.info(request.data)
        serializer = DashboardSerializer(data=request.data)
        if serializer.is_valid():
            dashboard = serializer.save()
            logger.info(dashboard)
            return JsonResponse(
                {'message': 'Dashboard created successfully',
                    'dashboard': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.info(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@verify_session()
def get_dashboards(request: HttpRequest):
    session = request.supertokens
    user_id = session.get_user_id()
    logger.info(user_id)
    user = get_object_or_404(User, id=user_id)
    org_id = user.organization
    dashboards = Dashboard.objects.filter(organization=org_id)
    serializer = DashboardSerializer(dashboards, many=True)
    return JsonResponse({'data': serializer.data}, status=200)


@api_view(["GET"])
@verify_session()
def get_dashboard_name(request: HttpRequest):
    logger.info("get_dashboard_name called")
    user_id = request.supertokens.get_user_id()
    user = get_object_or_404(User, id=user_id)
    org_id = user.organization.id
    dash_id = request.GET.get('dash_id', None)
    logger.info("dash_id: ", dash_id, "org_id: ", org_id)
    dashboard = get_object_or_404(
        Dashboard, dash_id=dash_id, organization=org_id)
    return JsonResponse({'data': dashboard.title}, status=200)


@api_view(["GET"])
@verify_session()
def get_dashboard_tiles(request: HttpRequest):
    logger.info("get tiles request called")
    user_id = request.supertokens.get_user_id()
    dash_id = request.GET.get('dash_id', None)
    user = get_object_or_404(User, id=user_id)
    org_id = user.organization.id
    logger.info("dash_id: ", dash_id)
    tiles = Tile.objects.filter(dash_id=dash_id, organization=org_id)
    logger.info("filtered tiles: ", tiles)
    serializer = TileSerializer(tiles, many=True)
    logger.info("data", serializer.data)
    return JsonResponse({'data': serializer.data}, status=200)

@api_view(["POST"])
@verify_session()
def create_dashboard_tile(request: HttpRequest):
    try:
        dash_id = request.data.get('dash_id')
        logger.info(dash_id)
        if not dash_id:
            return JsonResponse({'error': "Dash_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.supertokens.get_user_id()
        user = get_object_or_404(User, id=user_id)
        org_id = user.organization.id
        db_uri = user.organization.database_uri

        response: State = response_pipeline(request.data.get('description'), db_uri, org_id, user_id)
        logger.info("Pipeline complete")

        if response.error:
            logger.info(response.error)
            return JsonResponse({'error': response.error}, status=status.HTTP_400_BAD_REQUEST)

        response_data = request.data.copy()
        response_data['organization'] = org_id
        response_data['sql_query'] = response.sql_query
        response_data['component'] = response.visualization.get('visualization', '')
        response_data['tile_props'] = response.formatted_data

        logger.info(response_data)
        return JsonResponse(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@verify_session()
def save_dashboard_tile(request: HttpRequest):
    try:
        dash_id = request.data.get('dash_id', None)
        logger.info(dash_id)
        if not dash_id:
            return JsonResponse({'error': "Dash_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(request.data)
        serializer = TileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'data': serializer.data}, status=201)
        logger.info(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.info(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["POST"])
@verify_session()
def refresh_dashboard_tile(request: HttpRequest):
    tile_id = request.data.get('tile_id', None)
    logger.info(tile_id)
    tile = get_object_or_404(Tile, id=tile_id)
    logger.info(tile)
    chart_type = tile.component
    sql_query = tile.sql_query
    db_uri = tile.organization.database_uri
    user_id = request.supertokens.get_user_id()
    state = State()
    state.sql_query = sql_query
    state.visualization = {"visualization": chart_type}
    state.question = tile.description
    try:
        response: State = refresh_dashboard_tile_pipeline(state, db_uri, tile.organization.id)
        logger.info(response)
        updated_tile = Tile.objects.get(id=tile_id)
        updated_tile.tile_props = response.formatted_data['formatted_data_for_visualization']
        updated_tile.save()
        serializer = TileSerializer(updated_tile)
        return JsonResponse({'data': serializer.data}, status=200)
    except Exception as e:
        logger.info(e)
        return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
