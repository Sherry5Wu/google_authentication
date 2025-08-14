# google_authoriation
Practice google authortiation flows.<br>

## High-level:
- Frontend: static HTML + Google Identity Services JS. A sign-in button issues an ID token (JWT) which the frontend POSTs to backend.<br>

- Backend: Fastify + google-auth-library verifies ID token and upserts user into SQLite (via Sequelize).<br>

- Compose: frontend on port 8080, backend on 3000, sqlite stored under ./data/database.sqlite

## File tree
project/
├─ backend/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
│     ├─ app.js
│     ├─ db/
│     │  ├─ index.js
│     │  └─ models/
│     │     └─ user.js
│     └─ README.md
├─ frontend/
│  ├─ Dockerfile
│  ├─ index.html.template
│  └─ entrypoint.sh
├─ docker-compose.yml
└─ .env

## Create a Google OAuth client ID
1. Go to Google Cloud Console<br>
  - Open: https://console.cloud.google.com/<br>
  - Sign in with your Google account.<br>
2. Create or Select a Project<br>
- At the top left, click the project selector dropdown.<br>
- Either:<br>
  - Select your existing project, or<br>
  - Click New Project, give it a name, and click Create.<br>

3. Set up the OAuth Consent Screen<br>
**This defines how your app appears when users log in with Google.**
- In the left sidebar: APIs & Services → OAuth consent screen<br>
- Fill out:<br>
  - App name (this is what users see in the Google login popup)<br>
  - User support email<br>
- User Type:<br>
  - External → Anyone with a Google account can use it (good for public apps; requires Google review if you request sensitive scopes).<br>
  - Internal → Only Google Workspace org members can use it (not for personal Gmail accounts).<br>
Click Save and Continue until you finish.<br>

4.  Create OAuth Client Credentials<br>
- Go to: APIs & Services → Credentials<br>
- Click Create Credentials → OAuth client ID<br>
- Application type → Select Web application<br>
- Name it something like "Web Login Dev"<br>
**Authorized JavaScript origins** (for browser-based requests):<br>
- http://localhost:3000 (for local dev)<br>
- https://your-domain.com (for production)<br>

**Authorized redirect URIs** (where Google sends users after login):<br>
- http://localhost:3000/auth/google/callback<br>
- https://your-domain.com/auth/google/callback<br>

Click **Create**.<br>

5. Save your keys<br>
- You’ll now see:<br>
  - Client ID → Public; used in your frontend login request.<br>
  - Client Secret → Private; store in backend .env only.<br>
- You can also click Download JSON for convenience.<br>

6. Test
- Use your OAuth Client ID in your app’s Google sign-in flow.<br>
- If you get a redirect_uri_mismatch error, double-check the redirect URI in Credentials matches exactly (no trailing slashes, same protocol).<br>

**💡 Key things to remember:**
- The project name in Google Cloud is for you only — users won’t see it.
- The App name in the OAuth consent screen is what users see during Google login.
- For dev and prod, you can either:
  - Create two OAuth clients in the same project
  - Or create separate projects (if you want total isolation)
