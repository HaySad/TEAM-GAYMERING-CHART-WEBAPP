import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainPage from './MainPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setUsername] = useState('');
  const [, setSessionExpiry] = useState<Date | null>(null);
  const [, setUsername] = useState('');
  const [, setSessionExpiry] = useState<Date | null>(null);
  const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUsername('');
      setSessionExpiry(null);
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/session');
      const data = await response.json();
      
      if (data.isValid) {
        setIsLoggedIn(true);
        setUsername(data.user.username);
        setSessionExpiry(new Date(data.sessionExpiry));
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Session check error:', error);
      handleLogout();
    }
  }, [handleLogout]);

  // Check session status on component mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Setup session check interval when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(checkSession, 60000); // Check every minute
      setSessionCheckInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      setSessionCheckInterval(null);
    }
    return undefined;
  }, [isLoggedIn, checkSession, sessionCheckInterval]);

  const handleLogin = (newUsername: string, expiry: Date) => {
    setIsLoggedIn(true);
    setUsername(newUsername);
    setSessionExpiry(expiry);
  };

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
            isLoggedIn ? (
              <MainPage username={username} sessionExpiry={sessionExpiry} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/" element={
            <Navigate to={isLoggedIn ? "/discord-competition-4" : "/login"} replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
