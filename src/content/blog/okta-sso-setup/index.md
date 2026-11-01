---
title: 'Okta single sign-on (SSO) setup: a step-by-step guide'
description: 'How to set up an Okta OIDC application for SSO: groups, role attributes, scopes, claims, access policies, event hooks for soft-deleting users, and optional MFA.'
pubDate: '2026-04-11'
canonicalUrl: 'https://dev.to/soldatov-ss/okta-single-sign-on-sso-setup-a-step-by-step-guide-3o4l'
tags: ['okta', 'sso', 'authentication', 'security']
---

## Configuring SSO authentication in Okta

After logging into the Okta panel, you will be redirected to the dashboard. From here, we will configure Okta to enable Single Sign-On (SSO) authentication for our application.


![Okta admin dashboard after signing in](./image-1.png)

## Assigning users to group

We need to add groups and add the required users to the appropriate group.

!Note: Only users who are **members** of this **group** will be able to sign in to your application.

In the side menu, navigate to the **Groups** page


![Okta side menu with the Groups page selected](./image-2.png)

then click to the **Add group** button


![Groups page with the Add group button](./image-3.png)

A modal window will appear with the configuration form.

Fill this form with the group name and description, then click the **Save** button.


![Add group modal with the group name and description filled in](./image-4.png)

In the side menu, navigate to the **People** page, then choose a particular person in the list and click to navigate to the **Person** page


![People page listing users in Okta](./image-5.png)

Click on the **Groups** subtitle to navigate to the profile page


![Person page with the Groups tab](./image-6.png)

Click on the **Search** field and enter the group name that you want to assign the user with, then click to the appearing group.


![Searching for a group name to assign the user to](./image-7.png)

### Creating an application

An application refers to a cloud or on-premises service integrated with Okta for single sign-on, enabling users to securely access and authenticate across multiple applications with a single set of credentials.

Next, navigate to the **Applications** page (as shown in the screenshot)


![Okta side menu with the Applications page selected](./image-8.png)

Click on the **Create App Integration** button


![Applications page with the Create App Integration button](./image-9.png)

A modal window will appear with configuration options. Select the options as shown in the screenshot, then click the **Next** button.


![Create a new app integration modal with the sign-in method and application type selected](./image-10.png)

You will be redirected to the configuration page:

Follow the instructions below and configure the settings as marked in the next two screenshots:

1. I will set my app name to "SSO OIDC", but you can use just "your application".
2. **Sign-in redirect URIs:** The format should be: 
`https://<your-user-pool-domain>/oauth2/idpresponse`
where `<your-user-pool-domain>` is your Cognito User Pool Domain

