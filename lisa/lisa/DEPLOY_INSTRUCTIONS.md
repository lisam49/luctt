LUCT Reporting - Deployment & Submission Instructions
====================================================

This file explains how to push to GitHub and deploy the frontend and backend.

1) Prepare Git repo
-------------------
git init
git add .
git commit -m "Initial LUCT reporting demo"
# Create remote on GitHub and push:
git remote add origin https://github.com/<your-username>/luct-reporting.git
git push -u origin main

2) Backend deployment (Render / Heroku)
---------------------------------------
- Ensure your database is hosted (Render managed PostgreSQL / ClearDB for Heroku / use ClearDB or remote MySQL).
- Set environment variables for DB and JWT_SECRET.
- On Render: create a new Web Service, connect to repo, set build command `npm install` and start command `node server.js`.
- On Heroku: create app, provision ClearDB MySQL addon, set config vars, push code via GitHub.

3) Frontend deployment (Netlify / Vercel)
-----------------------------------------
- Build the frontend: `cd frontend && npm ci && npm run build`.
- Push repo to GitHub and connect on Netlify/Vercel and set build command `npm run build` and publish directory `dist` (Vite default) or `build`.
- Ensure you set environment variable for API_BASE on frontend build if backend is hosted elsewhere.

4) GitHub Actions
-----------------
A sample workflow is added at `.github/workflows/deploy.yml`. Edit it to add real deployment steps and secrets.

5) Submission
-------------
- Push your repo to GitHub and submit the GitHub link.
- Host the live app URLs (frontend + backend) and submit links to classroom.

-- End of instructions
