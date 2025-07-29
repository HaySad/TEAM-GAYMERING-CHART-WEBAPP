import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthButton: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  if (isLoggedIn && user) {
    return (
      <div style={styles.container}>
        <div 
          style={styles.userButton}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span style={styles.username}>👤 {user.username}</span>
          <span style={styles.arrow}>▼</span>
        </div>
        
        {showDropdown && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownItem} onClick={handleLogout}>
              🚪 ออกจากระบบ
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.loginButton} onClick={handleLogin}>
        🔑 เข้าสู่ระบบ
      </button>
      <button style={styles.signupButton} onClick={handleSignup}>
        📝 สมัครสมาชิก
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    zIndex: 1000,
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  username: {
    fontSize: '14px',
  },
  arrow: {
    fontSize: '10px',
    transition: 'transform 0.3s ease',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: '0',
    marginTop: '5px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '150px',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  loginButton: {
    padding: '8px 16px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  signupButton: {
    padding: '8px 16px',
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
};

// เพิ่ม hover effects
const buttonHoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
};

export default AuthButton;