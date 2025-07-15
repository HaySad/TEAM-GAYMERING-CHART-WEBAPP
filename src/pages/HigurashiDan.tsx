import React, { useState } from 'react';
import StarBackground from '../components/StarBackground';
import { higurashiDan1Songs } from '../data/higurashi-dan1';
import { higurashiDan2Songs } from '../data/higurashi-dan2';
import { higurashiDan3Songs } from '../data/higurashi-dan3';
import { higurashiDanBossSongs } from '../data/higurashi-dan-boss';

const styles = {
  pageWrapper: {
    position: 'relative' as const,
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0B0B1F 0%, #1F1135 50%, #0B0B1F 100%)',
    overflow: 'hidden',
  },
  container: {
    padding: '1rem',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    position: 'relative' as const,
    zIndex: 1,
    minHeight: '80vh',
    color: '#ffffff',
    borderRadius: '16px',
    marginTop: '4rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #ff9800, #ff5722)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(255, 152, 0, 0.3)',
  },
  songCard: {
    background: 'rgba(40, 20, 0, 0.7)',
    borderRadius: '12px',
    padding: '1.2rem',
    margin: '1rem 0',
    boxShadow: '0 2px 8px 0 #ff9800',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    minWidth: '320px',
    maxWidth: '400px',
  },
  songImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover' as const,
    boxShadow: '0 0 12px #ff9800',
  },
  songInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.3rem',
  },
  songName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#ff9800',
  },
  songLevel: {
    color: '#fff',
    fontSize: '0.95rem',
  },
  songDetail: {
    color: '#ffb74d',
    fontSize: '0.9rem',
  },
  downloadButton: {
    marginTop: '0.7rem',
    background: 'linear-gradient(90deg, #ff9800, #ff5722)',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    padding: '0.4rem 1.2rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 1px 4px 0 #ff9800',
    transition: 'all 0.2s',
  },
  nextButton: {
    marginTop: '2.5rem',
    background: 'linear-gradient(90deg, #ff9800, #ff5722)',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    padding: '0.7rem 2.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 #ff9800',
    transition: 'all 0.2s',
  },
  comingSoon: {
    fontSize: '1.5rem',
    color: '#ff9800',
    marginTop: '2rem',
    textAlign: 'center' as const,
    opacity: 0.85,
  },
  bossModalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.7)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bossModalContent: {
    background: 'rgba(30, 30, 30, 0.98)',
    borderRadius: 18,
    padding: '2.5rem 2.5rem 2rem 2.5rem',
    minWidth: 340,
    minHeight: 220,
    boxShadow: '0 8px 32px 0 #ff9800',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },
  bossModalClose: {
    position: 'absolute' as const,
    top: 12,
    right: 16,
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 10,
    lineHeight: 1,
    padding: 0,
    transition: 'color 0.2s',
  },
};

function getRandomSong(songs: any[]) {
  return songs[Math.floor(Math.random() * songs.length)];
}

