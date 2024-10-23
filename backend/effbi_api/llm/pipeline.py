from .DatabaseManager import DatabaseManager
from .SQLAgent import SQLAgent
from .DataFormatter import DataFormatter
from .PrunerAgent import PrunerAgent
from .State import State
from ..helpers.access_check import get_accessible_table_names


def response_pipeline(user_query: str, db_uri: str, organization_id: int, user_id: int):
    state = State()
    state.question = user_query
    
    accessible_table_names = get_accessible_table_names(user_id)
    print("ACCESSIBLE TABLE NAMES: ", accessible_table_names)
    
    # Get the database schema
    db_manager = DatabaseManager(db_uri, organization_id)
    database_schema = db_manager.get_schema(accessible_table_names)
    
    state.database_schema = database_schema
    
    # Prune the database schema to identify relevant tables and columns
    pruner = PrunerAgent()
    parsed_question = pruner.prune(state)
    
    print(parsed_question)
    
    state.parsed_question = parsed_question
    
    if not state.parsed_question.get('is_relevant', False):
        state.error = "We do not have the necessary data to answer this question. Either check your database tables and ensure you have the correct permissions, or rephrase your question."
        return state
    
    # Pass the pruned schema to the SQL agent to generate a SQL query
    sql_agent = SQLAgent(db_manager)
    sql_query = sql_agent.generate_sql(state)
    
    print(type(sql_query))
    
    print("SQL QUERY: ", sql_query)
    
    if not sql_query.get('is_relevant', False):
        state.error = "We do not have the necessary data to answer this question. Either check your database tables and ensure you have the correct permissions, or rephrase your question."
        return state

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
    try:
        formatted_data = formatter.format_data_for_visualization()
    except Exception as e:
        print("Error formatting data for visualization: ", e)
        raise e
    
    print("FORMATTED DATA: ", formatted_data)

    return state
