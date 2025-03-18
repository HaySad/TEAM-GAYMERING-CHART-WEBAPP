import React, { useState, useEffect } from 'react';
import Login from './Login';
import MainPage from './MainPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Check session status on component mount
  useEffect(() => {
    checkSession();
  }, []);

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
  }, [isLoggedIn]);

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
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <div style={styles.navbar}>
            <div style={styles.userInfo}>
              <span>Welcome, {username}!</span>
              {sessionExpiry && (
                <span style={styles.sessionTimer}>
                  Session expires: {sessionExpiry.toLocaleTimeString()}
                </span>
              )}
            </div>
            <button 
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              ออกจากระบบ / Logout
            </button>
          </div>
          <MainPage />
        </div>
      )}
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
  },
  userInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  sessionTimer: {
    fontSize: '0.9rem',
    color: '#666',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default App;