(example: **https://eu-north-2uasd2wr7mv.auth.eu-north-1.amazoncognito.com/oauth2/idpresponse**).

3. **Sign-out redirect URIs:** This ensures users are properly signed out when logging out of our application. 
Input: `https://yourapp.com/`
4. **Right holder access:** choose the **Limit access to selected groups** option and enter group names you want to give access to **your application** application.
5. Click on the **Save** button.


![New app integration settings with the app name and sign-in redirect URIs](./image-11.png)


![Sign-out redirect URIs and assignment settings limited to selected groups](./image-12.png)

You will then be redirected to the newly created application's page.


![Newly created SSO OIDC application page](./image-13.png)

## Configuring a user Okta profile (add roles to profile)

In **Okta**, we can define roles for users to manage permissions within our application.

These roles determine the level of access a user has, such as **admin**, **manager**, etc.

In the side menu, navigate to the **Profile Editor** page

Click to **User (default)** link to open User Okta Profile edit page:


![Profile Editor page with the User (default) profile link](./image-14.png)

Click on the **Add Attribute** button to add a new attribute for roles in the Okta User profile:


![User (default) profile with the Add Attribute button](./image-15.png)

A modal window will appear with configuration form.

Fill this form as shown in the following screenshot, then click the **Save** button.


![Add Attribute modal filled in for the user roles attribute](./image-16.png)

### Configuring an OIDC client profile for the app

In the side menu, navigate to the **Profile Editor** page:


![Okta side menu with the Profile Editor page selected](./image-17.png)

Click on the **SSO OIDC User** (**name of our application**) link to navigate to the OIDC Client Profile edit page:


![Profile Editor listing the SSO OIDC User app profile](./image-18.png)

Click on the **Add Attribute** button to add a new attribute for roles in the OIDC Client Profile.


![SSO OIDC User profile with the Add Attribute button](./image-19.png)

A modal window will appear with configuration form.

Fill this form as shown in the following screenshot, then click the **Save** button.


![Add Attribute modal filled in for the roles attribute on the OIDC client profile](./image-20.png)

Click on the **Mappings** button to configure the mapping between the Okta User Profile and the OIDC Client Profile:


![SSO OIDC User profile with the Mappings button](./image-21.png)

A modal window will appear with configuration fields for each relation.


![Mappings modal showing a field for each profile attribute](./image-22.png)

Slide to the last field, type in the field `user.userRoles`. Click on the relation button which mark on the following screenshot:


![Mapping user.userRoles to the roles attribute, with the relation button highlighted](./image-23.png)

Choose an **Apply mapping on user create and update** option:


![Mapping relation menu with Apply mapping on user create and update selected](./image-24.png)

Now, this should look like as shown below. Click on the **Save Mappings** button.


![Completed attribute mapping before clicking Save Mappings](./image-25.png)

## Configuring an API authorization

In the side menu, navigate to the **API** page

Click on the **default** link (I use **default_2**, because **default** in my account already configured), which is marked in the following screenshot:


![API page listing authorization servers with default_2 highlighted](./image-26.png)

### Configuring a group scope

Now, let's configure scopes to define the permissions our application can request.

Click on the **Scopes** subtitle to navigate to the scopes configuration page:


![Authorization server page with the Scopes tab](./image-27.png)

Click on the **Add Scope** button to add a new scope, which will be used for groups


![Scopes tab with the Add Scope button](./image-28.png)

A modal window will appear with configuration form. Fill this form as shown in the following screenshot, then click the **Create** button.

**!Important**: **Scope name** must be **"groups"**, values in the **"Display phrase"** and **"Description"** fields are not that important.


![Add Scope modal with the scope name set to groups](./image-29.png)

### Configuring role scope

Click on the **Add Scope** button to add a new scope, which will be used for roles


![Scopes tab with the Add Scope button for the roles scope](./image-30.png)

A modal window will appear with configuration form. Fill this form as shown in the following screenshot, then click the **Create** button.


![Add Scope modal filled in for the roles scope](./image-31.png)

### Configuring a new groups claim

Configuring a claim after the scope for Okta SSO ensures that the appropriate user attributes are securely included in the authentication token, enabling seamless access control and personalized experiences across integrated applications.

Click on the **Claims** subtitle to navigate to the claims configuration page:


![Authorization server page with the Claims tab](./image-32.png)

Click on the **Add Claim** button to add a new claim, which will be used for groups:


![Claims tab with the Add Claim button](./image-33.png)

A modal window will appear with configuration form. Fill this form as shown in the following screenshot, then click the **Create** button.

**!Important**: **Claim name** must be **"groups"** and **all** other values must be identical as on screenshot!


![Add Claim modal configured for the groups claim](./image-34.png)

### Configuring a new roles claim

Click on the **Add Claim** button to add a new claim, which will be used for **roles**.

A modal window will appear with configuration form. Fill this form as shown in the following screenshot, then click the **Create** button.


![Add Claim modal configured for the roles claim](./image-35.png)

### Configuring a new access policy

Access policies and rules in Okta SSO allow administrators to define and enforce conditions for user authentication, ensuring secure and granular control over who can access applications based on factors like location, device, and user group.

Click on the **Access Policies** subtitle to navigate to the access policies configuration page:


![Authorization server page with the Access Policies tab](./image-36.png)

Click on the **Add Policy** button to add a new policy:


![Access Policies tab with the Add Policy button](./image-37.png)

A modal window will appear with a configuration form. Fill this form as shown in the following screenshot, then click the **Create Policy** button.


![Add Policy modal filled in for the application](./image-38.png)

Click on the **Add rule** button to add a new rule


![Access policy with the Add rule button](./image-39.png)

A modal window will appear with the configuration form. Fill in this form as shown in the screenshot.

In the **"User is"** section, select the group you want to allow access to your application.
 In my case, it is the users from **"test_group"**.

You can also add individual users if needed.

Then, click the **Create rule** button.

Only users who are members of the selected group (and assigned the app) will be able to sign in.


![Add Rule modal with access limited to users in test_group](./image-40.png)

### Configuring a new event hooks

Event Hooks in **Okta SSO** allow your application to track IAM related events.
We will create an event hook that listens for two specific events:

- **User removed from group**
- **User deleted**

These events will trigger a **soft delete** of the corresponding user in your application.

In the side menu, navigate to the **Event hooks** page:


![Okta side menu with the Event Hooks page selected](./image-41.png)

Click on the **Create Event Hook** button to add an event hook


![Event Hooks page with the Create Event Hook button](./image-42.png)

A modal window will appear with a configuration form.

Fill this form as shown in the following screenshot, then click the **Save & Continue** button.


![Create Event Hook form with the endpoint and the user removed from group and user deleted events](./image-43.png)

Another more modal window will appear with a configuration form.

Click **Verify** to confirm that the webhook is active and reachable.


![Event hook verification modal with the Verify button](./image-44.png)

You will then be redirected to the newly created event hook page.


![Newly created event hook page](./image-45.png)

## Assigning user roles

In the side menu, navigate to the **People** page, then choose a particular person in the list and click to navigate to the **Person** page


![People page with a user selected](./image-46.png)

Click on the **Profile** subtitle to navigate to the profile page


![Person page with the Profile tab](./image-47.png)

Click on the **Edit** button to enable editing attributes of the profile. Slide down to the bottom of the page.


![User profile with the Edit button](./image-48.png)

Now, you can choose any number of roles from the list for the particular user. Click the **Save** button.


![Selecting roles for the user in the profile before saving](./image-49.png)

## Deleting users

### Delete user from group

To trigger a **soft-delete** of a user in your application, you need to either remove the user from an Okta group or fully delete the user from Okta IAM.

To soft-delete a user from all rights holders where the user was, you need to remove the user from the corresponding Okta group (the group with the **Group name** defined in your SSO Client Provider).

In the side menu, navigate to the **Groups** page and click on the group which you want to remove users:


![Groups page with the group to remove users from](./image-50.png)

Next to the user you want to remove, click on the cross (x) icon and the user will be removed.


![Group members list with the remove (x) icon next to a user](./image-51.png)

Once the user is removed from the group, they will be **soft-deleted** in your application.

**Note:** Users will be removed only when deleted from groups that are present in your app SSO Providers Group name, if not this event hook will be skipped.

### Delete user from IAM

In the side menu, navigate to the **People** page and select the the user which you want to delete:


![People page with the user to delete selected](./image-52.png)

You will be redirected to the User Profile page. Click on the **More Actions** button, then click **Deactivate** to deactivate the user.


![User profile More Actions menu with the Deactivate option](./image-53.png)

A modal window will appear with. Click **Deactivate.**


![Deactivate user confirmation modal](./image-54.png)

Then after the user deactivated, **the Delete** button will appear. Click **Delete** to completely delete the user from IAM.


![Deactivated user profile with the Delete button](./image-55.png)

A modal window will appear with. Click **Delete.**


![Delete user confirmation modal](./image-56.png)

After this, the selected user will be completely deleted from **Okta IAM**.

If a user with the **same email** exists in your application, that user will also be **soft-deleted** in your application.

## (Optional) Multi factor authentication

### Configuring global session policy

Multi-Factor Authentication (MFA) adds an additional layer of security to user login. When enabled, users must verify their identity using a second factor, such as the **Okta Verify app**, in addition to their password.

In the side menu, navigate to the **Global Session Policy** page. Сlick **Add policy** button


![Global Session Policy page with the Add policy button](./image-57.png)

A modal window will appear. Enter **Policy name, Policy Description** and assign it to the group you want to enforce MFA for. In my case this will be a group of **Everyone**. Click **Create policy and add rule**.


![Add policy modal with the name, description and Everyone group assigned](./image-58.png)

Another modal window will appear with adding policy rule. Enter **Rule name,** Set **MFA** to **Required,** In **User will be prompted for MFA,** select the desired option. Then click **Create rule.**


![Add rule modal with MFA set to Required](./image-59.png)


![Remaining global session policy rule settings with the Create rule button](./image-60.png)

### Configuring authentication policies

In the side menu, navigate to the **Authentication Policies** page and click on **App sign-in** button:


![Authentication Policies page with the App sign-in tab](./image-61.png)

You will be redirected to the **App sign-in policies** page. Click **Create policy** to add a new policy.


![App sign-in policies page with the Create policy button](./image-62.png)

In the modal window, provide a **Policy name** and **Description**, then click **Create Policy**.


![Create policy modal with the policy name and description](./image-63.png)

You will be redirected to your policy page. Click **Add rule.**


![Authentication policy page with the Add rule button](./image-64.png)

A modal window will appear. 
Enter **rule name**, select the **Groups** you want to enforce MFA for.Configure other fields as shown in the screenshots below. Then click **Save**.


![Add rule modal with the rule name and the groups to enforce MFA for](./image-65.png)


![Add rule modal authentication settings](./image-66.png)


![Remaining Add rule settings with the Save button](./image-67.png)

Your new authentication policy rule will be added.

### Configuring authenticators

In the side menu, navigate to the **Authenticators** page and click on **Enrollment** tab:


![Authenticators page with the Enrollment tab](./image-68.png)

Then click **Actions** next to the default policy and select **Edit**.


![Actions menu on the default enrollment policy with Edit selected](./image-69.png)

In the modal window that appears, ensure that **Okta Verify** is set to **Required**, then click Save.


![Edit enrollment policy modal with Okta Verify set to Required](./image-70.png)

**✅ That's it!**

Okta Multi-Factor Authentication (MFA) is now successfully configured.

## How to connect to your application

To enable **Okta login** for your users in **your application**, you need to retrieve the following three parameters:

1. **Client ID**
2. **Client Secret**
3. **Okta domain**

You can find this data on our Application details page. In the side menu (Okta panel), navigate to the **Applications**

Choose an application which you created previously. In my case, it is an SSO OIDC (marked below)


![Applications page with the SSO OIDC application highlighted](./image-71.png)

Instructions for copying the whole information that we should fill in your application can see below


![SSO OIDC application page showing the client ID and client secret](./image-72.png)


![Application settings showing the Okta domain](./image-73.png)

### Copy a issuer URL

To obtain the Issuer URL for your application, open: **https://{yourOktaDomain}/.well-known/openid-configuration** (In my case it is: https://integrator-1609932.okta.com/.well-known/openid-configuration)

Then copy the value of the **issuer** field from the returned JSON:


![OpenID configuration JSON with the issuer field highlighted](./image-74.png)

✅ **Now, you have all the required credentials to connect to your application!**
