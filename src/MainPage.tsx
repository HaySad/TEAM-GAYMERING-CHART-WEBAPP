import React, { useState, useEffect } from 'react';

interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  downloadUrl: string;
}

interface TierData {
  level: number;
  life: number;
  minusX: number;
  minusY: number;
  minusZ: number;
  songs: Song[];
}

const MainPage: React.FC = () => {
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/tiers');
        if (!response.ok) {
          throw new Error('Failed to fetch tiers data');
        }
        const data = await response.json();
        setTiers(data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้ / Failed to load data');
        console.error('Error fetching tiers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const handleDownload = async (downloadUrl: string) => {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'song.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('ไม่สามารถดาวน์โหลดไฟล์ได้ / Download failed');
    }
  };

  if (loading) {
    return <div style={styles.loading}>กำลังโหลด... / Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>段位認定- Discord-Competition IV</h1>
      
      {tiers.map((tier) => (
        <div key={tier.level} style={styles.tierContainer}>
          <div style={styles.tierHeader}>
            <h2>Tier {tier.level}</h2>
            <div style={styles.tierSettings}>
              <span>Life: {tier.life}</span>
              <span>-Great : {tier.minusX}</span>
              <span>-Good : {tier.minusY}</span>
              <span>-Miss : {tier.minusZ}</span>
            </div>
          </div>
          
          <div style={styles.songsGrid}>
            {tier.songs.map((song) => (
              <div key={song.id} style={styles.songCard}>
                <img 
                  src={song.image} 
                  alt={song.name}
                  style={styles.songImage}
                  onClick={() => handleDownload(song.downloadUrl)}
                />
                <div style={styles.songInfo}>
                  <div>{song.name}</div>
                  <div>Level: {song.level.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  tierContainer: {
    marginBottom: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tierHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  tierSettings: {
    display: 'flex',
    gap: '1rem',
  },
  songsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  songCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  songImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover' as const,
    cursor: 'pointer',
  },
  songInfo: {
    padding: '0.5rem',
    textAlign: 'center' as const,
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#dc3545',
    fontSize: '1.2rem',
  },
};

export default MainPage; 