import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));

  useEffect(()=> {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token, user]);

  if (!token) return <Login setToken={setToken} setUser={setUser} />;
  return <Dashboard token={token} user={user} setToken={setToken} setUser={setUser} />;
}

export default App;
