import os
from .LLMWrapper import LLMWrapper
from ..models import OrgTables

class TablePrunerAgent:
    def __init__(self):
        print("Initializing TablePrunerAgent")
        self.llm_wrapper = LLMWrapper(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))
        self.prompt_template = """
            You are a data analyst that can help summarize SQL tables and parse user questions about a database. 
            Given the question and database schema and metadata, identify the relevant tables and columns.  Do not change the column names.
            If the question is not relevant to the database or if there is not enough information to answer the question, set is_relevant to false.

            Sample JSON format:
            {{
                "is_relevant": boolean,
                "relevant_tables": [
                    {{
                        "table_name": string,
                        "columns": [
                            {{
                                "column_name": string,
                                "column_data_type": string,
                                "column_descriptor": string,
                            }}
                        ]        
                    }}
                ]
            }}
        """
        
        
    def _get_org_tables(self, organization_id):
        # Query the OrgTables to get tables for the given organization_id
        return OrgTables.objects.filter(organization_id=organization_id)
    
    def generate_response(self, prompt):
        # Generate a response for the given prompt
        return self.llm_wrapper.generate_response(prompt, self.prompt_template)

    def generate_prompt(self, user_query, organization_id):
        # Generate a prompt for the LLM to prune the tables
        tables = self._get_org_tables(organization_id)
        prompt = f"User query: {user_query}\n\n"
        prompt += f"Tables: {tables}\n\n"
        return prompt
