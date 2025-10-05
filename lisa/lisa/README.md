LUCT Faculty Reporting - Full Demo Project

What's included:
- backend/: Node.js + Express server with auth (bcrypt + JWT), endpoints for courses, classes, reports, monitoring, ratings, and Excel export.
- frontend/: React + Vite app with Login/Register, Dashboard, Reports/Class/Course modules, search per module, export to Excel, monitoring & ratings demo.
- backend/seed.sql: full database schema + demo data (Sesotho names included).
- Start scripts: `npm start` in frontend runs vite dev server.

Setup (local with XAMPP/MySQL):
1. Import `backend/seed.sql` into your MySQL (phpMyAdmin) to create `luct_reporting` database and demo data.
2. Backend:
   - cd backend
   - npm install
   - update `server.js` dbConfig if your MySQL password is not empty
   - npm start
3. Frontend:
   - cd frontend
   - npm install
   - npm start
4. Open the frontend URL shown by Vite (usually http://localhost:5173).
5. Demo accounts: thato@example.com / password (lecturer), lerato@example.com / password (student)

Notes:
- This is a demo scaffold meeting assignment requirements: data entry form fields, search per module, Excel export, login/register, roles (student/lecturer/prl/pl), monitoring & ratings endpoints.
- For production, set a strong JWT secret and secure DB credentials.
