import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function ReportForm({ onSaved, token }) {
  const [form, setForm] = useState({
    faculty_name: 'Faculty of Information Communication Technology',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    lecturer_name: '',
    num_present: 0,
    total_registered: 0,
    venue: '',
    scheduled_time: '',
    topic_taught: '',
    learning_outcomes: '',
    recommendations: ''
  });

  function upd(k, v) {
    setForm({ ...form, [k]: v });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(API + '/reports', form, {
        headers: { Authorization: 'Bearer ' + token }
      });
      alert('Report saved');
      onSaved && onSaved();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <form onSubmit={submit} className='card p-3'>
      <h5>Insert Lecture Report</h5>
      <div className='row'>
        <div className='col-md-4 mb-2'>
          <input
            className='form-control'
            placeholder='Class Name'
            value={form.class_name}
            onChange={e => upd('class_name', e.target.value)}
            required
          />
        </div>
        <div className='col-md-4 mb-2'>
          <input
            type='date'
            className='form-control'
            value={form.date_of_lecture}
            onChange={e => upd('date_of_lecture', e.target.value)}
            required
          />
        </div>
        <div className='col-md-4 mb-2'>
          <input
            className='form-control'
            placeholder='Week of Reporting'
            value={form.week_of_reporting}
            onChange={e => upd('week_of_reporting', e.target.value)}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-md-6 mb-2'>
          <input
            className='form-control'
            placeholder='Course Name'
            value={form.course_name}
            onChange={e => upd('course_name', e.target.value)}
            required
          />
        </div>
        <div className='col-md-3 mb-2'>
          <input
            className='form-control'
            placeholder='Course Code'
            value={form.course_code}
            onChange={e => upd('course_code', e.target.value)}
            required
          />
        </div>
        <div className='col-md-3 mb-2'>
          <input
            className='form-control'
            placeholder='Lecturer Name'
            value={form.lecturer_name}
            onChange={e => upd('lecturer_name', e.target.value)}
            required
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-md-3 mb-2'>
          <input
            type='number'
            className='form-control'
            placeholder='Present'
            value={form.num_present}
            onChange={e => upd('num_present', e.target.value)}
          />
        </div>
        <div className='col-md-3 mb-2'>
          <input
            type='number'
            className='form-control'
            placeholder='Total Registered'
            value={form.total_registered}
            onChange={e => upd('total_registered', e.target.value)}
          />
        </div>
        <div className='col-md-3 mb-2'>
          <input
            className='form-control'
            placeholder='Venue'
            value={form.venue}
            onChange={e => upd('venue', e.target.value)}
          />
        </div>
        <div className='col-md-3 mb-2'>
          <input
            className='form-control'
            placeholder='Scheduled Time'
            value={form.scheduled_time}
            onChange={e => upd('scheduled_time', e.target.value)}
          />
        </div>
      </div>

      <div className='mb-2'>
        <textarea
          className='form-control'
          placeholder='Topic Taught'
          value={form.topic_taught}
          onChange={e => upd('topic_taught', e.target.value)}
        />
      </div>
      <div className='mb-2'>
        <textarea
          className='form-control'
          placeholder='Learning Outcomes'
          value={form.learning_outcomes}
          onChange={e => upd('learning_outcomes', e.target.value)}
        />
      </div>
      <div className='mb-2'>
        <textarea
          className='form-control'
          placeholder='Recommendations'
          value={form.recommendations}
          onChange={e => upd('recommendations', e.target.value)}
        />
      </div>

      <div>
        <button className='btn btn-success'>Save Report</button>
      </div>
    </form>
  );
}
