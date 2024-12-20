from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class User(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    
    class Meta:
        db_table = "users"
        managed = True
        app_label = "effbi_api"


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    database_uri = models.CharField(max_length=255, blank=True, null=True, default="")
    super_user = ArrayField(
        models.CharField(max_length=255),  
        blank=True,                       
        default=list
    )
    
    class Meta:
        db_table = "organizations"
        managed = True
        app_label = "effbi_api"


class OrgTables(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    table_name = models.CharField(max_length=100)
    table_schema = models.TextField()
    column_descriptions = models.JSONField()
    column_types = models.JSONField()
    table_description = models.TextField(default='')
    
    class Meta:
        db_table = "organization_tables"
        managed = True
        app_label = "effbi_api"

class Dashboard(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    dash_id = models.IntegerField(editable=False)  # Make dash_id unique and non-editable
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    tiles = models.ForeignKey('Tile', on_delete=models.CASCADE, null=True)
    created_by = models.CharField(max_length=100, default='')

    def save(self, *args, **kwargs):
        if not self.dash_id:
            last_dash = Dashboard.objects.filter(organization=self.organization).order_by('-dash_id').first()
            self.dash_id = last_dash.dash_id + 1 if last_dash else 1
        super().save(*args, **kwargs)

    class Meta:
        db_table = "dashboards"
        managed = True
        app_label = "effbi_api"

class Tile(models.Model):
    id = models.AutoField(primary_key=True)
    dash_id = models.IntegerField(default=0)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, default=0)
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    sql_query = models.TextField(null=True, blank=True)
    tile_props = models.JSONField(default=dict, null=True, blank=True)
    component = models.CharField(max_length=100, default='')

    class Meta:
        db_table = "tiles"
        managed = True
        app_label = "effbi_api"



class UserAccessPermissions(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    table_id = models.ForeignKey('OrgTables', on_delete=models.CASCADE)
    permission = models.CharField(max_length=100, choices=[
        ('Admin', 'Admin'),
        ('View', 'View')
    ])

    class Meta:
        db_table = "user_access_permissions"
        managed = True
        app_label = "effbi_api"