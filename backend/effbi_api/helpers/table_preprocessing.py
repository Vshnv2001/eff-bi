import psycopg2
from openai import OpenAI
import os
from dotenv import load_dotenv
from .sql_scripts import schema_query_dict, schema_table_query_dict
import uuid
from ..models import OrgTables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_database_schemas_and_tables(db_url, db_type="postgres"):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Query to get all schemas
        cursor.execute(schema_query_dict[db_type])
        schemas = cursor.fetchall()

        result = {}

        # Loop through each schema
        for schema in schemas:
            schema_name = schema[0]
            result[schema_name] = {}

            # Query to get all tables for the current schema
            cursor.execute(f"""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = %s AND table_type = 'BASE TABLE';
            """, (schema_name,))
            tables = cursor.fetchall()

            # Loop through each table in the current schema
            for table in tables:
                table_name = table[0]
                result[schema_name][table_name] = []

                # Query to get all columns for the current table
                cursor.execute(schema_table_query_dict[db_type], (schema_name, table_name))
                columns = cursor.fetchall()

                # Add columns to the result
                columns_info = []
                column_types = []
                for column in columns:
                    columns_info.append(column[0])  # column name
                    column_types.append(column[1])  # column type
                
                result[schema_name][table_name] = {
                    'columns': columns_info,
                    'types': column_types
                }

        # Close the cursor and the connection
        cursor.close()
        conn.close()

        return result  # Return is dictionary

    except Exception as e:
        print(f"Error: {e}")
        return None
    
def process_table(schema_name, table_name, table_info, uri, organization):
    column_types = {col_name: col_type for col_name, col_type in zip(table_info['columns'], table_info['types'])}
    column_descriptions, table_description = get_column_descriptions(table_name, schema_name, uri)
    id = str(uuid.uuid4())
    
    return OrgTables(
        id=id,
        table_name=table_name,
        table_schema=schema_name,
        column_descriptions=column_descriptions,
        column_types=column_types,
        table_description=table_description,
        organization=organization
    )
    

def get_column_descriptions(table_name, schema_name, db_url):
    """
    Fetches the first 3 rows of the given table and generates descriptions for each column using OpenAI.
    """
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Fetch the first 3 rows of data from the table
        query = f"SELECT * FROM {schema_name}.{table_name} LIMIT 3;"
        cursor.execute(query)
        rows = cursor.fetchall()

        col_names = [desc[0] for desc in cursor.description]
        
        formatted_data = "\n".join([f"Row {i+1}: {row}" for i, row in enumerate(rows)])
        input_prompt = (
            "You are an expert at describing tables and columns. \n"
            f"Given the following table '{table_name}' in schema '{schema_name}' with columns: {col_names},\n"
            f"and the following sample data (first 3 rows):\n{formatted_data}\n"
            "Instructions:\n"
            "Generate a JSON object with the following format: {column_name: description of the column}. Generate descriptions in at most 10 words in simple text for each column. \n"
            "Output format:\n"
            "{column_name: description of the column}"
        )

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
               {"role" : "system", "content": "You are a helpful assistant reporting database information."},
               {"role": "user", "content": input_prompt}
            ]
        )

        column_descriptions = completion.choices[0].message.content
        # print(response)
        
        # Retrieve table descriptions
        input_prompt = (
            "Given the following table '{table_name}' in schema '{schema_name}' with columns: {col_names},\n"
            "Generate a SHORT description for the table in at most 100 words in simple text. \n"
            "Here is a sample of the first 3 rows of data from the table:\n{formatted_data}\n"
        )
        
        table_description = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role" : "system", "content": "You are a helpful assistant generating useful information about tables for another agent to do SQL query generation."},
                {"role": "user", "content": input_prompt}
            ]
        ).choices[0].message.content

        return column_descriptions, table_description

    except Exception as e:
        print(f"Error: {e}")
        return {}

    finally:
        cursor.close()
        conn.close()

