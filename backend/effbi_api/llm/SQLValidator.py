from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .State import State
from .LLMManager import LLMManager

class SQLValidator:
    def __init__(self):
        self.llm_manager = LLMManager()
        
    def validate_and_fix_sql(self, state: State, error: str) -> dict:
        """Validate and fix the generated SQL query."""
        sql_query = state.sql_query

        if sql_query == "NOT_RELEVANT":
            return {"sql_query": "NOT_RELEVANT"}
            
        schema = state.database_schema

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''
You are an SQL Correction Agent tasked with fixing SQL queries. You receive:
1. A SQL query that contains errors.
2. An error message that occurs when the query is run.

Your task is to modify the SQL query to correct the error. It is crucial that the corrected query is different from the original query, as the original is guaranteed to have errors.

Respond in JSON format with the following structure. Only respond with the JSON:
{{
    "corrected_query": string
}}

Ensure the corrected query addresses the error. Do not return the same query. If the error is unclear, make a reasonable assumption to correct the query.
'''),
            ("human", '''

===Faulty SQL query:
{sql_query}

===Error:
{error}

Respond in JSON format with the following structure. Only respond with the JSON:
{{
    "corrected_query": string
}}

For example, 
SQL Query: SELECT r.rank, COUNT(*) as count FROM results_sprints r JOIN stages s ON r.stage = s.nr WHERE r.location = 'Santa Sofia' AND r.rank IS NOT NULL AND r.rank != 'N/A' AND s.finish = 'Santa Sofia' GROUP BY r.rank ORDER BY r.rank LIMIT 5
Error: invalid input syntax for type integer: ""
Corrected Query: SELECT r.rank, COUNT(*) as count FROM results_sprints r JOIN stages s ON r.stage = s.nr WHERE r.location = 'Santa Sofia' AND r.rank IS NOT NULL AND s.finish = 'Santa Sofia' GROUP BY r.rank ORDER BY r.rank LIMIT 5
Make sure the corrected query addresses the error. In the above example, the error is due to the rank column being compared with a string.         
'''),
        ])

        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(prompt, schema=schema, sql_query=sql_query, error=error)
        print("Response: ", response)
        result = output_parser.parse(response)

        return {"sql_query": result["corrected_query"]}
