---
title: Querying Structured Data in Plain English
description: EffBI's multi-stage retrieval pipeline for querying structured data
slug: Querying Structured Data in Plain English
authors: [vaishnav]
hide_table_of_contents: false
---

No longer do you need to be a BI Developer or an SQL expert to query your data.

<!--truncate-->

At EffBI, we're on a mission to make data analysis accessible to everyone. We've built a system that allows you to query your data in natural language, without the need for SQL expertise. Link your database to EffBI, and you'll be able to ask questions like "What is the total revenue for the year?" or "How many customers did we onboard last month?" in plain English.

Our LLM Pipeline uses a multi-stage retrieval process to understand your query, perform complex computations on your data, and return the most appropriate visualization for your query so you can make data-driven decisions.

## How does it work?

To be able to answer questions, the first step is to understand the structure of your data. We do this by connecting to your database and retrieving the schemas, tables, and columns. Read *Bryan Ho*'s [blog post](http://eff-bi-docs.vercel.app/blog/How%20Eff%20BI%20Snapshots%20your%20Database) to learn more about how we connect to your database.

Once we have a snapshot of your data, we can begin to answer questions. The retrieval pipeline uses the following LLM Agents in the following order:

1. **Pruner Agent**: We first identify the tables and columns that are most relevant to the question. For example, if you ask "What is the total revenue for the year?", we know that we only need to look at tables that contain revenue data. Here, if your query is irrelevant to any table in your database, the pipeline is terminated early and the user is informed that the query is not possible.

2. **SQL Generation Agent**: Based on the pruned tables and columns as well as the user query, the SQL Generation Agent generates a SQL query that retrieves the most relevant data from your database.

3. **Query Execution Agent**: The Query Execution Agent connects to your database and executes the SQL query.

4. **Visualization Agent**: The Visualization Agent selects the most appropriate visualization for your query. We have fed it with a set of rules to determine the best visualization for your query and templates to generate the visualization.

5. **Formatter Agent**: Given a visualization type and the results of the SQL Query execution, the Formatter Agent formats the results into a JSON that forms the props that will be passed into our Frontend Chart Components. 

The JSON object returned by the Formatter Agent is then rendered on the frontend, giving you a beautiful and interactive chart to visualize your data.

