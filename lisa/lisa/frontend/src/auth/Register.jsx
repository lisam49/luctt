import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Register({ onRegistered, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(API + '/auth/register', {
        name,
        email,
        password,
        role,
      });
      alert('Registered');
      onRegistered && onRegistered();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="card p-3">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <select
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="prl">PRL</option>
            <option value="pl">PL</option>
          </select>
        </div>
        <div>
          <button className="btn btn-primary me-2">Register</button>
          <button
            type="button"
            className="btn btn-link"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
