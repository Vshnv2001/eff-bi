---
title: How Eff BI Snapshots your Database
description: Summary of how we take a snapshot of your database
slug: How Eff BI Snapshots your Database
authors: [bryan]
hide_table_of_contents: false
---

## What Happens When You Enter Your Database URI into Eff BI?

When you input your database URI into Eff BI, a series of processes start working behind the scenes to understand and structure your data for easy analysis and visualization. Let’s dive into each step to see how we achieve this.

### Step 1: Connecting to Your Database

The first step is connecting to your database using the **psycopg2** package, a powerful tool for establishing and maintaining reliable connections between Python applications and PostgreSQL databases. Psycopg2 allows us to efficiently query data while ensuring seamless data exchange and communication.

### Step 2: Retrieving Schemas, Tables, and Columns

After establishing the connection, Eff BI retrieves all schemas within your database. For each schema, we loop through its tables and, for each table, retrieve all column details. These foundational steps allow us to map out the database structure, setting up the framework for efficient data exploration during data visualization.

### Step 3: Using GPT-4 to Generate Column Descriptions

Once we have the columns for each table, we leverage the **GPT-4** model to generate clear, concise descriptions for each column. These descriptions help Eff BI understand your data more easily. Here’s an example of the prompt we use to obtain column descriptions:

```python
input_prompt = (
    "You are an expert at describing tables and columns.\n"
    f"Given the following table '{table_name}' in schema '{schema_name}' with columns: {col_names},\n"
    f"and the following sample data (first 3 rows):\n{formatted_data}\n"
    "Instructions:\n"
    "Generate a JSON object with the following format: {column_name: description of the column}. Generate descriptions in at most 10 words in simple text for each column.\n"
    "Output format:\n"
    "{column_name: description of the column}"
)
```

### Step 4: Creating Table Summaries

For each table, we also generate a brief, AI-powered summary that combines column descriptions to give users a quick overview of the table’s contents. We use a different prompt to keep the descriptions concise:

```python
input_prompt = (
    f"Given the following table '{table_name}' in schema '{schema_name}' with columns: {col_names},\n"
    "Generate a SHORT description for the table with at most 2 sentences in simple text.\n"
    f"Here is a sample of the first 3 rows of data from the table:\n{formatted_data}\n"
)
```

These AI-generated column and table descriptions are later used to identify relevant tables and columns, streamlining the process of generating visualizations and charts for users.

### Step 5: Optimizing with Concurrency

To make this process faster, we leverage Python’s **concurrent.futures** module with **ThreadPoolExecutor**. Since querying GPT-4 and database columns is an I/O-bound task (primarily waiting for data responses), using threads speeds up our execution by processing multiple queries concurrently, significantly reducing wait times by more than 12x.

Here is an example of the asynchronous code we wrote.

```python
with concurrent.futures.ThreadPoolExecutor() as executor:
            for schema_name, tables in db_data.items():
                for table_name, table_info in tables.items():
                    task = executor.submit(
                        process_table, schema_name, table_name, table_info, uri, organization)
                    tasks.append(task)

            for future in concurrent.futures.as_completed(tasks):
                org_table = future.result()
                org_table.save()
```

## Summing Up

These steps, from connecting to your database to generating descriptions and optimizing with concurrency, allow Eff BI to provide an intuitive, powerful user experience. By combining database and AI capabilities, Eff BI ensures that you can quickly explore, understand, and visualize your data. We’re excited to continue improving this process and look forward to sharing more technical insights in future posts.
