import React, { useState } from 'react';
import '../styles/WorldMap.css';

interface MapLocation {
  id: number;
  name: string;
  x: number;
  y: number;
  level: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  imageUrl: string;
  downloadUrl: string;
}

const WorldMap: React.FC = () => {
  const initialLocations: MapLocation[] = [
    { 
      id: 1, 
      name: 'Song1', 
      x: 10, 
      y: 50, 
      level: 1, 
      isUnlocked: true, 
      isCurrent: true,
      imageUrl: '/songs/song1.jpg',
      downloadUrl: '/downloads/song1.zip'
    },
    { 
      id: 2, 
      name: 'Song2', 
      x: 30, 
      y: 50, 
      level: 2, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: '/songs/song2.jpg',
      downloadUrl: '/downloads/song2.zip'
    },
    { 
      id: 3, 
      name: 'Song3', 
      x: 50, 
      y: 50, 
      level: 3, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: '/songs/song3.jpg',
      downloadUrl: '/downloads/song3.zip'
    },
    { 
      id: 4, 
      name: 'Song4', 
      x: 70, 
      y: 50, 
      level: 4, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: '/songs/song4.jpg',
      downloadUrl: '/downloads/song4.zip'
    },
    { 
      id: 5, 
      name: 'Song5', 
      x: 90, 
      y: 50, 
      level: 5, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: '/songs/song5.jpg',
      downloadUrl: '/downloads/song5.zip'
    },
  ];

  const [locations, setLocations] = useState<MapLocation[]>(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const handleLocationClick = (location: MapLocation) => {
    if (location.isUnlocked) {
      setSelectedLocation(location);
    }
  };

  const handleComplete = () => {
    if (selectedLocation) {
      setLocations(prevLocations => {
        return prevLocations.map(loc => {
          if (loc.id === selectedLocation.id) {
            return { ...loc, isCurrent: false };
          } else if (loc.id === selectedLocation.id + 1) {
            return { ...loc, isUnlocked: true, isCurrent: true };
          }
          return loc;
        });
      });
      setSelectedLocation(null);
    }
  };

  const handleDownload = (downloadUrl: string) => {
    // Here you would implement the actual download logic
    window.open(downloadUrl, '_blank');
  };

  const handleResetJourney = () => {
    setLocations(initialLocations);
    setSelectedLocation(null);
  };

  return (
    <div className="world-map-container">
      <div className="world-map">
        <div className="map-background">
          <div className="map-grid">
            {/* Connection lines */}
            {locations.map((location, index) => {
              if (index < locations.length - 1) {
                const nextLocation = locations[index + 1];
                return (
                  <div
                    key={`line-${location.id}`}
                    className={`connection-line ${location.isUnlocked && nextLocation.isUnlocked ? 'unlocked' : 'locked'}`}
                    style={{
                      left: `${location.x}%`,
                      top: `${location.y}%`,
                      width: `${nextLocation.x - location.x}%`,
                    }}
                  />
                );
              }
              return null;
            })}
            
            {/* Locations */}
            {locations.map((location) => (
              <div
                key={location.id}
                className={`location ${location.isUnlocked ? 'unlocked' : 'locked'} ${location.isCurrent ? 'current' : ''}`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                }}
                onClick={() => handleLocationClick(location)}
              >
                <div className="location-marker">
                  <div className="location-level">Lv.{location.level}</div>
                  <div className="location-name">{location.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-controls">
        <button className="reset-button" onClick={handleResetJourney}>
          Reset Journey
        </button>
      </div>

      {selectedLocation && (
        <div className="location-details">
          <div className="location-image">
            <img src={selectedLocation.imageUrl} alt={selectedLocation.name} />
          </div>
          <h2>{selectedLocation.name}</h2>
          <div className="location-info">
            <p>Level: {selectedLocation.level}</p>
            <p>Status: {selectedLocation.isUnlocked ? 'Unlocked' : 'Locked'}</p>
          </div>
          <div className="button-group">
            <button 
              className="download-button" 
              onClick={() => handleDownload(selectedLocation.downloadUrl)}
            >
              Download
            </button>
            <button 
              className="complete-button" 
              onClick={handleComplete}
            >
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
