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

You are allowed to use common table expressions or views if that simplifies the query.
Important: Whenever possible, sort the results by the x-axis.
             
THE RESULTS SHOULD ONLY BE IN THE FOLLOWING FORMAT, SO MAKE SURE TO ONLY GIVE TWO OR THREE COLUMNS:
[[x, y]]
or 

[[label, x, y]].

Postgres is case-sensitive. Please make sure to add double quotes around the column names, table names, and schema names.

If a question involves searching for a string, always use the lower() function to search for strings and always compare with lower case string values, like:
SELECT * from "company" WHERE lower("name") IN ('apple', 'google');
This is a STRICT requirement.
             
If the question involves the preferences of specific items by certain groups, make sure to group the output by those groups.
The response should display preferences only for each specific group.
This is a STRICT requirement.

DATA UNIQUENESS REQUIREMENTS FOR LINE CHART OR SCATTER CHART:
1. For any dataset being visualized, enforce STRICT one-to-one mapping:
   - Each X-axis value must appear EXACTLY ONCE
   - Each Y-axis value must appear EXACTLY ONCE
   - No duplicates allowed on either axis
   - If duplicates exist, keep only the first occurrence

2. Example of INVALID data:
   x=1, y=100
   x=1, y=200  (INVALID: duplicate x=1)
   x=2, y=100  (INVALID: duplicate y=100)

3. Example of VALID data:
   x=1, y=100
   x=2, y=200
   x=3, y=300

4. This uniqueness requirement for line chart or bar chart MUST be enforced BEFORE any other data processing steps and BEFORE returning results.

Only after everything is done then apply limit 10

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
