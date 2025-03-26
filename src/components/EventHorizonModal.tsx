import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventHorizonModal.css';

interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  downloadUrl: string;
  chartDesigner: string;
  artist: string;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface EventHorizonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongComplete: (songId: string) => void;
}

const EventHorizonModal: React.FC<EventHorizonModalProps> = ({ isOpen, onClose, onSongComplete }) => {
  const [currentTier, setCurrentTier] = useState<'10' | '11'>('10');
  const navigate = useNavigate();

  const tier10Songs = useMemo(() => [
    {
      id: '10-1',
      name: 'Hello BPM 2025',
      level: 15,
      image: '/songs/event/10-1.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: false
    },
    {
      id: '10-2',
      name: 'Event Horizon II',
      level: 14.9,
      image: '/songs/event/10-2.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    },
    {
      id: '10-3',
      name: 'Event Horizon III',
      level: 14.9,
      image: '/songs/event/10-3.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    },
    {
      id: '10-4',
      name: 'Event Horizon IV',
      level: 14.9,
      image: '/songs/event/10-4.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    }
  ], []);

  const tier11Songs = useMemo(() => [
    {
      id: '11-1',
      name: 'Singularity I',
      level: 15.0,
      image: '/songs/event/11-1.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    },
    {
      id: '11-2',
      name: 'Singularity II',
      level: 15.0,
      image: '/songs/event/11-2.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    },
    {
      id: '11-3',
      name: 'Singularity III',
      level: 15.0,
      image: '/songs/event/11-3.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    }
  ], []);

  const checkCompletedSongs = useCallback(() => {
    // Check localStorage for completed songs and unlock next songs
    const is10_1Completed = localStorage.getItem('event_10-1_completed') === 'true';
    const is10_2Completed = localStorage.getItem('event_10-2_completed') === 'true';
    const is10_3Completed = localStorage.getItem('event_10-3_completed') === 'true';
    const is10_4Completed = localStorage.getItem('event_10-4_completed') === 'true';

    if (is10_1Completed) {
      tier10Songs[1].isLocked = false;
    }
    if (is10_2Completed) {
      tier10Songs[2].isLocked = false;
    }
    if (is10_3Completed) {
      tier10Songs[3].isLocked = false;
    }
    if (is10_4Completed) {
      tier11Songs[0].isLocked = false;
      setCurrentTier('11');
    }

    const is11_1Completed = localStorage.getItem('event_11-1_completed') === 'true';
    const is11_2Completed = localStorage.getItem('event_11-2_completed') === 'true';

    if (is11_1Completed) {
      tier11Songs[1].isLocked = false;
    }
    if (is11_2Completed) {
      tier11Songs[2].isLocked = false;
    }
  }, [tier10Songs, tier11Songs]);

  useEffect(() => {
    checkCompletedSongs();
  }, [checkCompletedSongs]);

  const handleSongClick = (song: Song) => {
    if (song.isLocked) return;

    // Handle song completion
    onSongComplete(song.id);
    localStorage.setItem(`event_${song.id}_completed`, 'true');

    // Unlock next song based on completion
    if (song.id === '10-1') {
      tier10Songs[1].isLocked = false;
    } else if (song.id === '10-2') {
      tier10Songs[2].isLocked = false;
    } else if (song.id === '10-3') {
      tier10Songs[3].isLocked = false;
    } else if (song.id === '10-4') {
      tier11Songs[0].isLocked = false;
      setCurrentTier('11');
    } else if (song.id === '11-1') {
      tier11Songs[1].isLocked = false;
    } else if (song.id === '11-2') {
      tier11Songs[2].isLocked = false;
    }
  };

  const handleReset = () => {
    // Reset localStorage
    localStorage.removeItem('event_10-1_completed');
    localStorage.removeItem('event_10-2_completed');
    localStorage.removeItem('event_10-3_completed');
    localStorage.removeItem('event_10-4_completed');
    localStorage.removeItem('event_11-1_completed');
    localStorage.removeItem('event_11-2_completed');
    localStorage.removeItem('event_11-3_completed');

    // Reset locked status
    tier10Songs[1].isLocked = true;
    tier10Songs[2].isLocked = true;
    tier10Songs[3].isLocked = true;
    tier11Songs[0].isLocked = true;
    tier11Songs[1].isLocked = true;
    tier11Songs[2].isLocked = true;

    // Reset to tier 10
    setCurrentTier('10');
  };

  const handleClose = () => {
    onClose();
    navigate('/mai-chart');
  };

  return (
    <div className={`event-horizon-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-header">
        <button className="reset-button" onClick={handleReset}>Reset Progress</button>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      
      <div className="cards-container">
        <div className={`tier-${currentTier}`}>
          {currentTier === '10' ? (
            tier10Songs.map((song) => (
              <div
                key={song.id}
                className={`event-song-card ${song.isLocked ? 'locked' : ''}`}
                onClick={() => !song.isLocked && handleSongClick(song)}
              >
                <img src={song.image} alt={song.name} />
                <h3>{song.name}</h3>
                <div className="level">Lv.{song.level}</div>
              </div>
            ))
          ) : (
            tier11Songs.map((song) => (
              <div
                key={song.id}
                className={`event-song-card ${song.isLocked ? 'locked' : ''}`}
                onClick={() => !song.isLocked && handleSongClick(song)}
              >
                <img src={song.image} alt={song.name} />
                <h3>{song.name}</h3>
                <div className="level">Lv.{song.level}</div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="black-hole"></div>
    </div>
  );
};

export default EventHorizonModal; 