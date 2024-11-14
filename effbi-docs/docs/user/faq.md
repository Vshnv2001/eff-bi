---
title: Frequently Asked Questions
description: Frequently Asked Questions
---

# Frequently Asked Questions

## How can I use my own AI model for the text-to-visualization?

Currently, our hosted application doesn’t support selecting a custom AI model. However, since Eff BI is open source, you can clone our repository and easily configure your own model. We’ve designed the AI model integration in a plug-and-play style using LangChain as a wrapper around the LLM, making it straightforward to swap in your preferred model.

## Due to data privacy issues, I am unable to connect my database URI to Eff BI. Is there a workaround?

Yes, there are a couple of options.

Since Eff BI is an open-source project, you can clone the application directly from our GitHub repository and deploy it in your own environment, allowing you to maintain full control over your data.

Additionally, we’re working on an on-premise hosting option for our hosted application, which will allow you to keep your data within your infrastructure. Stay tuned as this feature is coming soon!

## What does Admin Permissions mean?

Before we go into Admin permissions, let's talk about permissions. Permissions are applied on the table level, where each user can have no access, view access or admin access to a table.

:::info

A user with admin permissions does not mean that they can edit your database data. Eff BI does not allow anyone to tamper or edit your original data!

:::

If a user has admin permissions, they would be able to view the data in the table and grant other users view or admin permissions. View permission simply means that the user can only view the data.

## Why am I getting no permissions error when creating a tile?

This means that in your query to create a tile requires information from a table that you do not have access to. Reach out to an admin (Eff BI admin) in your organization to grant you permissions to that table to overcome this issue.

## Why am I unable to update my database URI?

Our system only supports 1 database URI per organization at the moment. As such, if your organization has previously added a database URI, you will not be able to change it for the time being. If you urgently need to update your database URI, do reach out to us at effortlessbi@gmail.com. Thank you for bearing with us as we continue to develop Eff BI!

## What happens if I make changes to my original database?

You can update Eff BI's snapshot of your data in the Data page, by clicking on the refresh button on the left bottom of the screen. This will update the view of the Data in Eff BI.

:::info

Tables that are deleted in your database will also be removed from Eff BI in the Data page, but the tiles referencing that data will still be present in the dashboard. We don't want to delete those tiles for you in case they hold some important insights.

You will need to manually delete that tile if you no longer wish to see that data.

:::

## What is a Super Admin?

Super Admins are the Effortless BI coordinators of your organization. They have the highest level of permissions in the application and have admin permissions to all tables by default. They can grant admin/view permissions to other users in your company.

At the moment, we only support 1 person being the Super Admin.

## None of the above answers my question, what should I do?

We are here for you! Reach out to us via email at effortlessbi@gmail.com
