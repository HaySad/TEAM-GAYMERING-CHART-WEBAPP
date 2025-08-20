import React, { useState, useRef, useEffect } from 'react';
import StarBackground from '../components/StarBackground';
import { higurashiDan1Songs } from '../data/higurashi-dan1';
import { higurashiDan2Songs } from '../data/higurashi-dan2';
import { higurashiDan3Songs } from '../data/higurashi-dan3';
//import { higurashiDanBossSongs } from '../data/higurashi-dan-boss';
import { useNavigate } from 'react-router-dom';

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
    width: '400px',
    height: '120px',
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
    flex: 1,
    minWidth: 0,
  },
  songName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#ff9800',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  songLevel: {
    color: '#fff',
    fontSize: '0.95rem',
  },
  songDetail: {
    color: '#ffb74d',
    fontSize: '0.9rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
  glassBreakOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.8)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassBreakAnimation: {
    width: '300px',
    height: '300px',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thirdSongCard: {
    background: 'rgba(40, 20, 0, 0.7)',
    borderRadius: '12px',
    padding: '1.2rem',
    margin: '1rem 0',
    boxShadow: '0 2px 8px 0 #ff0000, 0 0 20px rgba(255, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    width: '400px',
    height: '120px',
    animation: 'thirdSongAppear 0.8s ease-out',
  },
};

function getRandomSong(songs: any[]) {
  return songs[Math.floor(Math.random() * songs.length)];
}

// ฟังก์ชันสำหรับแปลง level เป็นรูปแบบ x หรือ x+
function formatLevel(level: number): string {
  const integerPart = Math.floor(level);
  const decimalPart = level - integerPart;
  
  if (decimalPart === 0) {
    return integerPart.toString();
  } else if (decimalPart > 0.6) {
    return `${integerPart}+`;
  } else {
    return integerPart.toString();
  }
}

