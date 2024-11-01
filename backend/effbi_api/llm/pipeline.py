from .SQLValidator import SQLValidator
from .DatabaseManager import DatabaseManager
from .SQLAgent import SQLAgent
from .DataFormatter import DataFormatter
from .PrunerAgent import PrunerAgent
from .State import State
from ..helpers.access_check import get_accessible_table_names
import logging 

logger = logging.getLogger(__name__)

def response_pipeline(user_query: str, db_uri: str, organization_id: int, user_id: int):
    print("response pipeline")
    state = State()
    state.question = user_query
     
    accessible_table_names = get_accessible_table_names(user_id)
    logger.info("ACCESSIBLE TABLE NAMES: ", accessible_table_names)
    
    # Get the database schema
    db_manager = DatabaseManager(db_uri, organization_id)
    database_schema = db_manager.get_schema(accessible_table_names)
    
    state.database_schema = database_schema
    
    # Prune the database schema to identify relevant tables and columns
    pruner = PrunerAgent()
    parsed_question = pruner.prune(state)
    
    logger.info(parsed_question)
    
    state.parsed_question = parsed_question

    if not state.parsed_question['is_relevant']:
        state.error = "We do not have the necessary data to answer this question. Either check your database tables and ensure you have the correct permissions, or rephrase your question."
        return state

    # Pass the pruned schema to the SQL agent to generate a SQL query
    sql_agent = SQLAgent(db_manager)
    sql_query = sql_agent.generate_sql(state)

    if sql_query["sql_query"] == "NOT_RELEVANT":
        state.error = "We do not have the necessary data to answer this question. Either check your database tables and ensure you have the correct permissions, or rephrase your question."
        return state
    
    logger.info(type(sql_query))

    print("sql_query", sql_query)
    
    logger.info("SQL QUERY: ", sql_query)
    
    state.sql_query = sql_query.get('sql_query', '')
    
    # validate_and_fix_sql = sql_agent.validate_and_fix_sql(state)
    
    # logger.info("VALIDATE AND FIX SQL: ", validate_and_fix_sql)
    
    # state.sql_query = validate_and_fix_sql.get('corrected_query', '')
    
    sql_validator = SQLValidator()
    
    # Execute the SQL query and get the results
    results = db_manager.execute_query(state, sql_validator, 0)
    
    state.results = results
    
    # Format the results
    formatter = DataFormatter(state)
    visualization_choice = formatter.choose_visualization()
    logger.info("VISUALIZATION CHOICE: ", visualization_choice)
    state.visualization = visualization_choice
    try:
        formatted_data = formatter.format_data_for_visualization()
    except Exception as e:
        logger.info("Error formatting data for visualization: ", e)
        state.error = "We are unable to visualize the data. Please try a different question or provide more information."
        return state
    
    logger.info("FORMATTED DATA: ", formatted_data)

    return state

def refresh_dashboard_tile_pipeline(state: State, db_uri: str, organization_id: int):
    db_manager = DatabaseManager(db_uri, organization_id)

    sql_validator = SQLValidator()
    
    results = db_manager.execute_query(state, sql_validator, 0)
    state.results = results
    logger.info(f"RESULTS: {results}")
    formatter = DataFormatter(state)
    try:
        formatted_data = formatter.format_data_for_visualization()
        
    except Exception as e:
        logger.info("Error formatting data for visualization: ", e)
        state.error = "We are unable to visualize the data. Please try a different question or provide more information."
        raise Exception(state.error)
    
    logger.info(f"FORMATTED DATA: {formatted_data}")
    
    state.formatted_data = formatted_data
    return state