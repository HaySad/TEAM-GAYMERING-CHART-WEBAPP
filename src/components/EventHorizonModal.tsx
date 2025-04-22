import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SongDetailModal from './SongDetailModal';
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
  videoUrl?: string;
}

interface EventHorizonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongComplete: (songId: string) => void;
}

const EventHorizonModal: React.FC<EventHorizonModalProps> = ({ isOpen, onClose, onSongComplete }) => {
  const [currentTier, setCurrentTier] = useState<'10' | '11'>(() => {
    const savedTier = localStorage.getItem('event_current_tier');
    return (savedTier === '11' ? '11' : '10') as '10' | '11';
  });
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [, forceUpdate] = useState({});
  const navigate = useNavigate();

  const tier10Songs = useMemo(() => [
    {
      id: '10-1',
      name: 'Metaverse To Be Like This',
      level: 14.8,
      image: '/songs/event/10-1.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=13cqjn17WfDhCUKXFVwr5ZZgnqVx_TvNP',
      chartDesigner: 'papin002',
      artist: 'Camellia',
      lifeSystem: {
        maxLife: 400,
        great: 2,
        good: 3,
        miss: 5
      },
      isLocked: false
    },
    {
      id: '10-2',
      name: 'Daytime EP',
      level: 14.9,
      image: '/songs/event/10-2.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true,
      videoUrl: 'https://www.youtube.com/watch?v=K0I1gI0tX4U'
    },
    {
      id: '10-3',
      name: 'Love Me Like You Do',
      level: 13.8,
      image: '/songs/event/10-3.jpg',
      downloadUrl: '#',
      chartDesigner: 'Event Team',
      artist: 'Event Artist',
      isLocked: true
    },
    {
      id: '10-4',
      name: 'KOCMOC UNLEASHED',
      level: 16.0,
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
      name: 'The Daybreak Will Never Come Again.',
      level: 15.0,
      image: '/songs/event/11-1.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1PzOsc15uVVwISbbesoT9stp5W0dGmNU1',
      chartDesigner: '"S"ad for braeak',
      artist: 'seatrus',
      isLocked: true,
      lifeSystem: {
        maxLife: 4000,
        great: 2,
        good: 3,
        miss: 5
      }
    },
    {
      id: '11-2',
      name: 'The Solace of Oblivion',
      level: 15.9,
      image: '/songs/event/11-2.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1b84kGfo67KQea7x1W9Ei1UTUxFKKRRKK',
      chartDesigner: 'MacTheOne respects for RhoGaming',
      artist: 'Helblinde',
      isLocked: true,
      lifeSystem: {
        maxLife: 4000,
        great: 2,
        good: 3,
        miss: 5
      }
    },
    {
      id: '11-3',
      name: '???',
      level: 16,
      image: '/songs/event/unknown.png',
      downloadUrl: '/world-map',
      chartDesigner: '???',
      artist: '???',
      isLocked: true,
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
      localStorage.setItem('event_10-2_locked', 'false');
    }
    if (is10_2Completed) {
      tier10Songs[2].isLocked = false;
      localStorage.setItem('event_10-3_locked', 'false');
    }
    if (is10_3Completed) {
      tier10Songs[3].isLocked = false;
      localStorage.setItem('event_10-4_locked', 'false');
    }
    if (is10_4Completed) {
      tier11Songs[0].isLocked = false;
      localStorage.setItem('event_11-1_locked', 'false');
      setCurrentTier('11');
    }

    const is11_1Completed = localStorage.getItem('event_11-1_completed') === 'true';
    const is11_2Completed = localStorage.getItem('event_11-2_completed') === 'true';

    if (is11_1Completed) {
      tier11Songs[1].isLocked = false;
      localStorage.setItem('event_11-2_locked', 'false');
    }
    if (is11_2Completed) {
      tier11Songs[2].isLocked = false;
      localStorage.setItem('event_11-3_locked', 'false');
    }

    // Force re-render to update UI
    forceUpdate({});
  }, [tier10Songs, tier11Songs]);

  useEffect(() => {
    // Load initial locked status
    tier10Songs.forEach((song, index) => {
      if (index > 0) {
        const isLocked = localStorage.getItem(`event_${song.id}_locked`) !== 'false';
        song.isLocked = isLocked;
      }
    });
    
    tier11Songs.forEach((song) => {
      const isLocked = localStorage.getItem(`event_${song.id}_locked`) !== 'false';
      song.isLocked = isLocked;
    });

    checkCompletedSongs();
  }, [tier10Songs, tier11Songs, checkCompletedSongs]);

  const handleSongClick = (song: Song) => {
    if (song.isLocked) return;
    const isCompleted = localStorage.getItem(`event_${song.id}_completed`) === 'true';
    if (isCompleted) return;
    setSelectedSong(song);
  };

  const handleSongComplete = (songId: string) => {
    onSongComplete(songId);
    localStorage.setItem(`event_${songId}_completed`, 'true');

    // Special handling for song progression after 10-2
    if (songId === '10-2') {
      // Skip remaining tier 10 songs and mark them as completed
      localStorage.setItem('event_10-2_completed', 'true');
      localStorage.setItem('event_10-3_completed', 'true');
      localStorage.setItem('event_10-4_completed', 'true');
      
      // Move to tier 11
      setCurrentTier('11');
      
      // Unlock only the first tier 11 song
      tier11Songs[0].isLocked = false;
      localStorage.setItem('event_11-1_locked', 'false');
    } else if (songId === '10-1') {
      tier10Songs[1].isLocked = false;
      localStorage.setItem('event_10-2_locked', 'false');
    } else if (songId === '11-1') {
      tier11Songs[1].isLocked = false;
      localStorage.setItem('event_11-2_locked', 'false');
    } else if (songId === '11-2') {
      tier11Songs[2].isLocked = false;
      localStorage.setItem('event_11-3_locked', 'false');
    }

    // Force re-render to update UI
    setSelectedSong(null);
    forceUpdate({});
  };

  const handleReset = useCallback(() => {
    // Reset localStorage
    localStorage.removeItem('event_10-1_completed');
    localStorage.removeItem('event_10-2_completed');
    localStorage.removeItem('event_10-3_completed');
    localStorage.removeItem('event_10-4_completed');
    localStorage.removeItem('event_11-1_completed');
    localStorage.removeItem('event_11-2_completed');
    localStorage.removeItem('event_11-3_completed');

    // Reset locked status in localStorage
    localStorage.removeItem('event_10-2_locked');
    localStorage.removeItem('event_10-3_locked');
    localStorage.removeItem('event_10-4_locked');
    localStorage.removeItem('event_11-1_locked');
    localStorage.removeItem('event_11-2_locked');
    localStorage.removeItem('event_11-3_locked');

    // Reset current tier in localStorage
    localStorage.removeItem('event_current_tier');

    // Reset locked status
    tier10Songs.forEach((song, index) => {
      if (index > 0) song.isLocked = true;
    });
    tier11Songs.forEach(song => {
      song.isLocked = true;
    });

    // Reset to tier 10
    setCurrentTier('10');
    
    // Force re-render
    setSelectedSong(null);
    forceUpdate({});
  }, [tier10Songs, tier11Songs]);

  const handleClose = () => {
    onClose();
    navigate('/mai-chart');
  };

  return (
    <>
      <div className={`event-horizon-modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-header">
          <button className="reset-button" onClick={handleReset}>Reset Progress</button>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="cards-container">
          <div className={`tier-${currentTier}`}>
            {currentTier === '10' ? (
              tier10Songs.map((song) => {
                const isCompleted = localStorage.getItem(`event_${song.id}_completed`) === 'true';
                return (
                  <div
                    key={song.id}
                    className={`event-song-card ${song.isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => !song.isLocked && handleSongClick(song)}
                  >
                    <img src={song.image} alt={song.name} />
                    <h3>{song.name}</h3>
                    <div className="level">Lv.{song.level}</div>
                    {isCompleted && <div className="completed-overlay">Completed</div>}
                  </div>
                );
              })
            ) : (
              tier11Songs.map((song) => {
                const isCompleted = localStorage.getItem(`event_${song.id}_completed`) === 'true';
                return (
                  <div
                    key={song.id}
                    className={`event-song-card ${song.isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => !song.isLocked && handleSongClick(song)}
                  >
                    <img src={song.image} alt={song.name} />
                    <h3>{song.name}</h3>
                    <div className="level">Lv.{song.level}</div>
                    {isCompleted && <div className="completed-overlay">Completed</div>}
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="black-hole"></div>
      </div>

      {selectedSong && (
        <SongDetailModal
          song={selectedSong}
          isOpen={true}
          onClose={() => setSelectedSong(null)}
          onComplete={handleSongComplete}
        />
      )}
    </>
  );
};

export default EventHorizonModal; 