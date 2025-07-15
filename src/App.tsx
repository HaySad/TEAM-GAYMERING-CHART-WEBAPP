import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainPage from './MainPage';
import MaiChart from './MaiChart';
import SongDetail from './pages/SongDetail';
import EventHorizon from './pages/EventHorizon';
import WorldMap from './components/WorldMap';
import HigurashiDan from './pages/HigurashiDan';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // ตรวจสอบ username ใน localStorage ถ้ามีแสดงว่าเคย login
    return !!localStorage.getItem('username');
  });
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  // Check session status on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();
        
        if (data.isValid) {
          setIsLoggedIn(true);
          const savedUsername = data.user.username;
          setUsername(savedUsername);
          localStorage.setItem('username', savedUsername);
          setSessionExpiry(new Date(data.sessionExpiry));
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };
    checkSession();
  }, []);

  const handleLogin = (username: string, expiry: Date) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
    setSessionExpiry(expiry);
  };

  // const handleLogout = async () => {
  //   try {
  //     await fetch('/api/logout', { method: 'POST' });
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   } finally {
  //     setIsLoggedIn(false);
  //     setUsername('');
  //     localStorage.removeItem('username');
  //     setSessionExpiry(null);
  //   }
  // };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/discord-competition-4" replace />
            )
          } />
          <Route path="/discord-competition-4" element={
            <MainPage username={username} sessionExpiry={sessionExpiry} />
          } />
          <Route path="/mai-chart" element={
            <MaiChart username={username} sessionExpiry={sessionExpiry} />
          } />
          <Route path="/song/:id" element={<SongDetail />} />
          <Route path="/event-horizon" element={<EventHorizon />} />
          <Route path="/world-map" element={<WorldMap />} />
          <Route path="/higurashi-dan" element={<HigurashiDan />} />
          <Route path="/" element={<Navigate to="/mai-chart" replace />} />
          <Route path="*" element={<Navigate to="/mai-chart" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
