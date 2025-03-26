import React, { useState, useEffect } from 'react';
import EventHorizonModal from '../components/EventHorizonModal';
import '../styles/EventHorizon.css';

const EventHorizon: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSongComplete = (songId: string) => {
    console.log(`Song ${songId} completed`);
  };

  return (
    <div className="event-horizon-page">
      <div className="black-hole">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.5,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      <EventHorizonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSongComplete={handleSongComplete}
      />
    </div>
  );
};

export default EventHorizon; 