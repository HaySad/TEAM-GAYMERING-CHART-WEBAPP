import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim() || !password.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signup(username.trim(), password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'สมัครสมาชิกไม่สำเร็จ');
    }
    
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    const result = await loginAsGuest();
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'เข้าสู่ระบบเป็น Guest ไม่สำเร็จ');
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.signupBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>📝 สมัครสมาชิก</h2>
          <p style={styles.subtitle}>สร้างบัญชีใหม่</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? '⏳ กำลังสมัครสมาชิก...' : '🚀 สมัครสมาชิก'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>หรือ</span>
        </div>

        <button 
          onClick={handleGuestLogin}
          style={{
            ...styles.guestButton,
            ...(loading ? styles.submitButtonDisabled : {})
          }}
          disabled={loading}
        >
          {loading ? '⏳ กำลังเข้าสู่ระบบ...' : '👤 เข้าสู่ระบบเป็น Guest'}
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            มีบัญชีอยู่แล้ว? 
            <Link to="/login" style={styles.link}>
              🔑 เข้าสู่ระบบ
            </Link>
          </p>
        </div>
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
    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)',
    padding: '20px',
  },
  signupBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    overflow: 'hidden',
  },
  header: {
    padding: '40px 30px 20px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)',
    color: 'white',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9,
  },
  form: {
    padding: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box' as const,
    ':focus': {
      outline: 'none',
      borderColor: '#ff9a56',
    },
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ff9a56',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fcc',
  },
  footer: {
    padding: '20px 30px',
    textAlign: 'center' as const,
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#ff9a56',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    padding: '0 30px',
  },
  dividerText: {
    flex: 1,
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '14px',
    position: 'relative' as const,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e1e5e9',
      zIndex: -1,
    },
  },
  guestButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '0 30px 20px',
  },
};

export default Signup;