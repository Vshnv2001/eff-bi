import requests
import psycopg2
from typing import List, Any

from .SQLValidator import SQLValidator

from .State import State

from .SQLAgent import SQLAgent
from ..models import OrgTables
from django.core import serializers
import logging 

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, db_uri: str, organization_id: str):
        self.db_uri = db_uri
        self.organization_id = organization_id
        
    def get_schema(self, accessible_table_names: List[str]) -> dict:
        """Retrieve the database schema."""
        try:
            # Fetch all OrgTables rows where organization_id matches
            org_tables = OrgTables.objects.filter(organization_id=self.organization_id, table_name__in=accessible_table_names)
            # Convert the queryset to JSON
            org_tables_json = serializers.serialize('json', org_tables)
            # logger.info(org_tables_json)
            return org_tables_json
        except OrgTables.DoesNotExist:
            raise Exception(f"Database schema not found for organization {self.organization_id}")

    def execute_query(self, state: State, sql_validator: SQLValidator, num_tries:int = 0) -> List[Any]:
        """Execute SQL query on the remote database and return results."""
        try:
            conn = psycopg2.connect(self.db_uri)
            cursor = conn.cursor()
            print("state.sql_query", state.sql_query)
            cursor.execute(state.sql_query)
            results = cursor.fetchall()
            count = 0
            while len(results) == 0 and count < 5:
                error = "No Results found. Please modify the query to return results. Perhaps you can relax the filters?"
                validated_sql_query = sql_validator.validate_and_fix_sql(state, error)
                state.sql_query = validated_sql_query.get('corrected_query', state.sql_query)
                cursor.execute(state.sql_query)
                results = cursor.fetchall()
                count += 1
            logger.info("results ")
            logger.info(results)
            return results
        except Exception as e:
            print("Error executing query: ", str(e))
            print("Number of tries: ", num_tries)
            if num_tries >= 5:
                raise Exception(f"Error executing query: {str(e)}")
            else:
                validated_sql_query = sql_validator.validate_and_fix_sql(state, str(e))
                print("Validated SQL Query: ", validated_sql_query)
                state.sql_query = validated_sql_query.get('sql_query', state.sql_query)
                return self.execute_query(state, sql_validator, num_tries + 1)
