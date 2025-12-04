import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) {
      setErr('Please enter email and password');
      return;
    }
    try {
      const res = await axios.post(API_BASE + '/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Shift Board — Login</h2>
      <p className="small">Use seeded admin: <strong>hire-me@anshumat.org</strong> / <strong>HireMe@2025!</strong></p>
      <div className="info-box">Tip: If you run with docker-compose the backend will be at <code>http://localhost:5000</code>.</div>
      <form onSubmit={submit}>
        <div className="form-row">
          <div style={{flex:1}}>
            <label>Email</label><br/>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div style={{flex:1}}>
            <label>Password</label><br/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          </div>
        </div>
        <div style={{marginTop:8}}><button type="submit">Login</button></div>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}
