import psycopg2
from openai import OpenAI


client = OpenAI()

def get_database_schemas_and_tables(db_url):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Query to get all schemas
        cursor.execute("""
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema');
        """)
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
                cursor.execute(f"""
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = %s;
                """, (schema_name, table_name))
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
            f"Given the following table '{table_name}' in schema '{schema_name}' with columns: {col_names},\n"
            f"and the following sample data (first 3 rows):\n{formatted_data}\n"
            "Instructions:\n"
            "Generate a SHORT description for each column based on the sample data, in at most 100 words in simple text. \n"
            "Output format:\n"
            "{Summary : descrption of the table.}"
        )

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
               {"role" : "system", "content": "You are a helpful assistant reporting database information."},
               {"role": "user", "content": input_prompt}
            ]
        )

        response = completion.choices[0].message.content
        # print(response)

        return response

    except Exception as e:
        print(f"Error: {e}")
        return {}

    finally:
        cursor.close()
        conn.close()

