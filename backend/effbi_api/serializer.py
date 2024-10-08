from rest_framework import serializers
from .models import Dashboard, Tile, User, Organization


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"

class TileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tile
        fields = "__all__"
