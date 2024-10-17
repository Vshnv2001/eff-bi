import psycopg2

from ..models import OrgTables

def get_sample_table_data(table_ids, db_uri):
    '''
    Get the first 3 rows of data from the specified table.
    '''
    conn = psycopg2.connect(db_uri)
    cursor = conn.cursor()
    data = []

    for table in table_ids:
        query = f"SELECT * FROM {table.table_name} LIMIT 3;"
        cursor.execute(query)
        rows = cursor.fetchall()
        # Get column headers
        column_headers = [desc[0] for desc in cursor.description]

        data.append({
            "table_name": table.table_name,
            "column_headers": column_headers,
            "rows": rows,
            "table_description": table.table_description
        })

    cursor.close()
    conn.close()
    return data
