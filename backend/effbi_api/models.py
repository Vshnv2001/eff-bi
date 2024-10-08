from django.db import models

# Create your models here.

class User(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    
    class Meta:
        db_table = "users"
        managed = True
        app_label = "effbi_api"

class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    database_uri = models.CharField(max_length=255, default="")
    
    class Meta:
        db_table = "organizations"
        managed = True
        app_label = "effbi_api"


class OrgTables(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    # organization_name = models.CharField(max_length=100, default='')
    table_name = models.CharField(max_length=100)
    table_schema = models.TextField()
    column_descriptions = models.JSONField()
    column_types = models.JSONField()
    # Next Sprint: Add database_uri to this table
    
    class Meta:
        db_table = "organization_tables"
        managed = True
        app_label = "effbi_api"


class Dashboard(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    tiles = models.ManyToManyField('Tile')
    
    class Meta:
        db_table = "dashboards"
        managed = True
        app_label = "effbi_api"

class Tile(models.Model):
    id = models.AutoField(primary_key=True)
    dashboard = models.ForeignKey('Dashboard', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    sql_query = models.TextField()
    
    class Meta:
        db_table = "tiles"
        managed = True
        app_label = "effbi_api"

