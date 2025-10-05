const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'luct_reporting'
};
const JWT_SECRET = 'replace_this_with_a_real_secret_in_prod';

async function query(sql, params){ 
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute(sql, params);
  await conn.end();
  return rows;
}


app.post('/api/auth/register', async (req, res) => {
  const {name, email, password, role} = req.body;
  if(!name||!email||!password) return res.status(400).json({ok:false, message:'missing fields'});
  const hashed = await bcrypt.hash(password, 10);
  try {
    await query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name,email,hashed,role||'student']);
    res.json({ok:true});
  } catch(err){
    res.status(400).json({ok:false, message: err.message});
  }
});

app.post('/api/auth/login', async (req, res) => {
  const {email, password} = req.body;
  const rows = await query('SELECT id,name,email,role,password FROM users WHERE email=?', [email]);
  if(rows.length===0) return res.status(401).json({ok:false, message:'Invalid credentials'});
  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(401).json({ok:false, message:'Invalid credentials'});
  const token = jwt.sign({id:user.id, role:user.role}, JWT_SECRET, {expiresIn:'8h'});
  res.json({ok:true, user:{id:user.id, name:user.name, email:user.email, role:user.role}, token});
});


const auth = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ok:false, message:'No token'});
  const token = authHeader.split(' ')[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(err){ res.status(401).json({ok:false, message:'Invalid token'}); }
};


app.get('/api/users', async (req,res)=>{
  const rows = await query('SELECT id,name,email,role FROM users ORDER BY id LIMIT 500');
  res.json(rows);
});

// COURSES
app.get('/api/courses', async (req,res)=>{
  const q = req.query.q||'';
  const param = '%' + q + '%';
  const rows = await query('SELECT * FROM courses WHERE name LIKE ? OR code LIKE ? OR stream LIKE ? LIMIT 500', [param,param,param]);
  res.json(rows);
});
app.post('/api/courses', auth, async (req,res)=>{
  const {name, code, stream} = req.body;
  await query('INSERT INTO courses (name,code,stream) VALUES (?,?,?)', [name,code,stream]);
  res.json({ok:true});
});

// CLASSES
app.get('/api/classes', async (req,res)=>{
  const q = req.query.q||'';
  const param = '%' + q + '%';
  const rows = await query('SELECT * FROM classes WHERE class_name LIKE ? OR venue LIKE ? LIMIT 500', [param,param]);
  res.json(rows);
});
app.post('/api/classes', auth, async (req,res)=>{
  const {class_name, faculty_name, venue, scheduled_time, total_registered} = req.body;
  await query('INSERT INTO classes (class_name, faculty_name, venue, scheduled_time, total_registered) VALUES (?,?,?,?,?)',
    [class_name, faculty_name, venue, scheduled_time, total_registered]);
  res.json({ok:true});
});

// REPORTS 
app.post('/api/reports', auth, async (req,res)=>{
  const r = req.body;
  const sql = `INSERT INTO reports
    (faculty_name, class_name, week_of_reporting, date_of_lecture, course_name, course_code, lecturer_name,
      num_present, total_registered, venue, scheduled_time, topic_taught, learning_outcomes, recommendations)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  await query(sql, [
    r.faculty_name, r.class_name, r.week_of_reporting, r.date_of_lecture, r.course_name, r.course_code, r.lecturer_name,
    r.num_present, r.total_registered, r.venue, r.scheduled_time, r.topic_taught, r.learning_outcomes, r.recommendations
  ]);
  res.json({ok:true});
});

app.get('/api/reports', async (req,res)=>{
  const q = req.query.q||'';
  const param = '%' + q + '%';
  const rows = await query(`SELECT * FROM reports WHERE faculty_name LIKE ? OR class_name LIKE ? OR course_name LIKE ? OR lecturer_name LIKE ? ORDER BY date_of_lecture DESC LIMIT 1000`,
    [param,param,param,param]);
  res.json(rows);
});

// Export to Excel
app.get('/api/reports/export', async (req,res)=>{
  const rows = await query('SELECT * FROM reports ORDER BY date_of_lecture DESC');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reports');
  if(rows.length>0){ sheet.addRow(Object.keys(rows[0])); rows.forEach(r=>sheet.addRow(Object.values(r))); }
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="reports.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
});

// MONITORING & RATINGS 
app.get('/api/monitoring', async (req,res)=>{
  const reportsByCourse = await query('SELECT course_code, COUNT(*) as count FROM reports GROUP BY course_code');
  const avgAttendance = await query('SELECT AVG(num_present/NULLIF(total_registered,0))*100 as avg_pct FROM reports');
  res.json({reportsByCourse, avgAttendance: avgAttendance[0].avg_pct || 0});
});

app.post('/api/ratings', auth, async (req,res)=>{
  const {module, target_id, rating, comment, user_id} = req.body;
  await query('INSERT INTO ratings (module, target_id, rating, comment, user_id) VALUES (?,?,?,?,?)', [module, target_id, rating, comment, user_id]);
  res.json({ok:true});
});
app.get('/api/ratings', async (req,res)=>{
  const rows = await query('SELECT * FROM ratings ORDER BY created_at DESC LIMIT 500');
  res.json(rows);
});

// Dashboard 
app.get('/api/summary', async (req,res)=>{
  const totalReports = (await query('SELECT COUNT(*) as c FROM reports'))[0].c;
  const totalClasses = (await query('SELECT COUNT(*) as c FROM classes'))[0].c;
  const totalCourses = (await query('SELECT COUNT(*) as c FROM courses'))[0].c;
  const totalUsers = (await query('SELECT COUNT(*) as c FROM users'))[0].c;
  res.json({ totalReports, totalClasses, totalCourses, totalUsers });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log('Server running on', PORT));