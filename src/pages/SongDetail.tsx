import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maiChartData, ChartStats } from '../data/maiChartData';
import StarBackground from '../components/StarBackground';

const SongDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = maiChartData.find(s => s.id === id);
  const [chartStats, setChartStats] = useState<ChartStats | null>(null);
  const [chartError,] = useState<string>('');

  useEffect(() => {
    if (song) {
      if (song.chartStats !== 'None') {
        setChartStats(song.chartStats as ChartStats);
      }
    }
  }, [song]);

  if (!song) {
    return (
      <div style={styles.container}>
        <h1 style={styles.errorText}>ไม่พบเพลง / Song not found</h1>
        <button style={styles.backButton} onClick={() => navigate('/mai-chart')}>
          กลับ / Back
        </button>
      </div>
    );
  }

  return (
    <>
      <StarBackground />
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={styles.header}>
            <button style={styles.backButton} onClick={() => {
              const scrollPosition = sessionStorage.getItem('maiChartScrollPosition');
              navigate('/mai-chart');
              if (scrollPosition) {
                setTimeout(() => {
                  window.scrollTo({
                    top: parseInt(scrollPosition),
                    behavior: 'smooth'
                  });
                }, 100);
              }
            }}>
              ← กลับ / Back
            </button>
            <h1 style={styles.title}>{song.name}</h1>
          </div>

          <div style={styles.content}>
            <div style={styles.imageSection}>
              <img 
                src={song.image} 
                alt={song.name}
                style={styles.songImage}
              />
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
                    {diff.level}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.detailsSection}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>🎵 Artist</span>
                <span style={styles.detailValue}>{song.artist}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>🎮 Chart by</span>
                <span style={styles.detailValue}>{song.chartDesigner}</span>
              </div>
              {song.requirements && (
                <div style={styles.requirementsSection}>
                  <h2 style={styles.requirementsTitle}>Requirements</h2>
                  <p style={styles.requirementsDescription}>{song.requirements.description}</p>
                  <ul style={styles.requirementsList}>
                    {song.requirements.conditions.map((condition, index) => (
                      <li key={index} style={styles.requirementItem}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
              {song.chartStats !== 'None' && (
                <div style={styles.chartStatsSection}>
                  <h2 style={styles.chartStatsTitle}>Chart Information</h2>
                  {chartError ? (
                    <p style={styles.chartError}>{chartError}</p>
                  ) : chartStats ? (
                    <>
                      <div style={styles.chartStatsGrid}>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>BPM</span>
                          <span style={styles.chartStatValue}>{chartStats.bpm}</span>
                        </div>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>Total Notes</span>
                          <span style={styles.chartStatValue}>{chartStats.totalNotes}</span>
                        </div>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>TAP</span>
                          <span style={styles.chartStatValue}>
                            {chartStats.taps}
                            <span style={styles.percentageText}>
                              ({((chartStats.taps / chartStats.totalNotes) * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>HOLD</span>
                          <span style={styles.chartStatValue}>
                            {chartStats.holds}
                            <span style={styles.percentageText}>
                              ({((chartStats.holds / chartStats.totalNotes) * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>SLIDE</span>
                          <span style={styles.chartStatValue}>
                            {chartStats.slides}
                            <span style={styles.percentageText}>
                              ({((chartStats.slides / chartStats.totalNotes) * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>TOUCH</span>
                          <span style={styles.chartStatValue}>
                            {chartStats.touches}
                            <span style={styles.percentageText}>
                              ({((chartStats.touches / chartStats.totalNotes) * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div style={styles.chartStatItem}>
                          <span style={styles.chartStatLabel}>BREAK</span>
                          <span style={styles.chartStatValue}>
                            {chartStats.breaks}
                            <span style={styles.percentageText}>
                              ({((chartStats.breaks / chartStats.totalNotes) * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) :
                    <div style={styles.chartLoading}>Loading chart data...</div>
                  }
                </div>
              )}
              <button 
                style={styles.downloadButton}
                onClick={() => window.open(song.downloadUrl, '_blank')}
                disabled={song.requirements?.isLocked}
              >
                {song.requirements?.isLocked ? 'Locked' : 'ดาวน์โหลด / Download ⬇️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative' as const,
    zIndex: 1,
    background: 'linear-gradient(to bottom, rgba(11, 11, 31, 0.8) 0%, rgba(31, 17, 53, 0.8) 50%, rgba(11, 11, 31, 0.8) 100%)',
  },
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#ffffff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
  },
  backButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  imageSection: {
    position: 'relative' as const,
    borderRadius: '12px',
    overflow: 'hidden',
    aspectRatio: '1',
  },
  songImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
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
    backgroundColor: 'rgba(135, 206, 235, 0.9)',
  },
  levelBadgeMaster: {
    backgroundColor: 'rgba(0, 0, 255, 0.9)',
  },
  levelBadgeExpert: {
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
  },
  levelBadgeAdvanced: {
    backgroundColor: 'rgba(255, 165, 0, 0.9)',
  },
  levelBadgeBasic: {
    backgroundColor: 'rgba(0, 255, 0, 0.9)',
  },
  detailsSection: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    padding: '2rem',
    borderRadius: '12px',
    backdropFilter: 'blur(5px)',
  },
  detailItem: {
    marginBottom: '1.5rem',
  },
  detailLabel: {
    color: '#4ECDC4',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '0.5rem',
  },
  detailValue: {
    fontSize: '1.1rem',
    color: '#ffffff',
  },
  requirementsSection: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  requirementsTitle: {
    color: '#4ECDC4',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  requirementsDescription: {
    color: '#ffffff',
    marginBottom: '1rem',
  },
  requirementsList: {
    listStyle: 'none',
    padding: 0,
  },
  requirementItem: {
    color: '#ffffff',
    marginBottom: '0.5rem',
    paddingLeft: '1.5rem',
    position: 'relative' as const,
    '&::before': {
      content: '"•"',
      position: 'absolute' as const,
      left: 0,
      color: '#4ECDC4',
    },
  },
  downloadButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    border: 'none',
    padding: '1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '100%',
    marginTop: '2rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.25)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  errorText: {
    textAlign: 'center' as const,
    color: '#ff3b3b',
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },
  chartStatsSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(78, 205, 196, 0.2)',
  },
  chartStatsTitle: {
    color: '#4ECDC4',
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  chartStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  chartStatItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  chartStatLabel: {
    color: '#4ECDC4',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  chartStatValue: {
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
  },
  percentageText: {
    fontSize: '0.9rem',
    opacity: 0.8,
    marginLeft: '0.5rem',
  },
  chartError: {
    color: '#ff3b3b',
    textAlign: 'center' as const,
    padding: '1rem',
  },
  chartLoading: {
    color: '#4ECDC4',
    textAlign: 'center' as const,
    padding: '1rem',
  },
};

export default SongDetail; 