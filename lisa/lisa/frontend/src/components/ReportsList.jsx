import React from 'react';

export default function ReportsList({ reports }) {
  return (
    <div className='mt-3'>
      <h5>Reports</h5>
      {reports.length === 0 ? (
        <div className='text-muted'>No reports found</div>
      ) : (
        <table className='table table-sm'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Course</th>
              <th>Lecturer</th>
              <th>Present/Total</th>
              <th>Topic</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.date_of_lecture}</td>
                <td>{r.class_name}</td>
                <td>
                  {r.course_name} ({r.course_code})
                </td>
                <td>{r.lecturer_name}</td>
                <td>
                  {r.num_present}/{r.total_registered}
                </td>
                <td>{r.topic_taught}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
