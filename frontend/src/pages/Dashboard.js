import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function Dashboard({ token, user, setToken }) {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [filters, setFilters] = useState({ employeeCode: '', date: '' });
  const [form, setForm] = useState({ employeeCode: '', date: '', startTime: '', endTime: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const api = axios.create({ baseURL: API_BASE, headers: { Authorization: 'Bearer ' + token } });

  useEffect(()=> {
    api.get('/employees').then(r => setEmployees(r.data)).catch(e => console.error(e));
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setErr(''); setMsg('');
      const q = new URLSearchParams();
      if (filters.employeeCode) q.set('employee', filters.employeeCode);
      if (filters.date) q.set('date', filters.date);
      const res = await api.get('/shifts?' + q.toString());
      setShifts(res.data);
    } catch (err) {
      console.error(err);
      setErr('Error fetching shifts');
    }
  };

  const validateForm = () => {
    setErr(''); setMsg('');
    if (!form.employeeCode) return 'Select an employee';
    if (!form.date) return 'Select a date';
    if (!form.startTime || !form.endTime) return 'Select start and end time';
    if (form.endTime <= form.startTime) return 'End time must be after start time';
    const [sh, sm] = form.startTime.split(':').map(Number);
    const [eh, em] = form.endTime.split(':').map(Number);
    const startMin = sh*60 + sm, endMin = eh*60 + em;
    if (endMin - startMin < 4*60) return 'Shift must be at least 4 hours';
    return null;
  };

  const submitShift = async (e) => {
    e.preventDefault();
    const v = validateForm();
    if (v) { setErr(v); return; }
    try {
      await api.post('/shifts', form);
      setMsg('Shift created');
      setForm({ employeeCode:'', date:'', startTime:'', endTime:'' });
      fetchShifts();
    } catch (err) {
      setErr(err.response?.data?.message || 'Error creating shift');
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete shift?')) return;
    try {
      await api.delete('/shifts/' + id);
      setMsg('Deleted');
      fetchShifts();
    } catch (err) {
      setErr('Delete failed');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Shift Board — Dashboard</h2>
        <div>
          <span>{user?.name} ({user?.role})</span>
          <button className="button-secondary" onClick={()=> setToken(null)} style={{marginLeft:10}}>Logout</button>
        </div>
      </div>

      <section style={{marginTop:12}}>
        <h3>Filters</h3>
        <div className="form-row">
          <select value={filters.employeeCode} onChange={e=>setFilters({...filters, employeeCode: e.target.value})}>
            <option value="">-- All employees --</option>
            {employees.map(emp => <option key={emp.employeeCode} value={emp.employeeCode}>{emp.name} ({emp.employeeCode})</option>)}
          </select>
          <input type="date" value={filters.date} onChange={e=>setFilters({...filters, date: e.target.value})} />
          <button onClick={fetchShifts}>Search</button>
        </div>
      </section>

      {user?.role === 'admin' && (
        <section style={{marginTop:12}}>
          <h3>Create Shift (Admin)</h3>
          <form onSubmit={submitShift}>
            <div className="form-row">
              <select value={form.employeeCode} onChange={e=>setForm({...form, employeeCode: e.target.value})}>
                <option value="">-- Select Employee --</option>
                {employees.map(emp => <option key={emp.employeeCode} value={emp.employeeCode}>{emp.name} ({emp.employeeCode})</option>)}
              </select>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
              <input type="time" value={form.startTime} onChange={e=>setForm({...form, startTime: e.target.value})} />
              <input type="time" value={form.endTime} onChange={e=>setForm({...form, endTime: e.target.value})} />
              <button type="submit">Create</button>
            </div>
          </form>
          <p className="small">Rules: min 4 hours per shift; no overlaps for same employee on same date.</p>
        </section>
      )}

      <section style={{marginTop:12}}>
        <h3>Shifts</h3>
        {msg && <p className="success">{msg}</p>}
        {err && <p className="error">{err}</p>}
        <table className="table">
          <thead><tr><th>Employee</th><th>Code</th><th>Date</th><th>Start</th><th>End</th><th>Actions</th></tr></thead>
          <tbody>
            {shifts.map(s => (
              <tr key={s._id}>
                <td>{s.employee?.name}</td>
                <td>{s.employee?.employeeCode}</td>
                <td>{s.date}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>{user.role === 'admin' && <button onClick={()=>del(s._id)}>Delete</button>}</td>
              </tr>
            ))}
            {shifts.length === 0 && <tr><td colSpan="6" className="small">No shifts found</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
