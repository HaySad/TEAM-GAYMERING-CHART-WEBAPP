import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// สร้างฟังก์ชันสุ่มระอองดาว (star background) แบบเคลื่อนไหวตลอดเวลา
function StarBackground() {
  // สุ่มข้อมูลดาวแต่ละดวง (ตำแหน่ง, ขนาด, ความเร็ว, ทิศทาง)
  const stars = Array.from({ length: 120 }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 16 + Math.random() * 8; // 16-24s (ช้ากว่าเดิม 4 เท่า)
    const delay = Math.random() * duration;
    // ดาวจะลอยลงล่างแบบ loop
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'white',
          opacity: Math.random() * 0.7 + 0.3,
          boxShadow: `0 0 ${size * 6}px 1px #fff8`,
          animation: `star-fall ${duration}s linear ${delay}s infinite`,
        }}
      />
    );
  });
  return (
    <>
      <style>{`
        @keyframes star-fall {
          0% { transform: translateY(0); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
      <div style={{position: 'fixed', width: '100vw', height: '100vh', left: 0, top: 0, zIndex: 0, pointerEvents: 'none'}}>{stars}</div>
    </>
  );
}

const planets = [
  { name: 'Mercury', color: '#b1b1b1', size: 12, orbit: 50 },
  { name: 'Venus', color: '#e6c97b', size: 18, orbit: 80 },
  { name: 'Earth', color: '#4e8cff', size: 20, orbit: 110 },
  { name: 'Mars', color: '#d14b2a', size: 16, orbit: 140 },
  { name: 'Jupiter', color: '#e3b97b', size: 32, orbit: 180 },
  { name: 'Saturn', color: '#e6d47b', size: 28, orbit: 220 },
  { name: 'Uranus', color: '#7be6e6', size: 22, orbit: 260 },
  { name: 'Neptune', color: '#4b7be6', size: 22, orbit: 300 },
];

const SolarSystem: React.FC = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogs, setDialogs] = useState<any[]>([]);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(''); // สำหรับ typewriter
  const [showCustomBackground, setShowCustomBackground] = useState(false); // สำหรับเปลี่ยนพื้นหลัง

  useEffect(() => {
    setShowDialog(true);
    fetch('/solar-dialog.json')
      .then(res => res.json())
      .then(data => {
        setDialogs(data);
        setDialogIndex(0);
      });
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!dialogs.length || !dialogs[dialogIndex] || typeof dialogs[dialogIndex].text !== 'string') return;
    const fullText = dialogs[dialogIndex].text;
    setDisplayedText('');
    let i = 0;
    let cancelled = false;
    function typeChar() {
      if (cancelled) return;
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i < fullText.length) {
        setTimeout(typeChar, 30);
      }
    }
    typeChar();
    return () => { cancelled = true; };
  }, [dialogIndex, dialogs]);

  const handleNext = () => {
    if (!dialogs.length || !dialogs[dialogIndex] || typeof dialogs[dialogIndex].text !== 'string') return;
    if (displayedText.length < dialogs[dialogIndex].text.length) {
      setDisplayedText(dialogs[dialogIndex].text);
      return;
    }
    
    // ตรวจสอบว่าถึง intro-5 แล้วหรือยัง เพื่อเปลี่ยนพื้นหลัง
    if (dialogs[dialogIndex].id === 'intro-5') {
      setShowCustomBackground(true);
    }
    
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    } else {
      // หลังจากเล่น dialog เสร็จแล้ว ให้กลับไปหน้าหลัก
      navigate('/');
    }
  };

  const dialogData = dialogs[dialogIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: showCustomBackground 
        ? `url('songs/art/IMG_0682.PNG') center center / cover no-repeat`
        : 'radial-gradient(ellipse at center, #222 0%, #111 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ระอองดาวเคลื่อนไหวตลอดเวลา - แสดงเฉพาะเมื่อไม่ใช้พื้นหลังพิเศษ */}
      {!showCustomBackground && <StarBackground />}
      {/* ไม่แสดง Solar System อีกต่อไป เนื่องจากจะกลับไปหน้าหลักหลังจาก dialog เสร็จ */}
      {/* Dialog */}
      {showDialog && dialogData && (
        <div
          style={{
            position: 'fixed', bottom: 0, left: 0, width: '100%',
            background: 'rgba(30,30,30,0.95)', display: 'flex', alignItems: 'flex-end', zIndex: 9999, padding: 24,
            cursor: 'pointer'
          }}
          onClick={handleNext}
        >
          <img src={dialogData.avatar} style={{height: 120, marginLeft: 16, borderRadius: 12}} alt={dialogData.characterName}/>
          <div style={{margin: 16, flex: 1}}>
            <div style={{color: '#ff9800', fontWeight: 'bold', marginBottom: 4, fontSize: 20}}>{dialogData.characterName}</div>
            <div style={{color: '#fff', fontSize: 20, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12, minHeight: 48}}>
              {displayedText}
            </div>
            <div style={{marginTop: 12, color: '#aaa', fontSize: 14}}>คลิกเพื่อดำเนินต่อ / Click to continue</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystem; 