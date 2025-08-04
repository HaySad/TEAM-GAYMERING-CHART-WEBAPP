import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, isLoggedIn, isGuest, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentRating, setCurrentRating] = useState(user?.rating || 0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setCurrentRating(user?.rating || 0);
  }, [user]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>👤 โปรไฟล์</h2>
          <p style={styles.subtitle}>
            {isGuest ? 'Guest User' : user?.username}
            {isGuest && <span style={styles.guestBadge}> (Guest)</span>}
          </p>
        </div>

        <div style={styles.content}>
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={styles.successMessage}>
              ✅ {success}
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📊 ข้อมูลพื้นฐาน</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <label style={styles.label}>ชื่อผู้ใช้:</label>
                <span style={styles.value}>{user?.username}</span>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.label}>อีเมล:</label>
                <span style={styles.value}>{user?.email || 'ไม่ระบุ'}</span>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.label}>สถานะ:</label>
                <span style={styles.value}>
                  {isGuest ? 'Guest' : 'Member'}
                  {user?.isAdmin && <span style={styles.adminBadge}> (Admin)</span>}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⭐ Rating</h3>
            <div style={styles.ratingContainer}>
              <div style={styles.ratingDisplay}>
                <span style={styles.ratingValue}>{currentRating}</span>
                <span style={styles.ratingLabel}>คะแนน</span>
              </div>
              <div style={styles.ratingInfo}>
                <p style={styles.ratingDescription}>
                  Rating จะถูกคำนวณอัตโนมัติจากคะแนนเกมที่เล่น
                </p>
                <p style={styles.ratingNote}>
                  ระบบจะใช้ Deep Learning ในการวิเคราะห์และปรับ Rating
                </p>
                <button
                  onClick={() => navigate('/score-submission')}
                  style={styles.submitScoreButton}
                >
                  🎵 ส่ง Score
                </button>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎭 Discord Roles</h3>
            <div style={styles.rolesContainer}>
              {user?.discordRoles && user.discordRoles.length > 0 ? (
                <div style={styles.rolesList}>
                  {user.discordRoles.map((role, index) => (
                    <span key={index} style={styles.roleTag}>
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={styles.noRoles}>ยังไม่มี Discord roles</p>
              )}
            </div>
          </div>

          {user?.isAdmin && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>⚙️ Admin Panel</h3>
              <button
                onClick={() => navigate('/admin')}
                style={styles.adminButton}
              >
                🔧 เข้าสู่ Admin Panel
              </button>
            </div>
          )}
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  profileBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    overflow: 'hidden',
  },
  header: {
    padding: '40px 30px 20px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    fontSize: '18px',
    opacity: 0.9,
  },
  guestBadge: {
    fontSize: '14px',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  content: {
    padding: '30px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    color: '#333',
  },
  infoGrid: {
    display: 'grid',
    gap: '15px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  label: {
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontWeight: '500',
    color: '#333',
  },
  adminBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    marginLeft: '8px',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  ratingDisplay: {
    textAlign: 'center' as const,
  },
  ratingValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ff6b35',
    display: 'block',
  },
  ratingLabel: {
    fontSize: '14px',
    color: '#666',
  },
  ratingInfo: {
    marginTop: '15px',
    textAlign: 'center' as const,
  },
  ratingDescription: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  ratingNote: {
    margin: '0 0 15px 0',
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
  },
  submitScoreButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  rolesContainer: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  rolesList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  roleTag: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  noRoles: {
    color: '#666',
    fontStyle: 'italic',
    margin: 0,
  },
  adminButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
  successMessage: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #cfc',
  },
};

export default Profile; 