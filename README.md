# 🚀 Placement OS

An all-in-one placement preparation and opportunity tracking dashboard built with Next.js, Prisma, and Supabase. Keep track of your placement emails (via Gmail API), revise core subjects (DBMS, SQL, CN, System Design, OOPS, OS), and monitor your GitHub activity—all in one place!

## 📸 Screenshots

### Dashboard & Opportunity Tracker
![Dashboard](./Screenshots/dashboard.png)
*Track opportunities and sync Superset emails effortlessly.*

### Core Revision Hub
![Core Subjects](./Screenshots/core-revision.png)
*Access structured modules for core CS subjects.*

### Subject Deep-Dive (DBMS)
![DBMS Revision](./Screenshots/dbms-revision.png)
*Detailed topic breakdown and progress tracking.*

---

## ✨ Features
- 📧 **Automated Email Sync:** Integrates with Gmail API to fetch and organize Superset placement emails.
- 📚 **Core Subject Revision:** Dedicated study sections for DBMS, SQL, Computer Networks, System Design, OOPS, and OS.
- 🐙 **GitHub Integration:** View your recent GitHub activity and active projects via a custom dashboard.
- 🔐 **Secure Authentication:** Seamless login via Google OAuth using Auth.js (NextAuth).
- 🗄️ **Robust Database:** Powered by Prisma ORM and Supabase (PostgreSQL).

---

## 🛠️ Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth) + Google OAuth
- **APIs Used:** Google Gmail API, GitHub API

---

## 🚀 Step-by-Step Setup Guide

All the code is written and ready. You need to set up external services before the app will work. Follow these steps in order.

### Step 1: Create a Google Cloud Project (OAuth & Gmail API)

This gives you the OAuth credentials and Gmail API access.

> [!IMPORTANT]
> **Log in to Google Cloud using your personal `@gmail.com` account** and create the project there. This avoids organization-level restriction errors. The account that hosts the app doesn't have to be the one you log in with!

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it `Google Im Coming` (Google Cloud might not allow special characters, so use this or a similar name) → Click **Create**
4. Make sure the new project is selected

#### Enable Gmail API
5. Go to **APIs & Services** → **Library**
6. Search for **"Gmail API"**
7. Click on it → Click **Enable**

#### Configure OAuth Consent Screen
8. Go to **APIs & Services** → **OAuth consent screen**
9. Select **External** → Click **Create**
10. Fill in:
    - App name: `Google I'm Coming`
    - User support email: your personal email
    - Developer contact email: your personal email
11. Click **Save and Continue**
12. On the **Scopes** page, click **Add or Remove Scopes**
13. Add these scopes:
    - `openid`
    - `email`
    - `profile`
    - `https://www.googleapis.com/auth/gmail.readonly`
14. Click **Save and Continue**

#### Add Test Users (CRITICAL STEP)
15. On **Test Users**, click **Add Users**. 
> [!WARNING]
> **IMPORTANT FIX:** Type in your **official college/work email address** (the one you actually want to parse placement emails from, e.g. `your.name@college.edu`). You will use this email to sign into the app later.
16. Click **Save and Continue** → **Back to Dashboard**

#### Create OAuth Credentials
17. Go to **APIs & Services** → **Credentials**
18. Click **+ Create Credentials** → **OAuth client ID**
19. Application type: **Web application**
20. Name: `Google Im Coming Web`
21. Under **Authorized JavaScript origins**, add:
    ```
    http://localhost:3000
    ```
22. Under **Authorized redirect URIs**, add:
    ```
    http://localhost:3000/api/auth/callback/google
    ```
23. Click **Create**
24. **Copy the Client ID and Client Secret** — you'll need them in Step 4.

---

### Step 2: Create a Supabase Project (Database)

This gives you the PostgreSQL database.

1. Go to [Supabase](https://supabase.com/) and sign in
2. Click **New Project**
3. Name it `google-im-coming`
4. Set a **database password** (save this somewhere!)
5. Choose a region close to you
6. Click **Create new project** (wait for it to finish)

#### Get the Database URL
7. Go to **Project Settings** (gear icon) → **Database**
8. Scroll down to **Connection string** → select **URI**
9. Copy the connection string — it looks like:
   ```
   postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
10. Replace `[YOUR-PASSWORD]` with the password you set in step 4

> [!IMPORTANT]
> Use the **direct connection string** (port `5432`), NOT the pooler (port `6543`), for Prisma migrations. For the pooler URL, check Session mode on port `5432`.
> 
> Alternatively, look for "Direct connection" in the Database settings and use that URL.

---

### Step 3: Get a GitHub Personal Access Token (PAT)
To fetch your GitHub stats for the GitHub dashboard tab:
1. Go to [GitHub Settings -> Developer Settings -> Personal Access Tokens -> Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. Give it a note (e.g., "Placement OS"), and check the following scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read all user profile data)
4. Generate the token, copy it — you'll need it in Step 4.

---

### Step 4: Configure Environment Variables

1. In your project folder (`Google I'm Coming`), **copy** `.env.example` to `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```
   *(Or just duplicate it manually in your file explorer)*

2. Open `.env` and fill in your values:

   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
   
   GOOGLE_CLIENT_ID="your-client-id-from-step-1.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret-from-step-1"
   
   GITHUB_PAT="your_github_personal_access_token_from_step_3"
   
   AUTH_SECRET="run-the-command-below-to-generate"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Generate `AUTH_SECRET` by running this command in your terminal (or use `openssl rand -base64 32`):

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Paste the output as the value of `AUTH_SECRET`.

---

### Step 5: Push Database Schema

Run these commands in the project folder to install dependencies and set up the database:

```powershell
npm install
npx prisma generate
npx prisma db push
```

This creates all the tables (`User`, `Account`, `Session`, `Opportunity`, `OpportunityRole`, etc.) in your Supabase database.

You should see output like:
```
Your database is now in sync with your Prisma schema.
```

---

### Step 6: Run the App

```powershell
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Step 7: Use the App

1. **Sign in** — Click "Sign in with Google" on the landing page
2. > [!NOTE] 
   > **Log in using your official college/work email address** that you added as a test user in Step 1.
3. Google will show an "unverified app" warning (this is normal in dev since we are using a test app) — click **Continue**
4. Grant the Gmail read-only permission
5. You'll be redirected to the **Dashboard**
6. Click **"Sync Superset Emails"** to fetch your emails from the last 30 days
7. The app will parse job opportunities and display them as cards
8. Use the filters to search, sort, and filter by status/category
9. Click **"Mark as Registered"** on opportunities you've applied to
10. Click **"Apply on Superset ↗"** to open the original application link

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
