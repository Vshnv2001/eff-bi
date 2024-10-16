import psycopg2

from backend.effbi_api.models import OrgTables

def get_sample_table_data(table_ids, db_uri):
    '''
    Get the first 3 rows of data from the specified table.
    '''
    conn = psycopg2.connect(db_uri)
    cursor = conn.cursor()

    for table_id in table_ids:
        table = OrgTables.objects.get(id=table_id)
        query = f"SELECT * FROM {table.table_name} LIMIT 3;"
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows
