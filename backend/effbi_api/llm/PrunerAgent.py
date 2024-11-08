from .LLMManager import LLMManager
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import logging

logger = logging.getLogger(__name__)


class PrunerAgent:
    def __init__(self, model="gpt-4o"):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are a data analyst that can help summarize SQL tables and parse user questions about a database. 
Given the question and database schema, identify the relevant tables and columns. When in doubt about a table/column, always include it. 
Set is_relevant to false under the following conditions:
1. There is not enough information to answer the question.
2. The question is not relevant to any of the accessible tables.
3. An important column has a foreign key to a table that is not accessible.
4. You think the user is asking a malicious question. (example can be asking for the password of a user, asking to join tons of tables, etc.)

Your response should be in the following JSON format:
{{
    "is_relevant": boolean,
    "relevant_tables": [
        {{
            "table_name": string,
            "columns": [string],
            "column_descriptions": dict,
            "column_types": dict,
            "noun_columns": [string]
        }}
    ]
}}

The "noun_columns" field should contain only the columns that are relevant to the question and contain nouns or names, for example, the column "Artist name" contains nouns relevant to the question "What are the top selling artists?", but the column "Artist ID" is not relevant because it does not contain a noun. Do not include columns that contain numbers.
'''),
            ("human",
             "===User question:\n{question}\n\n===Database schema:\n{schema}\n\nIdentify relevant tables and columns:")
        ])
        self.llm_manager = LLMManager(model)

    def prune(self, state):
        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(
            self.prompt, question=state.question, schema=state.database_schema)
        logger.info(response)
        output = output_parser.parse(response)
        return output
