import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainPage from './MainPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  // const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Check session status on component mount
  useEffect(() => {
    const checkSession = async () => {
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
    };
    checkSession();
  }, []);
  
  // const checkSession = async () => {
  //   try {
  //     const response = await fetch('/api/session');
  //     const data = await response.json();
      
  //     if (data.isValid) {
  //       setIsLoggedIn(true);
  //       setUsername(data.user.username);
  //       setSessionExpiry(new Date(data.sessionExpiry));
  //     } else {
  //       handleLogout();
  //     }
  //   } catch (error) {
  //     console.error('Session check error:', error);
  //     handleLogout();
  //   }
  // };

  // // Setup session check interval when logged in
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     const interval = setInterval(checkSession, 60000); // Check every minute
  //     setSessionCheckInterval(interval);
  //     return () => {
  //       if (interval) clearInterval(interval);
  //     };
  //   } else if (sessionCheckInterval) {
  //     clearInterval(sessionCheckInterval);
  //     setSessionCheckInterval(null);
  //   }
  // }, [isLoggedIn]);

 

  const handleLogin = (username: string, expiry: Date) => {
    setIsLoggedIn(true);
    setUsername(username);
    setSessionExpiry(expiry);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUsername('');
      setSessionExpiry(null);
    }
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
            <Navigate to="/discord-competition-4" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