const HigurashiDan: React.FC = () => {
  const [step, setStep] = useState(0); // 0 = ยังไม่สุ่ม, 1 = สุ่มเพลง 1 แล้ว, 2 = สุ่มเพลง 2 แล้ว, 3 = สุ่มเพลง 3 แล้ว
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [showBossModal, setShowBossModal] = useState(false);
  const [showBossDownload, setShowBossDownload] = useState(false);

  const handleNext = () => {
    if (step === 0) {
      // สุ่มเพลงที่ 1 จาก dan1
      const song1 = getRandomSong(higurashiDan1Songs);
      setSelectedSongs([song1]);
      setStep(1);
    } else if (step === 1) {
      // สุ่มเพลงที่ 2 จาก dan2
      const song2 = getRandomSong(higurashiDan2Songs);
      setSelectedSongs([selectedSongs[0], song2]);
      setStep(2);
    } else if (step === 2) {
      // เพลงที่ 3 จาก dan3 (มีเพลงเดียว)
      const song3 = higurashiDan3Songs[0];
      setSelectedSongs([selectedSongs[0], selectedSongs[1], song3]);
      setStep(3);
    }
  };

  const handleEnd = () => {
    setShowBossModal(true);
    setShowBossDownload(false);
    setTimeout(() => {
      setShowBossDownload(true);
    }, 5000); // 5 วินาที
  };

  const handleReset = () => {
    setStep(0);
    setSelectedSongs([]);
    setShowBossModal(false);
    setShowBossDownload(false);
  };

  return (
    <div style={styles.pageWrapper}>
      <StarBackground />
      <div style={styles.container}>
        <h1 style={styles.header}>Higurashi 段位認定</h1>
        {selectedSongs.map((song, idx) => (
          <div key={song.id} style={styles.songCard}>
            <img src={song.image} alt={song.name} style={styles.songImage} />
            <div style={styles.songInfo}>
              <div style={styles.songName}>{`เพลงที่ ${idx + 1}: ${song.name}`}</div>
              <div style={styles.songLevel}>Level: {song.level}</div>
              <div style={styles.songDetail}>Artist: {song.artist}</div>
              <div style={styles.songDetail}>Chart by: {song.chartDesigner}</div>
              <button
                style={styles.downloadButton}
                onClick={() => window.open(song.downloadUrl, '_blank')}
              >
                Download
              </button>
            </div>
          </div>
        ))}
        {step < 3 ? (
          <button style={styles.nextButton} onClick={handleNext}>
            {step === 0 ? 'สุ่มเพลงแรก' : step === 1 ? 'สุ่มเพลงที่สอง' : 'สุ่มเพลงที่สาม'}
          </button>
        ) : (
          <button style={styles.nextButton} onClick={handleEnd}>End ?</button>
        )}
        {/* Reset button on page */}
        <button style={{...styles.nextButton, background: 'rgba(255,107,107,0.8)', marginTop: 16}} onClick={handleReset}>
          Reset
        </button>

      {/* Boss Modal Popup */}
      {showBossModal && (
        <div style={styles.bossModalOverlay}>
          <div style={styles.bossModalContent}>
            {/* Close button */}
            <button
              style={styles.bossModalClose}
              onClick={() => setShowBossModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            {!showBossDownload ? (
              <ToriiBreakAnimation />
            ) : (
              <div style={{textAlign: 'center'}}>
                <h2 style={{color: '#ff9800'}}>🎵 Special Boss Song!</h2>
                <img src={higurashiDanBossSongs[0].image} alt={higurashiDanBossSongs[0].name} style={{width: 120, borderRadius: 12, margin: '1rem auto'}} />
                <div style={{color: '#fff', fontWeight: 'bold', marginBottom: 8}}>{higurashiDanBossSongs[0].name}</div>
                <button
                  style={styles.downloadButton}
                  onClick={() => window.open(higurashiDanBossSongs[0].downloadUrl, '_blank')}
                >
                  Download Boss Song
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default HigurashiDan;

// เพิ่ม ToriiBreakAnimation component (CSS inline)
const ToriiBreakAnimation: React.FC = () => {
  // ใช้ state เพื่อ trigger effect (optional)
  return (
    <div style={{width: 180, height: 180, position: 'relative', margin: '2rem auto'}}>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 30, left: 20, width: 140, height: 20,
        background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: '8px 8px 6px 6px',
        boxShadow: '0 2px 8px 0 #ff9800',
        zIndex: 2,
        animation: 'toriiTopBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) 2.2s forwards',
      }} />
      {/* Left leg */}
      <div style={{
        position: 'absolute', left: 38, top: 50, width: 18, height: 90,
        background: 'linear-gradient(180deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: 8,
        zIndex: 1,
        boxShadow: '0 0 8px 0 #ff9800',
        animation: 'toriiLegLeftBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) 2.5s forwards',
      }} />
      {/* Right leg */}
      <div style={{
        position: 'absolute', right: 38, top: 50, width: 18, height: 90,
        background: 'linear-gradient(180deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: 8,
        zIndex: 1,
        boxShadow: '0 0 8px 0 #ff9800',
        animation: 'toriiLegRightBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) 2.5s forwards',
      }} />
      {/* Bar */}
      <div style={{
        position: 'absolute', top: 70, left: 55, width: 70, height: 12,
        background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: 4,
        zIndex: 2,
        boxShadow: '0 1px 6px 0 #ff9800',
        animation: 'toriiBarBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) 2.3s forwards',
      }} />
      {/* Effect text */}
      <div style={{position: 'absolute', width: '100%', top: 140, textAlign: 'center', color: '#ff9800', fontWeight: 'bold', fontSize: 22, letterSpacing: 2, opacity: 0.9}}>
        ??????
      </div>
      {/* Keyframes */}
      <style>{`
        @keyframes toriiTopBreak {
          to { transform: rotate(-18deg) translateY(-60px) scaleX(1.1); opacity: 0.2; }
        }
        @keyframes toriiLegLeftBreak {
          to { transform: rotate(-30deg) translate(-30px, 60px) scaleY(0.7); opacity: 0.1; }
        }
        @keyframes toriiLegRightBreak {
          to { transform: rotate(30deg) translate(30px, 60px) scaleY(0.7); opacity: 0.1; }
        }
        @keyframes toriiBarBreak {
          to { transform: rotate(12deg) translateY(40px) scaleX(1.2); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}; 