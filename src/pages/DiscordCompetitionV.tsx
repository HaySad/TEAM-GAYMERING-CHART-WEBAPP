import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';

const styles = {
  pageWrapper: {
    position: 'relative' as const,
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0B0B1F 0%, #1F1135 50%, #0B0B1F 100%)',
    overflow: 'hidden',
  },
  navbar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8, 8, 24, 0.98)',
    backdropFilter: 'blur(10px)',
    padding: '0.6rem 0',
    zIndex: 1000,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
  },
  navbarContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
    ':hover': {
      color: '#4ECDC4',
    },
  },
  container: {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'transparent',
    position: 'relative' as const,
    zIndex: 1,
    minHeight: '100vh',
    color: '#ffffff',
    paddingTop: '6rem',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(78, 205, 196, 0.3)',
  },
  // Higurashi Tier styles (copy from MainPage)
  higurashiTier: {
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: 'rgba(40, 20, 0, 0.85)',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255, 140, 0, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 0 30px 0 rgba(255, 140, 0, 0.08)',
  },
  higurashiButton: {
    textAlign: 'center' as const,
    color: '#fff',
    width: '100%',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
  },
  higurashiPreview: {
    width: '120px',
    height: '120px',
    position: 'relative' as const,
    margin: '0 auto 1rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  higurashiButtonLocked: {
    textAlign: 'center' as const,
    color: '#fff',
    width: '100%',
    padding: '1rem',
    cursor: 'not-allowed',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    opacity: 0.5,
    filter: 'grayscale(0.3) blur(0.2px)',
  },
  lockedOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.7)',
    color: '#ff9800',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    padding: '0.4rem 1.2rem',
    borderRadius: '16px',
    zIndex: 10,
    boxShadow: '0 2px 8px 0 #ff9800',
  },
  // Torii Gate styles
  toriiTop: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    width: '100px',
    height: '18px',
    background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
    borderRadius: '8px 8px 6px 6px',
    boxShadow: '0 2px 8px 0 #ff9800',
    zIndex: 2,
  },
  toriiLegLeft: {
    position: 'absolute' as const,
    left: '22px',
    top: '28px',
    width: '14px',
    height: '70px',
    background: 'linear-gradient(180deg, #ff9800 60%, #ff5722 100%)',
    borderRadius: '8px',
    zIndex: 1,
    boxShadow: '0 0 8px 0 #ff9800',
  },
  toriiLegRight: {
    position: 'absolute' as const,
    right: '22px',
    top: '28px',
    width: '14px',
    height: '70px',
    background: 'linear-gradient(180deg, #ff9800 60%, #ff5722 100%)',
    borderRadius: '8px',
    zIndex: 1,
    boxShadow: '0 0 8px 0 #ff9800',
  },
  toriiBar: {
    position: 'absolute' as const,
    top: '45px',
    left: '32px',
    width: '56px',
    height: '10px',
    background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
    borderRadius: '4px',
    zIndex: 2,
    boxShadow: '0 1px 6px 0 #ff9800',
  },
  higurashiCore: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #ff9800 60%, #ff5722 100%)',
    boxShadow: '0 0 40px 10px #ff9800',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease',
  },
  higurashiTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #ff9800, #ff5722)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    transition: 'all 0.3s ease',
  },
  higurashiDesc: {
    color: '#ff9800',
    fontSize: '1.1rem',
    opacity: 0.85,
    transition: 'all 0.3s ease',
  },
  blinkingLightsWrapper: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: '-18px',
    height: '18px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  blinkingLight: {
    position: 'absolute' as const,
    bottom: 0,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #ff5722 60%, #ff9800 100%)',
    boxShadow: '0 0 16px 4px #ff5722',
    animation: 'blink 1.6s infinite',
    opacity: 0.85,
  },
};

const DiscordCompetitionV: React.FC = () => {
  const navigate = useNavigate();
  // ตั้งค่าตัวแปรนี้เพื่อควบคุมล็อค/ปลดล็อคปุ่ม Higurashi
  const isHigurashiLocked = false; // เปลี่ยนเป็น false เพื่อปลดล็อค

  return (
    <div style={styles.pageWrapper}>
      <StarBackground />
      <div style={styles.navbar}>
        <div style={styles.navbarContent}>
          <div style={styles.navLinks}>
            <a href="/discord-competition-4" style={styles.navLink}>Discord-Competition IV</a>
            <span style={{...styles.navLink, color: '#FF6B6B'}}>Discord-Competition V</span>
          </div>
        </div>
      </div>
      <div style={styles.container}>
        <h1 style={styles.header}>-段位認定- Discord-Competition V</h1>
        <div style={styles.higurashiTier}>
          {isHigurashiLocked ? (
            <div style={styles.higurashiButtonLocked}>
              <div style={styles.higurashiPreview}>
                {/* Torii Gate Shape */}
                <div style={styles.toriiTop}></div>
                <div style={styles.toriiLegLeft}></div>
                <div style={styles.toriiLegRight}></div>
                <div style={styles.toriiBar}></div>
              </div>
              <h2 style={styles.higurashiTitle}>Higurashi</h2>
              <p style={styles.higurashiDesc}>Special Challenge</p>
              {/* Locked overlay */}
              <div style={styles.lockedOverlay}>🔒 Locked</div>
              {/* Blinking lights */}
              <div style={styles.blinkingLightsWrapper}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.blinkingLight,
                      left: `${10 + i * 12}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              style={styles.higurashiButton}
              onClick={() => navigate('/higurashi-dan')}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/higurashi-dan'); }}
            >
              <div style={styles.higurashiPreview}>
                {/* Torii Gate Shape */}
                <div style={styles.toriiTop}></div>
                <div style={styles.toriiLegLeft}></div>
                <div style={styles.toriiLegRight}></div>
                <div style={styles.toriiBar}></div>
              </div>
              <h2 style={styles.higurashiTitle}>Higurashi</h2>
              <p style={styles.higurashiDesc}>Special Challenge</p>
              {/* Blinking lights */}
              <div style={styles.blinkingLightsWrapper}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.blinkingLight,
                      left: `${10 + i * 12}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscordCompetitionV; 