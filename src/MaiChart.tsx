import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { maiChartData, Song } from './data/maiChartData';
import './styles/MaiChart.css';

interface RequirementsModalProps {
  requirements: {
    description: string;
    conditions: string[];
  };
  onClose: () => void;
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({ requirements, onClose }) => (
  <div className="requirements-modal-overlay" onClick={onClose}>
    <div className="requirements-modal" onClick={e => e.stopPropagation()}>
      <h3>{requirements.description}</h3>
      <ul>
        {requirements.conditions.map((condition, index) => (
          <li key={index}>{condition}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const MaiChart: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>(maiChartData);
  const [sortBy, setSortBy] = useState<'chartDesigner' | 'name' | 'level'>('chartDesigner');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedDesigner, setSelectedDesigner] = useState<string>('all');
  const [selectedRequirements, setSelectedRequirements] = useState<{
    description: string;
    conditions: string[];
  } | null>(null);

  // Get unique chart designers using Array.from
  const chartDesigners = ['all', ...Array.from(new Set(songs.map((song: Song) => song.chartDesigner)))];

  const handleSort = (field: 'chartDesigner' | 'name' | 'level') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }

    const sortedSongs = [...songs].sort((a: Song, b: Song) => {
      if (field === 'level') {
        // Get the highest level value from difficulties
        const aMaxLevel = Math.max(...a.difficulties.map(d => d.levelValue));
        const bMaxLevel = Math.max(...b.difficulties.map(d => d.levelValue));
        return sortOrder === 'asc' ? aMaxLevel - bMaxLevel : bMaxLevel - aMaxLevel;
      } else {
        return sortOrder === 'asc' 
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });

    setSongs(sortedSongs);
  };

  const handleDesignerFilter = (designer: string) => {
    setSelectedDesigner(designer);
    if (designer === 'all') {
      setSongs(maiChartData);
    } else {
      const filteredSongs = maiChartData.filter((song: Song) => song.chartDesigner === designer);
      setSongs(filteredSongs);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png';
  };

  const handleDownload = async (downloadUrl: string, songName: string) => {
    try {
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('ไม่สามารถดาวน์โหลดไฟล์ได้ / Download failed');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      localStorage.removeItem('username');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('username');
      window.location.href = '/';
    }
  };

  const handleCardClick = (songId: string) => {
    sessionStorage.setItem('maiChartScrollPosition', window.scrollY.toString());
    navigate(`/song/${songId}`);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbar}>
        <div style={styles.navbarContent}>
          <div style={styles.navLinks}>
            <a href="/discord-competition-4" style={styles.navLink}>Discord Competition</a>
            <a href="/mai-chart" style={{...styles.navLink, color: '#4ECDC4'}}>Mai Chart</a>
          </div>
          <div style={styles.userInfo}>
            {username !== 'Guest' ? (
              <>
                <span style={styles.welcomeText}>Welcome, {username}!</span>
                {sessionExpiry && (
                  <span style={styles.sessionTimer}>
                    Session expires: {new Date(sessionExpiry).toLocaleTimeString()}
                  </span>
                )}
              </>
            ) : (
              <a href="/login" style={styles.loginButton}>
                เข้าสู่ระบบ / Login
              </a>
            )}
          </div>
          {username !== 'Guest' && (
            <button style={styles.logoutButton} onClick={handleLogout}>
              ออกจากระบบ / Logout
            </button>
          )}
        </div>
      </div>

      <div style={styles.container}>
        <h1 style={styles.header}>Mai Chart Collection</h1>
        
        <div style={styles.sortControls}>
          <div style={styles.filterGroup}>
            <select 
              style={styles.designerSelect}
              value={selectedDesigner}
              onChange={(e) => handleDesignerFilter(e.target.value)}
            >
              {chartDesigners.map(designer => (
                <option key={designer} value={designer}>
                  {designer === 'all' ? 'All Chart Designers' : designer}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.sortButtons}>
            <button 
              style={{
                ...styles.sortButton,
                ...(sortBy === 'name' && { backgroundColor: 'rgba(78, 205, 196, 0.25)' })
              }}
              onClick={() => handleSort('name')}
            >
              Song Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              style={{
                ...styles.sortButton,
                ...(sortBy === 'level' && { backgroundColor: 'rgba(78, 205, 196, 0.25)' })
              }}
              onClick={() => handleSort('level')}
            >
              Level {sortBy === 'level' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <div style={styles.songsGrid}>
          {songs.map((song) => {
            const isBossSong = song.id === "3-3" || song.id === "3-4";
            const isLocked = song.requirements?.isLocked;
            return (
              <div 
                key={song.id} 
                style={{
                  ...(isBossSong ? styles.bossSongCard : styles.songCard),
                  cursor: 'pointer',
                }}
                className={`${isBossSong ? 'boss-song-card' : 'song-card'} ${isLocked ? 'locked-card' : ''}`}
                onClick={() => handleCardClick(song.id)}
              >
                <div style={styles.imageContainer}>
                  <img 
                    src={song.image} 
                    alt={song.name}
                    style={styles.songImage}
                    className={isLocked ? 'locked-image' : ''}
                    onError={handleImageError}
                  />
                  {isLocked && (
                    <div 
                      style={styles.lockIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        song.requirements && setSelectedRequirements({
                          description: song.requirements.description,
                          conditions: song.requirements.conditions
                        });
                      }}
                    >
                      🔒
                    </div>
                  )}
                  <div style={styles.levelBadgesContainer}>
                    {song.difficulties.map((diff, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.levelBadge,
                          ...(diff.levelType === 'Re:MASTER' && styles.levelBadgeReMaster),
                          ...(diff.levelType === 'MASTER' && styles.levelBadgeMaster),
                          ...(diff.levelType === 'EXPERT' && styles.levelBadgeExpert),
                          ...(diff.levelType === 'ADVANCED' && styles.levelBadgeAdvanced),
                          ...(diff.levelType === 'BASIC' && styles.levelBadgeBasic),
                        }}
                      >
                        {diff.levelType} {diff.level}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  ...styles.songInfo,
                  backgroundColor: isBossSong ? 'rgba(50, 20, 20, 0.8)' : 'rgba(30, 30, 30, 0.8)'
                }}>
                  <div style={{
                    ...styles.songName,
                    color: isBossSong ? '#ff3b3b' : '#4ECDC4'
                  }}>
                    {song.name}
                    {isBossSong && <span style={styles.bossTag}>BOSS</span>}
                  </div>
                  <div style={styles.songLevel}>
                    Level: {Math.max(...song.difficulties.map(d => d.levelValue))}
                  </div>
                  <div style={styles.songDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>🎵 Artist</span>
                      <span style={styles.detailValue}>{song.artist}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>🎮 Chart by</span>
                      <span style={styles.detailValue}>{song.chartDesigner}</span>
                    </div>
                  </div>
                  <button 
                    style={{
                      ...styles.downloadButton,
                      backgroundColor: isBossSong ? 'rgba(255, 59, 59, 0.15)' : 'rgba(78, 205, 196, 0.15)',
                      color: isBossSong ? '#ff3b3b' : '#4ECDC4',
                    }}
                    className={`${isBossSong ? 'boss-download-button' : 'normal-download-button'} ${isLocked ? 'download-button-locked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      !isLocked && handleDownload(song.downloadUrl, song.name);
                    }}
                    disabled={isLocked}
                  >
                    {isLocked ? 'Locked' : 'ดาวน์โหลด / Download ⬇️'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedRequirements && (
          <RequirementsModal 
            requirements={selectedRequirements}
            onClose={() => setSelectedRequirements(null)}
          />
        )}
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
    marginBottom: '2.5rem',
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(78, 205, 196, 0.3)',
  },
  songsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 300px))',
    gap: '1.5rem',
    padding: '1rem',
    justifyContent: 'center',
  },
  songCard: {
    backgroundColor: 'rgba(37, 37, 37, 0.9)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    maxWidth: '300px',
    width: '100%',
    position: 'relative' as const,
  },
  bossSongCard: {
    backgroundColor: 'rgba(37, 37, 37, 0.9)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255, 59, 59, 0.5)',
    maxWidth: '300px',
    width: '100%',
    position: 'relative' as const,
  },
  imageContainer: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
    maxHeight: '300px',
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
  songInfo: {
    padding: '1.2rem',
    textAlign: 'center' as const,
  },
  songName: {
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  songLevel: {
    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
    color: '#888',
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
    fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
    fontWeight: 'bold',
  },
  detailValue: {
    color: '#fff',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
  },
  downloadButton: {
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    maxWidth: '250px',
    margin: '0.5rem auto 0',
    transition: 'all 0.3s ease',
  },
  sortControls: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto 2rem',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  designerSelect: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    maxWidth: '300px',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
  sortButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  sortButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    maxWidth: '200px',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
  bossTag: {
    backgroundColor: 'rgba(255, 59, 59, 0.2)',
    color: '#ff3b3b',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    marginLeft: '8px',
    fontWeight: 'bold',
  },
  lockIcon: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    fontSize: '24px',
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    padding: '5px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  levelBadgesContainer: {
    position: 'absolute' as const,
    bottom: '10px',
    right: '10px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  levelBadge: {
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap' as const,
  },
  levelBadgeReMaster: {
    backgroundColor: 'rgba(135, 206, 235, 0.9)', // Light blue
  },
  levelBadgeMaster: {
    backgroundColor: 'rgba(0, 0, 255, 0.9)', // Blue
  },
  levelBadgeExpert: {
    backgroundColor: 'rgba(255, 0, 0, 0.9)', // Red
  },
  levelBadgeAdvanced: {
    backgroundColor: 'rgba(255, 165, 0, 0.9)', // Orange
  },
  levelBadgeBasic: {
    backgroundColor: 'rgba(0, 255, 0, 0.9)', // Green
  },
};

export default MaiChart; 