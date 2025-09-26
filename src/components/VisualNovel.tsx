import React, { useState, useEffect } from 'react';
import './VisualNovel.css';

// ประเภทข้อมูลสำหรับ dialog
interface DialogChoice {
  text: string;
  nextId: string;
  action?: () => void; // สำหรับการกระทำพิเศษ
}

interface DialogScene {
  id: string;
  characterName?: string;
  characterAvatar?: string;
  characterEmotion?: string; // สำหรับอนาคต - different expressions
  text: string;
  background?: string; // URL ของภาพพื้นหลัง
  backgroundMusic?: string; // URL ของเพลงพื้นหลัง
  soundEffect?: string; // URL ของ sound effect
  nextId?: string; // ถ้าไม่มี choices
  choices?: DialogChoice[]; // ตัวเลือกหลายทาง
  delay?: number; // ความเร็วของ typewriter (milliseconds)
  autoNext?: boolean; // เลื่อนต่อโดยอัตโนมัติ
  autoNextDelay?: number; // เวลารอก่อนเลื่อนต่ออัตโนมัติ
}

interface VisualNovelProps {
  scenes: DialogScene[];
  startSceneId: string;
  onComplete?: () => void;
  onSceneChange?: (sceneId: string) => void;
  className?: string;
  enableSaveLoad?: boolean;
  storyId?: string; // สำหรับระบบ save/load
}

const VisualNovel: React.FC<VisualNovelProps> = ({
  scenes,
  startSceneId,
  onComplete,
  onSceneChange,
  className = '',
  enableSaveLoad = false,
  storyId = 'default'
}) => {
  const [currentSceneId, setCurrentSceneId] = useState(startSceneId);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [background, setBackground] = useState<string>('');
  const [history, setHistory] = useState<string[]>([startSceneId]); // สำหรับระบบ back

  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    if (enableSaveLoad && storyId) {
      const savedData = localStorage.getItem(`vn_save_${storyId}`);
      if (savedData) {
        try {
          const { sceneId, historyData } = JSON.parse(savedData);
          setCurrentSceneId(sceneId);
          setHistory(historyData);
        } catch (e) {
          console.warn('Failed to load save data:', e);
        }
      }
    }
  }, [enableSaveLoad, storyId]);

  // บันทึกข้อมูลลง localStorage
  const saveProgress = () => {
    if (enableSaveLoad && storyId) {
      const saveData = {
        sceneId: currentSceneId,
        historyData: history
      };
      localStorage.setItem(`vn_save_${storyId}`, JSON.stringify(saveData));
      alert('บันทึกความคืบหน้าแล้ว!');
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!currentScene) return;

    const fullText = currentScene.text;
    const delay = currentScene.delay || 50;
    
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);

    let i = 0;
    let cancelled = false;

    const typeChar = () => {
      if (cancelled) return;
      
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      
      if (i < fullText.length) {
        setTimeout(typeChar, delay);
      } else {
        setIsTyping(false);
        // แสดงตัวเลือกหรือปุ่มต่อไป
        if (currentScene.choices && currentScene.choices.length > 0) {
          setShowChoices(true);
        }
        // Auto next หากตั้งไว้
        if (currentScene.autoNext && currentScene.nextId) {
          setTimeout(() => {
            if (!cancelled) {
              nextScene(currentScene.nextId!);
            }
          }, currentScene.autoNextDelay || 2000);
        }
      }
    };

    typeChar();

    return () => {
      cancelled = true;
    };
  }, [currentSceneId, scenes]);

  // เปลี่ยนพื้นหลังเมื่อ scene เปลี่ยน
  useEffect(() => {
    if (currentScene?.background) {
      setBackground(currentScene.background);
    }
  }, [currentScene]);

  // แจ้งเหตุการณ์เปลี่ยน scene
  useEffect(() => {
    if (onSceneChange) {
      onSceneChange(currentSceneId);
    }
  }, [currentSceneId, onSceneChange]);

  const nextScene = (nextId: string) => {
    if (nextId === 'END') {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const nextScene = scenes.find(scene => scene.id === nextId);
    if (nextScene) {
      setHistory(prev => [...prev, nextId]);
      setCurrentSceneId(nextId);
    }
  };

  const handleNext = () => {
    if (isTyping) {
      // ถ้ากำลังพิมพ์อยู่ ให้แสดงข้อความเต็มทันที
      setDisplayedText(currentScene?.text || '');
      setIsTyping(false);
      if (currentScene?.choices && currentScene.choices.length > 0) {
        setShowChoices(true);
      }
      return;
    }

    if (currentScene?.choices && currentScene.choices.length > 0) {
      // ถ้ามีตัวเลือก ต้องเลือกก่อน
      return;
    }

    if (currentScene?.nextId) {
      nextScene(currentScene.nextId);
    }
  };

  const handleChoice = (choice: DialogChoice) => {
    if (choice.action) {
      choice.action();
    }
    nextScene(choice.nextId);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // ลบ scene ปัจจุบัน
      const previousSceneId = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentSceneId(previousSceneId);
    }
  };

  if (!currentScene) {
    return (
      <div className={`visual-novel error ${className}`}>
        <div className="error-message">
          Scene not found: {currentSceneId}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`visual-novel ${className}`}
      style={{
        backgroundImage: background ? `url(${background})` : 'none',
      }}
    >
      {/* พื้นหลัง overlay */}
      <div className="vn-background-overlay" />
      
      {/* ควบคุม */}
      <div className="vn-controls">
        {history.length > 1 && (
          <button className="vn-control-btn vn-back-btn" onClick={goBack}>
            ← กลับ
          </button>
        )}
        {enableSaveLoad && (
          <button className="vn-control-btn vn-save-btn" onClick={saveProgress}>
            💾 บันทึก
          </button>
        )}
      </div>

      {/* Character (ถ้ามี) */}
      {currentScene.characterAvatar && (
        <div className="vn-character">
          <img 
            src={currentScene.characterAvatar} 
            alt={currentScene.characterName || 'Character'}
            className="vn-character-image"
          />
        </div>
      )}

      {/* Dialog box */}
      <div className="vn-dialog-container" onClick={handleNext}>
        <div className="vn-dialog-box">
          {currentScene.characterName && (
            <div className="vn-character-name">
              {currentScene.characterName}
            </div>
          )}
          
          <div className="vn-text">
            {displayedText}
            {isTyping && <span className="vn-cursor">▌</span>}
          </div>

          {!isTyping && !showChoices && (
            <div className="vn-continue-hint">
              คลิกเพื่อดำเนินต่อ
            </div>
          )}
        </div>

        {/* Choices */}
        {showChoices && currentScene.choices && (
          <div className="vn-choices">
            {currentScene.choices.map((choice, index) => (
              <button
                key={index}
                className="vn-choice-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChoice(choice);
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualNovel;
