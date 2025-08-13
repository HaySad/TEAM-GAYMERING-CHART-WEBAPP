import React, { useState, useEffect } from 'react';

interface DatabaseStatusNotificationProps {
  isConnected: boolean;
  isFallbackMode: boolean;
}

const DatabaseStatusNotification: React.FC<DatabaseStatusNotificationProps> = ({
  isConnected,
  isFallbackMode
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // แสดง notification เมื่อ fallback mode
    if (isFallbackMode) {
      setIsVisible(true);
      
      // ซ่อน notification หลังจาก 10 วินาที
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isFallbackMode]);

  if (!isVisible || isConnected) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.notification}>
        <div style={styles.icon}>⚠️</div>
        <div style={styles.content}>
          <div style={styles.title}>ไม่สามารถเชื่อมต่อฐานข้อมูล</div>
          <div style={styles.message}>
            ระบบกำลังใช้โหมดสำรอง ข้อมูลอาจไม่คงทน
          </div>
        </div>
        <button 
          style={styles.closeButton}
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 9999,
    maxWidth: '350px',
  },
  notification: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    animation: 'slideIn 0.3s ease-out',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '20px',
    flexShrink: 0,
    marginTop: '2px',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#856404',
    fontSize: '14px',
    marginBottom: '4px',
  },
  message: {
    color: '#856404',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#856404',
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  },
};

export default DatabaseStatusNotification;
