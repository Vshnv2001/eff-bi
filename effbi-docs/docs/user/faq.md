---
title: Frequently Asked Questions
description: Frequently Asked Questions
---

# What does Admin Permissions mean?

Before we go into Admin permissions, let's talk about permissions. Permissions are applied on the table level, where each user can have no access, view access or admin access to a table.

:::info

A user with admin permissions does not mean that they can edit your database data. Eff BI does not allow anyone to tamper or edit your original data!

:::

If a user has admin permissions, they would be able to view the data in the table and grant other users view or admin permissions. View permission simply means that the user can only view the data.

# Why am I getting no permissions error when creating a tile?

This means that in your query to create a tile requires information from a table that you do not have access to. Reach out to an admin (Eff BI admin) in your organization to grant you permissions to that table to overcome this issue.

# Why am I unable to update my database URI?

Our system only supports 1 database URI per organization at the moment. As such, if your organization has previously added a database URI, you will not be able to change it for the time being. If you urgently need to update your database URI, do reach out to us at effortlessbi@gmail.com. Thank you for bearing with us as we continue to develop Eff BI!

# What happens if I make changes to my original database?

You can update Eff BI's snapshot of your data in the Data page, by clicking on the refresh button on the left bottom of the screen. This will update the view of the Data in Eff BI.

:::info

Tables that are delete in your database will also be removed from Eff BI at the Data page, but the tiles referencing that data will still be present in the dashboard. We don't want to delete those tiles for you in case they hold some important insights.

You will need to manually delete that tile if you no longer wish to see that data.

:::

# What is a Super Admin?

Super Admins are the Effortless BI coordinators of your organization. They have the highest level of permissions in the application and have admin permissions to all tables by default. They can grant admin/view permissions to other users in your company.

At the moment, we only support 1 person being the Super Admin.

# None of the above answers my question, what should I do?

We are here for you! Reach out to us via email at effortlessbi@gmail.com