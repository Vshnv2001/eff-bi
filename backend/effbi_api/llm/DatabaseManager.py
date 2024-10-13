import requests
import psycopg2
from typing import List, Any
from ..models import OrgTables
from django.core import serializers

class DatabaseManager:
    def __init__(self, db_uri: str, organization_id: str):
        self.db_uri = db_uri
        self.organization_id = organization_id
        
    def get_schema(self) -> dict:
        """Retrieve the database schema."""
        try:
            # Fetch all OrgTables rows where organization_id matches
            org_tables = OrgTables.objects.filter(organization_id=self.organization_id)
            # Convert the queryset to JSON
            org_tables_json = serializers.serialize('json', org_tables)
            # print(org_tables_json)
            return org_tables_json
        except OrgTables.DoesNotExist:
            raise Exception(f"Database schema not found for organization {self.organization_id}")

    def execute_query(self, sql_query: str) -> List[Any]:
        """Execute SQL query on the remote database and return results."""
        try:
            conn = psycopg2.connect(self.db_uri)
            cursor = conn.cursor()
            cursor.execute(sql_query)
            results = cursor.fetchall()
            print("printing results", results)
            return results
        except requests.RequestException as e:
            raise Exception(f"Error executing query: {str(e)}")
