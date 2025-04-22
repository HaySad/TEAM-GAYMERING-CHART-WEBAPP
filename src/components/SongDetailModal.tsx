import React, { useEffect, useState } from 'react';
import '../styles/SongDetailModal.css';

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
  lifeSystem?: {
    maxLife: number;
    great: number;
    good: number;
    miss: number;
  };
}

interface SongDetailModalProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (songId: string) => void;
}

const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [videoEnded, setVideoEnded] = useState(false);

  const handleDownload = () => {
    window.open(song.downloadUrl, '_blank');
  };

  const handleComplete = () => {
    onComplete(song.id);
    onClose();
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Auto complete the song when video ends
    if (song.id === '10-2') {
      handleComplete();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setVideoEnded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="song-detail-modal-overlay">
      <div className="song-detail-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        {song.id === '10-2' && !videoEnded ? (
          <div className="video-container">
            {song.videoUrl?.includes('youtube.com') || song.videoUrl?.includes('youtu.be') ? (
              <>
                <iframe
                  src={song.videoUrl.replace('watch?v=', 'embed/')}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="full-video"
                />
                <div className="video-actions">
                  <button className="complete-button" onClick={handleComplete}>
                    Mark as Completed
                  </button>
                </div>
              </>
            ) : (
              <video
                src={song.videoUrl || '/videos/event-horizon.mp4'}
                autoPlay
                controls={false}
                onEnded={handleVideoEnd}
                className="full-video"
              />
            )}
          </div>
        ) : (
          <>
            <div className="song-image">
              <img src={song.image} alt={song.name} />
            </div>
            
            <div className="song-info">
              <h2>{song.name}</h2>
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="label">Level</span>
                  <span className="value">{song.level.toFixed(1)}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Artist</span>
                  <span className="value">{song.artist}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Chart Designer</span>
                  <span className="value">{song.chartDesigner}</span>
                </div>
              </div>

              {song.lifeSystem && (
                <div className="life-system">
                  <div className="life-item">
                    <span className="life-icon">❤️</span>
                    <span>Max Life: {song.lifeSystem.maxLife}</span>
                  </div>
                  <div className="life-item">
                    <span className="life-icon">❤️</span>
                    <span>Great: -{song.lifeSystem.great}</span>
                  </div>
                  <div className="life-item">
                    <span className="life-icon">❤️</span>
                    <span>Good: -{song.lifeSystem.good}</span>
                  </div>
                  <div className="life-item">
                    <span className="life-icon">❤️</span>
                    <span>Miss: -{song.lifeSystem.miss}</span>
                  </div>
                </div>
              )}

              <div className="actions">
                <button className="download-button" onClick={handleDownload}>
                  Download Chart
                </button>
                <button className="complete-button" onClick={handleComplete}>
                  Mark as Completed
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SongDetailModal; 