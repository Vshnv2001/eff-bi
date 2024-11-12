---
title: Querying Structured Data in Plain English
description: EffBI's multi-stage retrieval pipeline for querying structured data
slug: Querying Structured Data in Plain English
authors: [vaishnav]
hide_table_of_contents: false
---

You don't have to be proficient at BI Tools anymore to bring your data to life. Ask what you want in plain English and let EffBI handle the rest. Read on to learn more about how we do it.

<!--truncate-->

EffBI's LLM Pipeline uses a multi-stage retrieval process to understand your query, perform complex computations on your data, and return the most appropriate visualization for your query so you can make data-driven decisions.

## A short note on LLMs
LLMs are useful, provided you give it small amounts of context and specialize it with a niche set of instructions. Using a single LLM to query databases is not a good idea, as the LLM will hallucinate and make mistakes.

## So how does it work?

To be able to answer questions, the first step is for the LLM to understand the structure of your data. We do this by connecting to your database and retrieving the schemas, tables, and columns. Read *Bryan Ho*'s [blog post](http://eff-bi-docs.vercel.app/blog/How%20Eff%20BI%20Snapshots%20your%20Database) to learn more about how we connect to your database.

Once we have a snapshot of your data, we can begin to answer questions. The retrieval pipeline uses the following LLM Agents in the following order:

1. **Pruner Agent**: We first identify the tables and columns that are most relevant to the question. For example, if you ask "What is the total revenue for the year?", we know that we only need to look at tables that contain revenue data. Here, if your query is irrelevant to any table in your database, the pipeline is terminated early and the user is informed that the query is not possible.

2. **SQL Generation Agent**: Based on the pruned tables and columns as well as the user query, the SQL Generation Agent generates a SQL query that retrieves the most relevant data from your database.

3. **Query Execution Agent**: The Query Execution Agent connects to your database and executes the SQL query.

4. **Visualization Agent**: The Visualization Agent selects the most appropriate visualization for your query. We have fed it with a set of rules to determine the best visualization for your query and templates to generate the visualization.

5. **Formatter Agent**: Given a visualization type and the results of the SQL Query execution, the Formatter Agent formats the results into a JSON that forms the props that will be passed into our Frontend Chart Components. 

The JSON object returned by the Formatter Agent is then rendered on the frontend, giving you a beautiful and interactive chart to visualize your data.

## Handling Errors in SQL Generation

Even with the specialization we accorded LLMs, they are still susceptible to hallucinations and can make errors. This can be costly, as an incorrect SQL query generated can lead to an execution error, terminating the retrieval pipeline early even though minor modifications can fix the query and retrieve the correct data for the user. 

When faced with this error, we considered two approaches:

1. Creating a validator agent that "eyeballs" the SQL query generated and validates it. If the query is incorrect, the agent will attempt to fix it.

2. Correct the SQL Query generated over 5 iterations, passing the original query and the error message into the next iteration. 

We chose the second approach as there was no guarantee that the validator agent would be able to fix the query without the error message. The error message itself is a good indicator of what went wrong, and we can use it to iteratively fix the query.

## Problems of Inappropriate Visualization

We initially didn't have a table template. This meant that when the LLM felt there was no appropriate visualization, it would return a NULL visualization, despite there being data. We felt that in this case, the user should at least see a table visualization of the data. With tweaking our prompting strategy, we were able to not only get the LLM to return a table visualization but also attempt its best to choose a chart and not lazily return a table visualization for every query.

## Results and Conclusion

We were able to obtain around a 90% success rate in retrieving the correct data for the user's query. We are still fine-tuning the prompting strategy to improve the retrieval rate even further. The SQL query generated is also of high quality, though with weak prompting from the user, it is not uncommon to see the LLM generate a query that is syntactically correct but not semantically correct.

However, this is due to the current state of the art in LLMs. Even with ChatGPT, the quality of answers are dependent on the quality of the prompt, and how well the user is able to express their query. We are working on improving the prompting strategy to improve the quality of the answers even further.

