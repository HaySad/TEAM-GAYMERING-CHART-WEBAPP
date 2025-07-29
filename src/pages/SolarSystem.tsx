import React, { useEffect, useState } from 'react';

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
  const [showDialog, setShowDialog] = useState(false);
  const [dialogs, setDialogs] = useState<any[]>([]);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(''); // สำหรับ typewriter

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
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    } else {
      setShowDialog(false);
    }
  };

  const dialogData = dialogs[dialogIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #222 0%, #111 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ระอองดาวเคลื่อนไหวตลอดเวลา */}
      <StarBackground />
      {/* Solar System */}
      {!showDialog && (
        <div style={{
          position: 'relative',
          width: 1200,
          height: 400,
          margin: '0 auto',
          background: 'rgba(0,0,0,0.1)'
        }}>
          {/* Sun */}
          <div style={{
            position: 'absolute',
            left: 40,
            top: '50%',
            width: 60,
            height: 60,
            background: 'radial-gradient(circle, #ffe066 60%, #ffae00 100%)',
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            boxShadow: '0 0 60px 20px #ffe06688',
            zIndex: 2
          }}>
            <span style={{
              position: 'absolute', left: '50%', top: '110%', transform: 'translateX(-50%)', color: '#ffe066', fontWeight: 'bold'
            }}>Sun</span>
          </div>
          {/* Planets */}
          {planets.map((planet, idx) => (
            <div key={planet.name} style={{
              position: 'absolute',
              left: 120 + idx * 75, // ระยะห่างแต่ละดวง
              top: '50%',
              width: planet.size,
              height: planet.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fff8 0%, ${planet.color} 60%, #000 100%)`,
              transform: 'translateY(-50%)',
              boxShadow: `0 0 16px 2px ${planet.color}88, 0 8px 24px 0 #000a`,
              zIndex: 2
            }}>
              <span style={{
                position: 'absolute', left: '50%', top: '120%', transform: 'translateX(-50%)', fontSize: 12, color: '#fff'
              }}>{planet.name}</span>
            </div>
          ))}
          {/* เส้นวงโคจรแนวนอน */}
          <div style={{
            position: 'absolute',
            left: 70,
            top: '50%',
            width: 600,
            height: 0,
            borderTop: '2px dashed #444',
            zIndex: 1
          }} />
        </div>
      )}
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