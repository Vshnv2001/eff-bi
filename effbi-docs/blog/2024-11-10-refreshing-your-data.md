---
title: Refreshing your Database
description: Check out how we refresh your database in Eff BI
slug: Refreshing your Database
authors: [justin]
hide_table_of_contents: false
---

## Rationale Behind the Refresh Feature
During the development of Eff BI, we initially captured a snapshot of your database upon first connection via [your input database URI](https://eff-bi-docs.vercel.app/blog/How%20Eff%20BI%20Snapshots%20your%20Database). 
However, we quickly realized that data is not static— and constantly evolves. In the context of databases, new tables might be added, existing ones might be altered or removed altogether. 

Recognising this, we saw the critical need for a refresh feature. 
This functionality ensures that data within Eff BI remains updated and accurate. 
By capturing changes in the database, users are guaranteed access to the latest data, allowing them to gain meaningful and actionable insights.
We believe the refresh feature significantly enhances the overall longevity and usability of Eff BI.


## Implementating the Refresh Feature
When refreshing the database, Eff BI performs a series of checks to identify changes in the database schema.
We mark every table in the database into 3 categories:

### 1. New Table Added

When Eff BI detects new tables in your database, it immediately begins the process of integrating these tables into your organizational data model. This integration process is similar to the initial snapshot procedure we described in our previous blog post on [How Eff BI Snapshots your Database](https://eff-bi-docs.vercel.app/blog/How%20Eff%20BI%20Snapshots%20your%20Database).

Essentially, each new table undergoes a pre-processing phase where its structure, data types, and potential relationships with other tables are analyzed. This new table is added to the organisational dataset.

In addition to integrating the table, access control measures are automatically updated to grant access to all current Super Admins of the organization.

### 2. Existing Table Deleted

When our system detects that a table previously present is no longer available in the database, it promptly updates the internal metadata to reflect this change.

In hindsight, we recognise the importance of clearly communicating the irreversible nature of deleting tables in Eff BI upon refreshing. 
We should consider implementing a warning message for the deletion of tables via refresh so that users are not caught off guard by the deletion of tables. 

### 3. Table Schema Modified

For tables that do not fall into the categories of newly added or deleted, our approach remains proactive. We classify all other tables under this category, regardless of whether actual modifications to the table schema have occurred.

Instead of performing a column-by-column verifications for each table, we opt for a more streamlined process.
By re-running the entire snapshot process for the database and modifying metadata in-place, we effectively reduce the complexity of the code.
This method not only simplifies development but also enhances the reliability of our data.

This approach ensures that even if no changes have occurred, the snapshot refresh will verify and confirm the current state of the database, maintaining the accuracy and up-to-dateness of the data within Eff BI. 

## Atomic Transaction
To ensure data integrity during updates, Eff BI wraps the entire refresh process in a Django transaction.atomic() block. 
This method guarantees that all changes are treated as a single transaction, so that in the case of an error, 
our application rollbacks and reverts all changes to the pre-transaction state, maintaining the database’s integrity

## Optimizing with Concurrency

Eff BI leverages Python’s **concurrent.futures** module with **ThreadPoolExecutor** to optimize the refresh process.

To make this process faster, we leverage Python’s **concurrent.futures** module with **ThreadPoolExecutor**. Since querying GPT-4 and database columns is an I/O-bound task (primarily waiting for data responses), using threads speeds up our execution by processing multiple queries concurrently, significantly reducing wait times by more than 12x.

During the refresh, tables are categorized (new, deleted, or updated) and tasks related to each category are processed concurrently. 
- Task Isolation: Each table or schema change is handled in its own task, ensuring operations on different tables do not interfere with each other.
- Resource Synchronization: Eff BI prevents direct modification of shared resources, such as metadata schemas or data models, without proper synchronization.

## Summing Up
The refresh feature in Eff BI is a critical component that ensures the accuracy and freshness of data.
By categorizing tables into new, deleted, or modified, we streamline the process of updating the database schema.
By considering the various approaches, we ensure that the refresh process is efficient, reliable, and optimized for performance.
We are excited to continue enhancing this feature and look forward to sharing more insights in future posts :)