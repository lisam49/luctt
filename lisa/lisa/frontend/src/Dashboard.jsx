import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart, BarElement, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ user, token, onLogout }) {
  const [tab, setTab] = useState('reports');
  const [summary, setSummary] = useState({});
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reportsPerCourse, setReportsPerCourse] = useState({ labels: [], data: [] });
  const [attendanceSeries, setAttendanceSeries] = useState({ labels: [], data: [] });
  const [averageAttendancePerCourse, setAverageAttendancePerCourse] = useState({ labels: [], data: [] });

  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [currentClassStudents, setCurrentClassStudents] = useState([]);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const [showQuickStats, setShowQuickStats] = useState(false);

  // ---------------- DEMO DATA ----------------
  const demoReports = [
    { id: 1, course_code: 'CS101', num_present: 20, total_registered: 25, date_of_lecture: '2025-10-01', lecturer: 'Dr. Thabiso', venue: 'Kamore 101', type: 'Lecture', notes: 'Basics of Programming' },
    { id: 2, course_code: 'CS102', num_present: 10, total_registered: 22, date_of_lecture: '2025-10-01', lecturer: 'Dr. Naledi', venue: 'Kamore 102', type: 'Lab', notes: 'Data Structures Practical' },
    { id: 3, course_code: 'CS103', num_present: 15, total_registered: 20, date_of_lecture: '2025-10-02', lecturer: 'Prof. Molefe', venue: 'Kamore 103', type: 'Lecture', notes: 'Web HTML & CSS' },
  ];

  const demoClasses = [
    { id: 1, class_name: 'CS101-A', faculty_name: 'Science', venue: 'Kamore 101', scheduled_time: '08:00 - 10:00', total_registered: 25, type: 'Lecture', students: ['Thato', 'Neo', 'Lesego', 'Palesa', 'Kea'] },
    { id: 2, class_name: 'CS102-B', faculty_name: 'Science', venue: 'Kamore 102', scheduled_time: '10:00 - 12:00', total_registered: 22, type: 'Lab', students: ['Mpho', 'Teboho', 'Boitumelo', 'Masechaba'] },
    { id: 3, class_name: 'CS103-C', faculty_name: 'Science', venue: 'Kamore 103', scheduled_time: '12:00 - 14:00', total_registered: 20, type: 'Lecture', students: ['Lerato', 'Tshepo', 'Kabelo', 'Mphoentle'] },
  ];

  const demoCourses = [
    { id: 1, name: 'Intro to Computer Science', code: 'CS101', stream: 'Science', level: '100', description: 'Basic programming and computing concepts' },
    { id: 2, name: 'Data Structures', code: 'CS102', stream: 'Science', level: '200', description: 'Intermediate data organization & algorithms' },
    { id: 3, name: 'Web Development', code: 'CS103', stream: 'Science', level: '100', description: 'HTML, CSS, and JavaScript fundamentals' },
  ];

  useEffect(() => {
    setReports(demoReports);
    setClasses(demoClasses);
    setCourses(demoCourses);
    updateSummary(demoReports, demoClasses, demoCourses);
    updateCharts(demoReports, demoCourses);
  }, []);

  const updateSummary = (reportsData, classesData, coursesData) => {
    setSummary({
      totalReports: reportsData.length,
      totalClasses: classesData.length,
      totalCourses: coursesData.length
    });
  };

  const updateCharts = (reportData, coursesData) => {
    const counts = {};
    const attendanceByDate = {};
    const attendanceByCourse = {};
    reportData.forEach(r => {
      counts[r.course_code] = (counts[r.course_code] || 0) + 1;
      const d = r.date_of_lecture || 'unknown';
      const pct = r.total_registered ? (r.num_present / r.total_registered * 100) : 0;
      attendanceByDate[d] = attendanceByDate[d] || [];
      attendanceByDate[d].push(pct);

      attendanceByCourse[r.course_code] = attendanceByCourse[r.course_code] || [];
      attendanceByCourse[r.course_code].push(pct);
    });

    setReportsPerCourse({ labels: Object.keys(counts), data: Object.values(counts) });

    const dates = Object.keys(attendanceByDate).sort();
    const avgByDate = dates.map(d => Math.round(attendanceByDate[d].reduce((a,b)=>a+b,0)/attendanceByDate[d].length*100)/100);
    setAttendanceSeries({ labels: dates, data: avgByDate });

    const courseLabels = Object.keys(attendanceByCourse);
    const avgCourse = courseLabels.map(c => Math.round(attendanceByCourse[c].reduce((a,b)=>a+b,0)/attendanceByCourse[c].length*100)/100);
    setAverageAttendancePerCourse({ labels: courseLabels, data: avgCourse });
  };

  // ---------- Helpers ----------
  const openStudentModal = (cls) => {
    setCurrentClassStudents(cls.students);
    setShowStudentsModal(true);
  };
  const openCourseModal = (course) => {
    setCurrentCourse(course);
    setShowCourseModal(true);
  };

  // ---------- Add Report ----------
  const [newReport, setNewReport] = useState({
    course_code: '', num_present: '', total_registered: '', date_of_lecture: '', lecturer: '', venue: '', type: 'Lecture', notes: ''
  });

  const handleAddReport = (e) => {
    e.preventDefault();
    const nextId = reports.length ? Math.max(...reports.map(r => r.id)) + 1 : 1;
    const report = { ...newReport, id: nextId };
    setReports([...reports, report]);
    updateSummary([...reports, report], classes, courses);
    updateCharts([...reports, report], courses);
    setNewReport({ course_code:'', num_present:'', total_registered:'', date_of_lecture:'', lecturer:'', venue:'', type:'Lecture', notes:'' });
  };

  const recentReports = [...reports].sort((a,b)=>new Date(b.date_of_lecture)-new Date(a.date_of_lecture)).slice(0,3);

  // ---------- Render ----------
  return (
    <div className="container-app p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>LUCT Faculty Dashboard</h3>
        <div>
          <span className="me-3 text-muted">Signed in as <strong>{user.name}</strong> ({user.role})</span>
          <button className="btn btn-outline-danger btn-sm" title="Logout" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row">
        {/* Sidebar */}
        <div className="p-3 rounded" style={{ minWidth: 220, marginRight: 15, background: '#0d6efd', color: 'white' }}>
          <h5 className="mb-3">📊 Menu</h5>
          <button className={`btn btn-sm w-100 mb-2 ${tab==='reports'?'btn-light text-dark':'btn-outline-light'}`} onClick={()=>setTab('reports')}>Reports</button>
          <button className={`btn btn-sm w-100 mb-2 ${tab==='classes'?'btn-light text-dark':'btn-outline-light'}`} onClick={()=>setTab('classes')}>Classes</button>
          <button className={`btn btn-sm w-100 mb-2 ${tab==='courses'?'btn-light text-dark':'btn-outline-light'}`} onClick={()=>setTab('courses')}>Courses</button>
          <button className="btn btn-warning btn-sm w-100 mt-3" onClick={()=>setShowQuickStats(true)}>⚡ Quick Stats</button>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1">
          {/* Reports Tab */}
          {tab==='reports' && (
            <>
              <h4 className="mb-3">Attendance Reports</h4>
              {/* Add Report Form */}
              <form className="card p-3 mb-3" onSubmit={handleAddReport}>
                <h5 className="mb-3">➕ Add New Report</h5>
                <div className="row g-2">
                  <div className="col-md-4"><label className="form-label">Course Code</label><input type="text" className="form-control" value={newReport.course_code} onChange={e=>setNewReport({...newReport, course_code:e.target.value})} required /></div>
                  <div className="col-md-4"><label className="form-label">Date</label><input type="date" className="form-control" value={newReport.date_of_lecture} onChange={e=>setNewReport({...newReport, date_of_lecture:e.target.value})} required /></div>
                  <div className="col-md-4"><label className="form-label">Lecturer</label><input type="text" className="form-control" value={newReport.lecturer} onChange={e=>setNewReport({...newReport, lecturer:e.target.value})} required /></div>
                  <div className="col-md-3"><label className="form-label">Venue</label><input type="text" className="form-control" value={newReport.venue} onChange={e=>setNewReport({...newReport, venue:e.target.value})} /></div>
                  <div className="col-md-3"><label className="form-label">Type</label><select className="form-select" value={newReport.type} onChange={e=>setNewReport({...newReport, type:e.target.value})}><option>Lecture</option><option>Lab</option><option>Tutorial</option></select></div>
                  <div className="col-md-3"><label className="form-label">Present</label><input type="number" className="form-control" value={newReport.num_present} onChange={e=>setNewReport({...newReport, num_present:e.target.value})} required /></div>
                  <div className="col-md-3"><label className="form-label">Total</label><input type="number" className="form-control" value={newReport.total_registered} onChange={e=>setNewReport({...newReport, total_registered:e.target.value})} required /></div>
                  <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" rows="2" value={newReport.notes} onChange={e=>setNewReport({...newReport, notes:e.target.value})}></textarea></div>
                </div>
                <button type="submit" className="btn btn-success mt-3"><i className="bi bi-save"></i> Save Report</button>
              </form>

              {/* Reports Table */}
              <table className="table table-sm table-bordered">
                <thead><tr><th>Course Code</th><th>Present</th><th>Total</th><th>Date</th><th>Lecturer</th><th>Venue</th><th>Type</th><th>Notes</th></tr></thead>
                <tbody>
                  {reports.map(r=>(<tr key={r.id}><td>{r.course_code}</td><td>{r.num_present}</td><td>{r.total_registered}</td><td>{r.date_of_lecture}</td><td>{r.lecturer}</td><td>{r.venue}</td><td>{r.type}</td><td>{r.notes}</td></tr>))}
                </tbody>
              </table>

              <h5 className="mt-4">Recent Reports</h5>
              <ul className="list-group mb-3">
                {recentReports.map(r=>(<li key={r.id} className="list-group-item">{r.date_of_lecture} - <strong>{r.course_code}</strong> ({r.num_present}/{r.total_registered} students)</li>))}
              </ul>

              <div className="row">
                <div className="col-md-6 mb-3"><Bar data={{ labels: reportsPerCourse.labels, datasets: [{ label: 'Reports per Course', data: reportsPerCourse.data, backgroundColor: '#0d6efd' }] }} /></div>
                <div className="col-md-6 mb-3"><Line data={{ labels: attendanceSeries.labels, datasets: [{ label: 'Average Attendance %', data: attendanceSeries.data, borderColor: '#198754', backgroundColor: '#198754', fill: false }] }} /></div>
              </div>
            </>
          )}

          {/* Classes Tab */}
          {tab==='classes' && (
            <>
              <h4 className="mb-3">Classes</h4>
              <table className="table table-bordered">
                <thead><tr><th>Name</th><th>Faculty</th><th>Venue</th><th>Schedule</th><th>Registered</th><th>Action</th></tr></thead>
                <tbody>
                  {classes.map(cls=>(<tr key={cls.id}><td>{cls.class_name}</td><td>{cls.faculty_name}</td><td>{cls.venue}</td><td>{cls.scheduled_time}</td><td>{cls.total_registered}</td><td><button className="btn btn-primary btn-sm" onClick={()=>openStudentModal(cls)}>View Students</button></td></tr>))}
                </tbody>
              </table>
              {showStudentsModal && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header"><h5 className="modal-title">Class Students</h5><button className="btn-close" onClick={()=>setShowStudentsModal(false)}></button></div>
                      <div className="modal-body"><ul>{currentClassStudents.map((s,i)=>(<li key={i}>{s}</li>))}</ul></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Courses Tab */}
          {tab==='courses' && (
            <>
              <h4 className="mb-3">Courses</h4>
              <table className="table table-bordered">
                <thead><tr><th>Name</th><th>Code</th><th>Stream</th><th>Level</th><th>Action</th></tr></thead>
                <tbody>
                  {courses.map(course=>(<tr key={course.id}><td>{course.name}</td><td>{course.code}</td><td>{course.stream}</td><td>{course.level}</td><td><button className="btn btn-info btn-sm" onClick={()=>openCourseModal(course)}>More About</button></td></tr>))}
                </tbody>
              </table>
              {showCourseModal && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header"><h5 className="modal-title">{currentCourse.name}</h5><button className="btn-close" onClick={()=>setShowCourseModal(false)}></button></div>
                      <div className="modal-body"><p><strong>Code:</strong> {currentCourse.code}</p><p><strong>Stream:</strong> {currentCourse.stream}</p><p><strong>Level:</strong> {currentCourse.level}</p><p>{currentCourse.description}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
