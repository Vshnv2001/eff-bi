from rest_framework import serializers
from .models import Dashboard, Tile, User, Organization, UserAccessPermissions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"


class DashboardSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Dashboard
        fields = "__all__"


class TileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tile
        fields = "__all__"


class UserPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccessPermissions
        fields = "__all__"
