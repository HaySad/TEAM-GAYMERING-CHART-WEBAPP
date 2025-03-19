import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, sessionExpiry: Date) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Set session expiry to 1 hour from now
      const sessionExpiry = new Date(Date.now() + 60 * 60 * 1000);
      onLogin(username.trim(), sessionExpiry);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>เข้าสู่ระบบ / Login</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ใส่ชื่อผู้ใช้ / Enter username"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            เข้าสู่ระบบ / Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loginBox: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#0056b3',
    },
  }
};

export default Login; 