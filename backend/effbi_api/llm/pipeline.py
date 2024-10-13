from .DatabaseManager import DatabaseManager
from .SQLAgent import SQLAgent
from .DataFormatter import DataFormatter
from .PrunerAgent import PrunerAgent
from .State import State


def response_pipeline(user_query: str, db_uri: str, organization_id: int):
    state = State()
    state.question = user_query
    
    # Get the database schema
    db_manager = DatabaseManager(db_uri, organization_id)
    database_schema = db_manager.get_schema()
    
    state.database_schema = database_schema
    
    # Prune the database schema to identify relevant tables and columns
    pruner = PrunerAgent()
    parsed_question = pruner.prune(state)
    
    print(parsed_question)
    
    state.parsed_question = parsed_question
    
    
    # Pass the pruned schema to the SQL agent to generate a SQL query
    sql_agent = SQLAgent(db_manager)
    sql_query = sql_agent.generate_sql(state)
    
    print(type(sql_query))
    
    print("SQL QUERY: ", sql_query)
    
    # if not sql_query.get('is_relevant', False):
    #     return {"sql_query": "NOT_RELEVANT", "is_relevant": False}
    
    state.sql_query = sql_query.get('sql_query', '')
    
    # validate_and_fix_sql = sql_agent.validate_and_fix_sql(state)
    
    # print("VALIDATE AND FIX SQL: ", validate_and_fix_sql)
    
    # state.sql_query = validate_and_fix_sql.get('corrected_query', '')
    
    # Execute the SQL query and get the results
    results = db_manager.execute_query(state.sql_query)
    
    state.results = results
    
    
    # # Format the results
    formatter = DataFormatter(state)
    visualization_choice = formatter.choose_visualization()
    print("VISUALIZATION CHOICE: ", visualization_choice)
    state.visualization = visualization_choice
    formatted_data = formatter.format_data_for_visualization()
    
    print("FORMATTED DATA: ", formatted_data)
    
    state.formatted_data = formatted_data
    
    return state
