from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .State import State
from .LLMManager import LLMManager
import logging

logger = logging.getLogger(__name__)

class ErrorMsgGenerator:
    def __init__(self):
        self.llm_manager = LLMManager()

    def generate_error_msg(self, state: State) -> str:
        user_query = state.question
        accessible_table_names = state.accessible_table_names
        total_tables = state.total_tables
        logger.info("ACCESSIBLE TABLE NAMES: " + str(accessible_table_names))
        logger.info("TOTAL TABLES: " + str(total_tables))
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful assistant that generates error messages for dashboard tiles.
             Given a user query, a list of tables that the user has access to, and the total list of tables in the database,
             choose one of two options:
             1. INSUFFICIENT_PERMISSIONS: The user query can be answered with tables that the organization has access to, but the user does not have access to the tables.
             2. INVALID_DATA: The organization does not have access to any of the tables that are needed to answer the user query.
             
             Return the chosen option as a JSON object with the following format:
             {{"error_type": "INSUFFICIENT_PERMISSIONS" | "INVALID_DATA"}}
             """),
            ("user", """
             User query: {user_query}
             Accessible table names: {accessible_table_names}
             Total table names: {total_tables}
             """),
        ])
        response = self.llm_manager.invoke(prompt, user_query=user_query, accessible_table_names=accessible_table_names, total_tables=total_tables)
        return JsonOutputParser().parse(response)