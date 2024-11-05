from ..models import OrgTables
from .ErrorMsgGenerator import ErrorMsgGenerator
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
    state = State()
    state.question = user_query
     
    accessible_table_names = get_accessible_table_names(user_id)
    state.accessible_table_names = accessible_table_names
    logger.info("ACCESSIBLE TABLE NAMES: " + str(accessible_table_names))
    
    state.total_tables = [table.table_name for table in OrgTables.objects.filter(organization_id=organization_id)]
    
    # Get the database schema
    db_manager = DatabaseManager(db_uri, organization_id)
    database_schema = db_manager.get_schema(accessible_table_names)
    
    state.database_schema = database_schema
        
    # Prune the database schema to identify relevant tables and columns
    pruner = PrunerAgent()
    parsed_question = pruner.prune(state)
    
    state.parsed_question = parsed_question
    
    # logger.info("PARSED QUESTION: " + str(state.parsed_question))

    if not state.parsed_question['is_relevant']:
        error_msg_generator = ErrorMsgGenerator()
        error_msg = error_msg_generator.generate_error_msg(state)
        logger.info("ERROR MSG: " + str(error_msg))
        if error_msg.get('error_type') == "INSUFFICIENT_PERMISSIONS":
            state.error = "You do not have permissions to answer this question. Please contact your administrator for access."
        else:
            state.error = "Your organization database does not have necessary data to answer this question. Please contact your administrator to ensure the necessary tables are added to your database."
        return state

    # Pass the pruned schema to the SQL agent to generate a SQL query
    sql_agent = SQLAgent(db_manager)
    sql_query = sql_agent.generate_sql(state)
    
    logger.info("SQL QUERY: " + str(sql_query))

    if sql_query["sql_query"] == "NOT_RELEVANT":
        state.error = "Your question is not relevant to the data in your database. Please modify your question or update your database."
        return state
    
    
    state.sql_query = sql_query.get('sql_query', '')
    
    sql_validator = SQLValidator()
    
    # Execute the SQL query and get the results
    try:
        results = db_manager.execute_query(state, sql_validator, 0)
    except Exception as e:
        logger.error("Error executing query: " + str(e))
        state.error = "We were unable to generate a valid SQL query. Please rephrase your question."
        return state
    
    state.results = results
    
    # Format the results
    formatter = DataFormatter(state)
    visualization_choice = formatter.choose_visualization()
    logger.info("VISUALIZATION CHOICE: " + str(visualization_choice))
    state.visualization = visualization_choice
    try:
        formatted_data = formatter.format_data_for_visualization()
    except Exception as e:
        logger.info("Error formatting data for visualization: " + str(e))
        state.error = "We are unable to visualize the data. Please try a different question or provide more information."
        return state
    
    logger.info("FORMATTED DATA: " + str(formatted_data))

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