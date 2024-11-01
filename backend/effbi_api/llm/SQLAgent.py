from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .State import State
from .LLMManager import LLMManager


class SQLAgent:
    def __init__(self, db_manager):
        self.db_manager = db_manager
        self.llm_manager = LLMManager()

    def generate_sql(self, state: State) -> dict:
        """Generate SQL query based on parsed question and unique nouns."""

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''

You are an AI assistant that generates SQL queries based on user questions, database schema, and unique nouns found in the relevant tables. Generate a valid SQL query to answer the user's question.

Please do not put `` around the column names. Also, check the column descriptions (in schema) and types and make sure that the syntax of the input types are correct. A faulty example is "SELECT * FROM users WHERE age > '25'".
Another faulty example is SELECT rider, stage, rank FROM results_individual WHERE rank IS NOT NULL AND rider IS NOT NULL AND stage IS NOT NULL AND rank != ''. The error is invalid input syntax for type integer: ""
             
DO NOT do empty string checks like != '' or != 'N/A' on numeric columns.
             
You may get foreign keys. In that case, design the query in such a way that it uses the foreign key to get the data from the related table.

When dealing with aggregations:
1. Consider what level of detail (granularity) is needed before aggregating
2. Group by all relevant dimensions first if counting distinct occurrences
3. Use common table expressions to break down complex aggregations into steps

You are allowed to use common table expressions or views if that simplifies the query
             
THE RESULTS SHOULD ONLY BE IN THE FOLLOWING FORMAT, SO MAKE SURE TO ONLY GIVE TWO OR THREE COLUMNS:
[[x, y]]
or 

[[label, x, y]].

If there are more than 10 rows, only give the first 10 rows. This is a STRICT requirement.
             
For questions like "plot a distribution of the fares for men and women", count the frequency of each fare and plot it. The x axis should be the fare and the y axis should be the count of people who paid that fare.

SKIP ALL ROWS WHERE ANY COLUMN IS NULL or "N/A" or "".
Just give the query string. Do not format it. Make sure to use the correct spellings of nouns as provided in the unique nouns list. All the table and column names should be enclosed in backticks.
'''),
            ("human", '''===Database schema:
{schema}

===User question:
{question}

===Relevant tables and columns:
{parsed_question}

Generate SQL query string'''),
        ])

        response = self.llm_manager.invoke(
            prompt, schema=state.database_schema, question=state.question, parsed_question=state.parsed_question)

        if response.strip() == "NOT_ENOUGH_INFO":
            return {"sql_query": "NOT_RELEVANT"}
        else:
            return {"sql_query": response.strip()}
