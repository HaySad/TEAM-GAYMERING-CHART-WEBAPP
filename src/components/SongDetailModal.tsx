import React from 'react';
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
  const handleDownload = () => {
    window.open(song.downloadUrl, '_blank');
  };

  const handleComplete = () => {
    onComplete(song.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="song-detail-modal-overlay">
      <div className="song-detail-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
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

          <div className="actions">
            <button className="download-button" onClick={handleDownload}>
              Download Chart
            </button>
            <button className="complete-button" onClick={handleComplete}>
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailModal; 