import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(API + '/auth/login', { email, password });
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      alert(
        'Login failed: ' + (err.response?.data?.message || err.message)
      );
    }
  }

  return (
    <div className="card p-3">
      <h3>Login</h3>
      <form onSubmit={submit}>
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
        <div>
          <button className="btn btn-primary me-2">Login</button>
          <button
            type="button"
            className="btn btn-link"
            onClick={onShowRegister}
          >
            Register
          </button>
        </div>
      </form>
      <hr />
      <div className="text-muted">
        Demo: lisa49@gmail.com / password (lecturer) — lerato55@gmail.com / password (student)
      </div>
    </div>
  );
}
