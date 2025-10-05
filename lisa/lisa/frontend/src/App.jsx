import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || { name: 'Demo Lecturer', role: 'lecturer' };
    } catch {
      return { name: 'Demo Lecturer', role: 'lecturer' };
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  function onLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser({ name: 'Demo Lecturer', role: 'lecturer' });
    setToken('demo-token');
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return <Dashboard user={user} token={token} onLogout={onLogout} />;
}
