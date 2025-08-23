import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { tiersData } from './data/tiers';
import EventHorizonModal from './components/EventHorizonModal';
import StarBackground from './components/StarBackground';
import './styles/MaiChart.css';

interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  downloadUrl: string;
  chartDesigner: string;
  artist: string;
}

interface Tier {
  level: number;
  life: number;
  minusX: number;
  minusY: number;
  minusZ: number;
  addLife: number;
  songs: Song[];
  allSongsDownloadUrl?: string;
}

const MainPage: React.FC = () => {
  const { user } = useAuth();
  const [tiers] = useState<Tier[]>(tiersData);
  const [isEventHorizonOpen, setIsEventHorizonOpen] = useState(false);
  const [showEventHorizon] = useState(true);
  const [completedEventSongs, setCompletedEventSongs] = useState<string[]>([]);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const navigate = useNavigate();

  // ตั้งค่าตัวแปรนี้เพื่อควบคุมล็อค/ปลดล็อคปุ่ม Higurashi
  const isHigurashiLocked = false; // เปลี่ยนเป็น false เพื่อปลดล็อค

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png';
  };

  const handleDownload = async (downloadUrl: string, songName: string) => {
    try {
      // Redirect to Google Drive download URL directly
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('ไม่สามารถดาวน์โหลดไฟล์ได้ / Download failed');
    }
  };



  const handleEventSongComplete = (songId: string) => {
    setCompletedEventSongs([...completedEventSongs, songId]);
    
    // Unlock next song based on completion
    if (songId === '11-1') {
      localStorage.setItem('event_11-2_unlocked', 'true');
    } else if (songId === '11-2') {
      localStorage.setItem('event_11-3_unlocked', 'true');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <StarBackground />
      <div style={styles.navbar}>
        <div style={styles.navbarContent}>
          <div style={styles.navLinks}>
            <button 
              // onClick={() => setIsEventHorizonOpen(true)} ปิดเพื่อ test ระบบ
              style={{
                ...styles.navLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4ECDC4'
              }}
            >
              Discord-Competition
            </button>
            <a href="/mai-chart" style={styles.navLink}>MaiChart</a>
          </div>
          <div style={styles.userInfo}>
            {user ? (
              <>
                <span style={styles.welcomeText}>Welcome, {user.username}!</span>
              </>
            ) : (
              <a href="/login" style={styles.loginButton}>
                เข้าสู่ระบบ / Login
              </a>
            )}
          </div>
        </div>
      </div>
      <div style={styles.container}>
        <h1 style={styles.header}>-段位認定- Discord-Competition IV</h1>
        
        {/* Event Horizon Tier */}
        {showEventHorizon && (
          <div style={styles.eventHorizonTier}>
            <div 
              style={styles.eventHorizonButton}
              onClick={() => setIsLockedModalOpen(true)}
            >
              <div style={styles.blackHolePreview}>
                <div style={styles.blackHoleRing}></div>
                <div style={styles.blackHoleCore}></div>
              </div>
              <h2 style={styles.eventHorizonTitle}>Tier Event Horizon</h2>
              <p style={styles.eventHorizonDesc}>End of Event</p>
            </div>
          </div>
        )}

        

        {/* Locked Event Horizon Modal */}
        <div className={`locked-event-horizon-modal ${isLockedModalOpen ? 'open' : ''}`}>
          <div className="locked-modal-content">
            <div className="locked-black-hole">
              <div className="locked-black-hole-ring"></div>
              <div className="locked-black-hole-ring-2"></div>
              <div className="locked-black-hole-ring-3"></div>
              <div className="locked-black-hole-ring-4"></div>
              <div className="locked-black-hole-ring-5"></div>
              <div className="locked-black-hole-core"></div>
              <div className="locked-black-hole-particles">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="locked-black-hole-particle"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 30}deg)`,
                      animationDelay: `${i * 0.25}s`
                    }}
                  />
                ))}
              </div>
            </div>
            <h2 className="locked-modal-title">Event Horizon</h2>
            <p className="locked-modal-desc">
              The Supernova has been completed.<br/>
              Now, we are looking at the Event Horizon for astrodx.<br/>
              A new challenge awaits...<br/><br/>
            </p>
            <button 
              className="locked-modal-close" 
              onClick={() => {
                setIsLockedModalOpen(false);
                window.location.href = '/event-horizon';
              }}
            >
              Deep in to event horizon
            </button>
          </div>
        </div>

        {tiers.map((tier) => (
          <div key={tier.level} style={styles.tierContainer}>
            <div style={styles.tierHeader}>
              <h2 style={styles.tierTitle}>Tier {tier.level}</h2>
              <div style={styles.tierSettings}>
                <span style={styles.statItem}>Max Life : {tier.life} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Great - {tier.minusX} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Good - {tier.minusY} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}>Miss - {tier.minusZ} <span style={styles.heart}>❤️</span></span>
                <span style={styles.statItem}> + {tier.addLife} <span style={styles.heart}>❤️</span></span>
              </div>
              {tier.allSongsDownloadUrl && (
                <button
                  style={styles.downloadAllButton}
                  onClick={() => tier.allSongsDownloadUrl && handleDownload(tier.allSongsDownloadUrl, `Tier${tier.level}_All_Songs`)}
                >
                  Download All Songs in Tier {tier.level}
                </button>
              )}
            </div>
            
            
            <div style={styles.songsGrid}>
              {tier.songs.map((song) => (
                <div key={song.id} style={styles.songCard} className="main-song-card">
                  <div style={styles.imageContainer}>
                    <img 
                      src={song.image} 
                      alt={song.name}
                      style={styles.songImage}
                      onError={handleImageError}
                    />
                  </div>
                  <div style={styles.songInfo}>
                    <div style={styles.songName}>{song.name}</div>
                    <div style={styles.songLevel}>Level: {song.level.toFixed(1)}</div>
                    <div style={styles.songDetails}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>🎵 Artist </span>
                        <span style={styles.detailValue}>{song.artist}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>🎮 Chart by </span>
                        <span style={styles.detailValue}>{song.chartDesigner}</span>
                      </div>
                    </div>
                    <button 
                      style={styles.downloadButton}
                      className="main-download-button"
                      onClick={() => handleDownload(song.downloadUrl, song.name)}
                    >
                      ดาวน์โหลด / Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        ))}

        {showEventHorizon && (
          <EventHorizonModal 
            isOpen={isEventHorizonOpen}
            onClose={() => setIsEventHorizonOpen(false)}
            onSongComplete={handleEventSongComplete}
          />
        )}
      </div>
      <h1 style={styles.header}>-段位認定- Discord-Competition V</h1>

      <div style={styles.container}>
      {/* Higurashi Tier (Orange, with blinking lights) */}
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
  welcomeText: {
    color: '#4ECDC4',
    fontSize: '1rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    color: '#FF6B6B',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 10px rgba(255, 107, 107, 0.1)',
    ':hover': {
      backgroundColor: 'rgba(255, 107, 107, 0.25)',
      boxShadow: '0 0 15px rgba(255, 107, 107, 0.2)',
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  sessionTimer: {
    color: '#888',
    fontSize: '0.9rem',
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
    paddingTop: '4rem',
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
  tierContainer: {
    marginBottom: '1.5rem',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '1.2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  tierHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  tierTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#4ECDC4',
    margin: 0,
  },
  tierSettings: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#252525',
    borderRadius: '8px',
  },
  statItem: {
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    borderRadius: '20px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  heart: {
    fontSize: '1.1rem',
  },
  songsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    padding: '1rem',
  },
  songCard: {
    backgroundColor: 'rgba(37, 37, 37, 0.9)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    },
  },
  imageContainer: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  songImage: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    ':hover': {
      opacity: 1,
    },
  },
  downloadIcon: {
    fontSize: '2rem',
  },
  songInfo: {
    padding: '1.2rem',
    textAlign: 'center' as const,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  songName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#4ECDC4',
  },
  songLevel: {
    fontSize: '0.9rem',
    color: '#888',
  },
  downloadButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
  downloadAllButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
  songDetails: {
    fontSize: '0.9rem',
    color: '#aaa',
    marginTop: '0.8rem',
    marginBottom: '0.8rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  detailItem: {
    margin: '0.15rem 0',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.2rem',
  },
  detailLabel: {
    color: '#4ECDC4',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  detailValue: {
    color: '#fff',
    fontSize: '0.9rem',
  },
  loginButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
  eventHorizonTier: {
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(78, 205, 196, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      transform: 'scale(1.02)',
      border: '1px solid rgba(78, 205, 196, 0.8)',
      boxShadow: '0 0 30px rgba(78, 205, 196, 0.2)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  eventHorizonButton: {
    textAlign: 'center' as const,
    color: '#ffffff',
    width: '100%',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  blackHolePreview: {
    width: '150px',
    height: '150px',
    position: 'relative' as const,
    margin: '0 auto 1rem',
    transition: 'all 0.3s ease',
  },
  blackHoleRing: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '2px solid rgba(78, 205, 196, 0.5)',
    transform: 'translate(-50%, -50%)',
    animation: 'rotate 10s linear infinite',
    transition: 'all 0.3s ease',
  },
  blackHoleCore: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#000',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 30px rgba(78, 205, 196, 0.5)',
    transition: 'all 0.3s ease',
  },
  eventHorizonTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #4ECDC4, #000)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    transition: 'all 0.3s ease',
  },
  eventHorizonDesc: {
    color: '#4ECDC4',
    fontSize: '1.1rem',
    opacity: 0.8,
    transition: 'all 0.3s ease',
  },
  // Higurashi Tier styles
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

const keyframes = `
  @keyframes rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
  @keyframes blink {
    0%, 100% { opacity: 0.85; filter: brightness(1.2); }
    50% { opacity: 0.2; filter: brightness(0.7); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default MainPage; 