const HigurashiDan: React.FC = () => {
  const [step, setStep] = useState(0); // 0 = ยังไม่สุ่ม, 1 = สุ่มเพลง 1 แล้ว, 2 = สุ่มเพลง 2 แล้ว, 3 = สุ่มเพลง 3 แล้ว
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [showBossModal, setShowBossModal] = useState(false);
  const [showBossDownload, setShowBossDownload] = useState(false);
  const [toriiDialogIndex, setToriiDialogIndex] = useState(0);
  const [toriiDialogText, setToriiDialogText] = useState('');
  const [toriiBreak, setToriiBreak] = useState(false);
  const [showFinishQuestion, setShowFinishQuestion] = useState(false);
  const [showGlassBreak, setShowGlassBreak] = useState(false);
  const [showThirdSong, setShowThirdSong] = useState(false);
  const navigate = useNavigate();

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
      // เพลงที่ 3 จาก dan3 - เริ่มอนิเมชันกระจกแตก
      setShowGlassBreak(true);
      setTimeout(() => {
        const song3 = higurashiDan3Songs[0];
        setSelectedSongs([selectedSongs[0], selectedSongs[1], song3]);
        setShowGlassBreak(false);
        setShowThirdSong(true);
        setStep(3);
      }, 2000); // รอ 2 วินาทีให้อนิเมชันกระจกแตกเล่นจบ
    }
  };

  const handleEnd = () => {
    setShowBossModal(true);
    setShowBossDownload(false);
    setToriiDialogIndex(0);
    setToriiDialogText('');
    setToriiBreak(false);
  };

  const handleReset = () => {
    setStep(0);
    setSelectedSongs([]);
    setShowBossModal(false);
    setShowBossDownload(false);
    setShowFinishQuestion(false);
    setShowGlassBreak(false);
    setShowThirdSong(false);
  };

  // Typewriter & dialog change effect
  React.useEffect(() => {
    if (!showBossModal) return;
    let dialogTimeout: NodeJS.Timeout;
    let typeTimeout: NodeJS.Timeout;
    let breakTimeout: NodeJS.Timeout;
    let downloadTimeout: NodeJS.Timeout;
    let isCancelled = false;

    function showDialogLine(idx: number) {
      setToriiDialogText('');
      let charIdx = 0;
      function typeChar() {
        if (isCancelled) return;
        setToriiDialogText(toriiDialog[idx].slice(0, charIdx + 1));
        if (charIdx < toriiDialog[idx].length - 1) {
          typeTimeout = setTimeout(typeChar, 40);
          charIdx++;
        } else {
          // Wait 5s then go to next line or break
          if (idx < toriiDialog.length - 1) {
            dialogTimeout = setTimeout(() => {
              setToriiDialogIndex(idx + 1);
            }, 5000);
          } else {
            // สุดท้าย: รอ 1.2 วิ แล้ว trigger break, รออีก 1.8 วิ แล้ว show download
            breakTimeout = setTimeout(() => setToriiBreak(true), 1200);
            downloadTimeout = setTimeout(() => setShowBossDownload(true), 3000);
          }
        }
      }
      typeChar();
    }

    showDialogLine(toriiDialogIndex);

    return () => {
      isCancelled = true;
      clearTimeout(dialogTimeout);
      clearTimeout(typeTimeout);
      clearTimeout(breakTimeout);
      clearTimeout(downloadTimeout);
    };
    // eslint-disable-next-line
  }, [showBossModal, toriiDialogIndex]);

  useEffect(() => {
    if (showBossDownload) {
      setShowFinishQuestion(true);
    }
  }, [showBossDownload]);

  return (
    <div style={styles.pageWrapper}>
      <StarBackground />
      <div style={styles.container}>
        <h1 style={styles.header}>Higurashi 段位認定</h1>
        {selectedSongs.map((song, idx) => (
          <div key={song.id} style={idx === 2 && showThirdSong ? styles.thirdSongCard : styles.songCard}>
            <img src={song.image} alt={song.name} style={styles.songImage} />
            <div style={styles.songInfo}>
              <div style={styles.songName}>{`เพลงที่ ${idx + 1}: ${song.name}`}</div>
              <div style={styles.songLevel}>Level: {formatLevel(song.level)}</div>
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

      {/* Glass Break Animation */}
      {showGlassBreak && (
        <div style={styles.glassBreakOverlay}>
          <div style={styles.glassBreakAnimation}>
            <GlassBreakEffect />
          </div>
        </div>
      )}

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
            {/* เล่นเพลง boss theme หลังประตูแตกและในหน้า download (render แค่ 1 ตัว) */}
            {(toriiBreak || showBossDownload) && <BossAudioPlayer src={BOSS_THEME_AUDIO} />}
            <ToriiBreakAnimation
              dialogText={showBossDownload ? '' : toriiDialogText}
              breakNow={toriiBreak}
            />
            {showBossDownload && (
              <div style={{textAlign: 'center'}}>
                <h2 style={{color: '#ff9800'}}>🎵 Special Boss Song!</h2>
                <div style={{color: '#fff', fontWeight: 'bold', marginBottom: 8, fontSize: '1.1rem'}}>Lament Rain</div>
                <button
                  style={styles.downloadButton}
                  onClick={() => {
                    window.open('/songs/all/higurashi/Lament-rain.jpg', '_blank');
                  }}
                >
                  Download Boss Song
                </button>
                {/* ปุ่ม Yes/No ใต้ปุ่ม Download */}
                {showFinishQuestion && (
                  <div style={{marginTop: 16}}>
                    <div style={{color: '#ff9800', marginBottom: 8, fontWeight: 'bold'}}>เล่นจบแล้วหรือยัง? / Did you finish playing?</div>
                    <button style={{...styles.downloadButton, marginRight: 8}} onClick={() => { setShowFinishQuestion(false); navigate('/solar-system'); }}>Yes</button>
                    <button style={styles.downloadButton} onClick={() => setShowFinishQuestion(false)}>No</button>
                  </div>
                )}
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

// ไดอะลอกสำหรับอนิเมชั่น
const toriiDialog = [
  'ยินดีด้วย คุณได้ผ่าน Higurashi',
  'อย่างไรก็ดีคุณก็รู้ว่ามันไม่หมดเพียงเท่านี้',
  'ใช่ ผมมีบางอย่างจะบอกว่า',
  'ได้เวลารับฝนตกแล้ว',
  'Lament Rain',

  //'ยินดีด้วย คุณได้ผ่าน Higurashi',
  //'อย่างไรก็ดีคุณก็รู้ว่ามันไม่หมดเพียงเท่านี้',
  //'ใช่ ผมมีบางอย่างจะบอกว่า',
  //'ได้เวลารับฝนตกแล้ว',
  //'Lament Rain',
];

// กำหนด path เพลง boss theme 
const BOSS_THEME_AUDIO = '/songs/boss-song/track.mp3';

interface ToriiBreakAnimationProps {
  dialogText: string;
  breakNow: boolean;
}

const ToriiBreakAnimation: React.FC<ToriiBreakAnimationProps> = ({ dialogText, breakNow }) => {
  return (
    <div style={{width: 180, height: 180, position: 'relative', margin: '2rem auto'}}>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 30, left: 20, width: 140, height: 20,
        background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: '8px 8px 6px 6px',
        boxShadow: '0 2px 8px 0 #ff9800',
        zIndex: 2,
        animation: breakNow ? 'toriiTopBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) forwards' : undefined,
      }} />
      {/* Left leg */}
      <div style={{
        position: 'absolute', left: 38, top: 50, width: 18, height: 90,
        background: 'linear-gradient(180deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: 8,
        zIndex: 1,
        boxShadow: '0 0 8px 0 #ff9800',
        animation: breakNow ? 'toriiLegLeftBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) forwards' : undefined,
      }} />
      {/* Right leg */}
      <div style={{
        position: 'absolute', right: 38, top: 50, width: 18, height: 90,
        background: 'linear-gradient(180deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: 8,
        zIndex: 1,
        boxShadow: '0 0 8px 0 #ff9800',
        animation: breakNow ? 'toriiLegRightBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) forwards' : undefined,
      }} />
      {/* Bar */}
      <div style={{
        position: 'absolute', top: 70, left: 55, width: 70, height: 12,
        background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
        borderRadius: 4,
        zIndex: 2,
        boxShadow: '0 1px 6px 0 #ff9800',
        animation: breakNow ? 'toriiBarBreak 1.2s cubic-bezier(.7,-0.2,.7,1.5) forwards' : undefined,
      }} />
      {/* Effect text */}
      {dialogText && (
        <div style={{position: 'absolute', width: '100%', top: 140, textAlign: 'center', color: '#ff9800', fontWeight: 'bold', fontSize: 22, letterSpacing: 2, opacity: 0.9}}>
          {dialogText}
        </div>
      )}
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
        @keyframes songImageAppear {
          from { 
            opacity: 0; 
            transform: scale(0.3) rotate(180deg); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
        }
        @keyframes songTitleAppear {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
        }
      `}</style>
    </div>
  );
}; 

// Component สำหรับเล่น audio ด้วย volume 0.5
const BossAudioPlayer: React.FC<{ src: string }> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, [src]);
  return <audio ref={audioRef} src={src} autoPlay style={{display: 'none'}} />;
};

// Component สำหรับอนิเมชันกระจกแตก
const GlassBreakEffect: React.FC = () => {
  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      {/* Glass pieces */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '60%',
        height: '60%',
        border: '3px solid #fff',
        borderRadius: '50%',
        animation: 'glassBreak 2s ease-out forwards',
        boxShadow: '0 0 20px rgba(255,255,255,0.8)',
      }} />
      
      {/* Crack lines */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '0',
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #fff, transparent)',
        animation: 'crackLine 0.5s ease-out 0.3s forwards',
        transform: 'translateY(-50%)',
      }} />
      <div style={{
        position: 'absolute',
        top: '0',
        left: '50%',
        width: '2px',
        height: '100%',
        background: 'linear-gradient(180deg, transparent, #fff, transparent)',
        animation: 'crackLine 0.5s ease-out 0.5s forwards',
        transform: 'translateX(-50%)',
      }} />
      
      {/* Glass shards */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '20px',
          height: '20px',
          background: 'rgba(255,255,255,0.9)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          animation: `glassShard 1.5s ease-out ${0.8 + i * 0.1}s forwards`,
          transform: 'translate(-50%, -50%)',
        }} />
      ))}
      
      {/* CSS Keyframes */}
      <style>{`
        @keyframes glassBreak {
          0% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg);
            box-shadow: 0 0 20px rgba(255,255,255,0.8);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.1) rotate(180deg);
            box-shadow: 0 0 40px rgba(255,255,255,1);
          }
          100% { 
            opacity: 0; 
            transform: scale(0.5) rotate(360deg);
            box-shadow: 0 0 10px rgba(255,255,255,0.3);
          }
        }
        @keyframes crackLine {
          0% { 
            opacity: 0; 
            transform: scaleX(0);
          }
          100% { 
            opacity: 1; 
            transform: scaleX(1);
          }
        }
        @keyframes glassShard {
          0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.1) rotate(720deg) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
          }
        }
        @keyframes thirdSongAppear {
          0% { 
            opacity: 0; 
            transform: scale(0.5) rotateY(90deg);
            box-shadow: 0 0 0 rgba(255, 0, 0, 0);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.1) rotateY(45deg);
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.8);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotateY(0deg);
            box-shadow: 0 2px 8px 0 #ff0000, 0 0 20px rgba(255, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
}; 