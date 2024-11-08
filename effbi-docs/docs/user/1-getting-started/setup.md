---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import signUpCreateOrg from '../../../images/sign-up-new-org.png';
import signUpExistingOrg from '../../../images/sign-up-existing-org.png';
import signUpWelcome from '../../../images/sign-up-welcome.png';

# Getting Started with Eff BI

Welcome to Eff BI! Let's discover how you can simplify Business Intelligence in less than 5 minutes.

## First Steps

Follow these steps to get started, whether you’re creating a new organization or joining an existing one. Let’s get you up and running with data insights quickly.

<Tabs queryString="current-os">
  <TabItem value="Create Organization" label="Create Organization">

    ## Creating Your Organization

    If you’re the <strong>first person</strong> from your company to join Eff BI, you’ll need to create an organization account.

    <img src={signUpCreateOrg} width="300"/>

    1. Go to the sign up page and click on <strong>"Create a new organization"</strong> as seen in the image above.

    2. Enter your <strong>Organization Name</strong> when prompted.

    Congratulations! Your organization is now set up! 🎉

    ## Connecting Your Database

    Upon signing up, you will be greeted with our welcome message!

    <img src={signUpWelcome} width="300"/>

    1. Click on the <strong>"Go to Data Page"</strong> button to to start connecting your database.

    2. Paste your Database URI in the field provided and click on <strong>Save</strong>.

    :::info

    What is a Database URI?

    The Database URI is a unique identifier that allows Eff BI to securely access your data without making any changes.

    Don’t worry—we only access your data in a read-only format.

    :::

    And that’s it! Your account is ready, and you’re all set to explore insights from your data. That was fast!

  </TabItem>
  <TabItem value="Join Organization" label="Join Organization">

     ## Joining Your Organization

    Go to the sign up page and click on <strong>"Join an existing organization"</strong> as seen in the image below.

    <img src={signUpExistingOrg} width="300"/>

    You will then be prompted to enter your organization's code and that's it!

    :::info

    An organization code is a unique code to identify your company.

    In order to get the code, reach out to anyone in your company with an existing Eff BI account. In their account, click on the Profile icon in the top right corner in the navigation bar and then select Profile in the dropdown. The organization code can be found in that profile page.

    :::

    You are one step closer to gaining insights from your data!

  </TabItem>
</Tabs>
