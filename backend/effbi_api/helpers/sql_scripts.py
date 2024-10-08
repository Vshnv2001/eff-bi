schema_query_dict = {
    "postgres": "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema');",
    "mysql": "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql');",
    "mssql": "SELECT name FROM sys.databases WHERE name NOT IN ('master', 'model', 'msdb', 'tempdb');",
    "oracle": "SELECT owner FROM all_tables WHERE table_name NOT IN ('ALL_TABLES', 'ALL_TAB_COLUMNS', 'ALL_TAB_COLUMNS_TMP');",
    "sqlite": "SELECT name FROM sqlite_schema WHERE name NOT IN ('sqlite_sequence', 'sqlite_stat1');",
    "postgresql": "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema');",
}

schema_table_query_dict = {
    "postgres": f"""
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = %s;
                """,
    "mysql": f"""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = %s AND table_name = %s;
             """,
    "mssql": f"""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = %s AND table_name = %s;
             """,
    "oracle": f"""
                SELECT column_name, data_type
                FROM all_tab_columns
                WHERE owner = %s AND table_name = %s;
              """,
    "sqlite": f"""
                PRAGMA table_info(%s);
              """,
    "postgresql": f"""
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = %s;
                  """,
}