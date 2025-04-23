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
  artist: string;
  charter: string;
  lifeSystem: {
    maxLife: number;
    great: number;
    good: number;
    miss: number;
  };
}

const WorldMap: React.FC = () => {
  const initialLocations: MapLocation[] = [
    { 
      id: 1, 
      name: 'メクルメ', 
      x: 10, 
      y: 50, 
      level: 14.4, 
      isUnlocked: true, 
      isCurrent: true,
      imageUrl: 'songs/all/mekuru/bg.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1351K8EjwH38e8zeuawg4CWe7G-AExxlf',
      artist: '初星学園',
      charter: 'Happy VS H&S VS 8bit ft. The doop',
      lifeSystem: {
        maxLife: 200,
        great: 2,
        good: 3,
        miss: 5
      }
    },
    { 
      id: 2, 
      name: '甘神さんちの縁結び - 神様の言うとーり！', 
      x: 30, 
      y: 50, 
      level: 14.3, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: 'songs/3-4/bg.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1GTGl2dIaiu5O4Z5YABloIY2owImbzMCX',
      artist: '≠ME',
      charter: 'Levelast',
      lifeSystem: {
        maxLife: 200,
        great: 2,
        good: 3,
        miss: 5
      }
    },
    { 
      id: 3, 
      name: 'Pyrocrypt', 
      x: 50, 
      y: 50, 
      level: 14.9, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: 'songs/4-4/bg.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1bzNN3axn94OKXWsDXIjWlfEbyaaFePZp',
      artist: 'Ardolf',
      charter: 'RhoGaming vs Levelast',
      lifeSystem: {
        maxLife: 500,
        great: 2,
        good: 3,
        miss: 5
      }
    },
    { 
      id: 4, 
      name: 'SUPERNOVA', 
      x: 70, 
      y: 50, 
      level: 14.9, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: 'songs/5-4/bg.jpg',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1_mkivuAdyWRfaZsV4xTzj0YYVqC1Ynz6',
      artist: 'Kyotsugyon',
      charter: '8 bit',
      lifeSystem: {
        maxLife: 500,
        great: 2,
        good: 3,
        miss: 5
      }
    },
    { 
      id: 5, 
      name: 'Sincuvate', 
      x: 90, 
      y: 50, 
      level: 15, 
      isUnlocked: false, 
      isCurrent: false,
      imageUrl: 'songs/event/event-end.png',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1drOhp6q5E2ov3gxiK82B5TCLZpSwZqSt',
      artist: 'Endorfin. vs Feryquitous',
      charter: 'Levelast the NULL',
      lifeSystem: {
        maxLife: 500,
        great: 2,
        good: 3,
        miss: 5
      }
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
            
            {/* Player Avatar */}
            {locations.map((location) => {
              if (location.isCurrent) {
                return (
                  <div 
                    key={`player-${location.id}`}
                    className="worldmap-player-avatar"
                    style={{
                      left: `${location.x + 0.5}%`,
                      top: `${location.y - 11}%`,
                    }}
                  >
                    <img src="songs/1-2/bg.jpg" alt="" />
                  </div>
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
                  <div className="location-level">Lv.{location.isUnlocked ? location.level : '?'}</div>
                  <div className="location-name">{location.isUnlocked ? location.name : '???'}</div>
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
          <button className="worldmap-close-button" onClick={() => setSelectedLocation(null)}>✕</button>
          <div className="location-image">
            <img src={selectedLocation.imageUrl} alt={selectedLocation.name} />
          </div>
          <h2>{selectedLocation.isUnlocked ? selectedLocation.name : '???'}</h2>
          <div className="location-info">
            <p>Level: {selectedLocation.isUnlocked ? selectedLocation.level : '???'}</p>
            <p>Status: {selectedLocation.isUnlocked ? 'Unlocked' : 'Locked'}</p>
            <div className="creator-info">
              <p>Artist: {selectedLocation.isUnlocked ? selectedLocation.artist : '???'}</p>
              <p>Charter: {selectedLocation.isUnlocked ? selectedLocation.charter : '???'}</p>
            </div>
            {selectedLocation.isUnlocked && (
              <div className="life-system">
                <div className="life-item">
                  <span className="life-icon">❤️</span>
                  <span>Max Life: {selectedLocation.lifeSystem.maxLife}</span>
                </div>
                <div className="life-item">
                  <span className="life-icon">❤️</span>
                  <span>Great: -{selectedLocation.lifeSystem.great}</span>
                </div>
                <div className="life-item">
                  <span className="life-icon">❤️</span>
                  <span>Good: -{selectedLocation.lifeSystem.good}</span>
                </div>
                <div className="life-item">
                  <span className="life-icon">❤️</span>
                  <span>Miss: -{selectedLocation.lifeSystem.miss}</span>
                </div>
              </div>
            )}
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
