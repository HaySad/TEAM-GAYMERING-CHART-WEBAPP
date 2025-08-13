import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
//import { useNavigate } from 'react-router-dom';

interface ScoreData {
  songId: string;
  songTitle: string;
  artist: string;
  difficulty: string;
  level: string;
  score: number;
  rank: string;
  achievementRate: number;
  critical: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  early: number;
  late: number;
  dxScore: number;
  clearType: string;
}

const ScoreSubmission: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scoreData, setScoreData] = useState<ScoreData>({
    songId: '',
    songTitle: '',
    artist: '',
    difficulty: 'MASTER',
    level: '',
    score: 0,
    rank: '',
    achievementRate: 0,
    critical: 0,
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
    early: 0,
    late: 0,
    dxScore: 0,
    clearType: 'CLEAR'
  });

  const rankConstants: { [key: string]: number } = {
    'SSS+': 15.0,
    'SSS': 14.0,
    'SS+': 13.0,
    'SS': 12.0,
    'S+': 11.0,
    'S': 10.0,
    'AAA+': 9.0,
    'AAA': 8.0,
    'AA+': 7.0,
    'AA': 6.0,
    'A+': 5.0,
    'A': 4.0,
    'BBB+': 3.0,
    'BBB': 2.0,
    'BB+': 1.0,
    'BB': 0.0,
    'B+': -1.0,
    'B': -2.0,
    'C+': -3.0,
    'C': -4.0,
    'D+': -5.0,
    'D': -6.0,
    'F': -7.0
  };

  const calculateLevel = (levelInput: string): number => {
    if (levelInput.includes('+')) {
      const baseLevel = parseFloat(levelInput.replace('+', ''));
      return baseLevel + 0.7;
    }
    return parseFloat(levelInput);
  };

  const calculateRating = (): number => {
    const level = calculateLevel(scoreData.level);
    const rankConstant = rankConstants[scoreData.rank] || 0;
    const achievementRate = scoreData.achievementRate / 100; // Convert percentage to decimal
    
    return level * rankConstant * achievementRate;
  };

  const handleInputChange = (field: keyof ScoreData, value: string | number) => {
    setScoreData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scoreData.songId || !scoreData.level || !scoreData.rank) {
      setError('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const rating = calculateRating();
      
      const response = await fetch('/api/game-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          songId: scoreData.songId,
          songTitle: scoreData.songTitle,
          artist: scoreData.artist,
          difficulty: scoreData.difficulty,
          level: scoreData.level,
          score: scoreData.score,
          rank: scoreData.rank,
          achievementRate: scoreData.achievementRate,
          critical: scoreData.critical,
          perfect: scoreData.perfect,
          great: scoreData.great,
          good: scoreData.good,
          miss: scoreData.miss,
          early: scoreData.early,
          late: scoreData.late,
          dxScore: scoreData.dxScore,
          clearType: scoreData.clearType,
          calculatedRating: rating
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('ส่ง Score สำเร็จ! Rating จะถูกคำนวณโดย AI system');
        // Reset form
        setScoreData({
          songId: '',
          songTitle: '',
          artist: '',
          difficulty: 'MASTER',
          level: '',
          score: 0,
          rank: '',
          achievementRate: 0,
          critical: 0,
          perfect: 0,
          great: 0,
          good: 0,
          miss: 0,
          early: 0,
          late: 0,
          dxScore: 0,
          clearType: 'CLEAR'
        });
      } else {
        setError(data.error || 'ส่ง Score ไม่สำเร็จ');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const calculatedRating = calculateRating();

  return (
    <div style={styles.container}>
      <div style={styles.submissionBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎵 ส่ง Score</h2>
          <p style={styles.subtitle}>ส่งคะแนนเกมเพื่อคำนวณ Rating</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={styles.successMessage}>
              ✅ {success}
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📝 ข้อมูลเพลง</h3>
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Song ID</label>
                <input
                  type="text"
                  value={scoreData.songId}
                  onChange={(e) => handleInputChange('songId', e.target.value)}
                  placeholder="song_123"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ชื่อเพลง</label>
                <input
                  type="text"
                  value={scoreData.songTitle}
                  onChange={(e) => handleInputChange('songTitle', e.target.value)}
                  placeholder="神凪"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ศิลปิน</label>
                <input
                  type="text"
                  value={scoreData.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  placeholder="BlackY feat. Risa Yuzuki"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ความยาก</label>
                <select
                  value={scoreData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  style={styles.select}
                >
                  <option value="BASIC">BASIC</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="EXPERT">EXPERT</option>
                  <option value="MASTER">MASTER</option>
                  <option value="RE:MASTER">RE:MASTER</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Level</label>
                <input
                  type="text"
                  value={scoreData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  placeholder="15 หรือ 15+"
                  style={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📊 คะแนนและผลลัพธ์</h3>
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Score</label>
                <input
                  type="number"
                  value={scoreData.score}
                  onChange={(e) => handleInputChange('score', parseInt(e.target.value) || 0)}
                  placeholder="950000"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rank</label>
                <select
                  value={scoreData.rank}
                  onChange={(e) => handleInputChange('rank', e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">เลือก Rank</option>
                  {Object.keys(rankConstants).map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Achievement Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={scoreData.achievementRate}
                  onChange={(e) => handleInputChange('achievementRate', parseFloat(e.target.value) || 0)}
                  placeholder="98.37"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>DX Score</label>
                <input
                  type="number"
                  value={scoreData.dxScore}
                  onChange={(e) => handleInputChange('dxScore', parseInt(e.target.value) || 0)}
                  placeholder="3014"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎯 Hit Counts</h3>
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Critical</label>
                <input
                  type="number"
                  value={scoreData.critical}
                  onChange={(e) => handleInputChange('critical', parseInt(e.target.value) || 0)}
                  placeholder="757"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Perfect</label>
                <input
                  type="number"
                  value={scoreData.perfect}
                  onChange={(e) => handleInputChange('perfect', parseInt(e.target.value) || 0)}
                  placeholder="330"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Great</label>
                <input
                  type="number"
                  value={scoreData.great}
                  onChange={(e) => handleInputChange('great', parseInt(e.target.value) || 0)}
                  placeholder="83"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Good</label>
                <input
                  type="number"
                  value={scoreData.good}
                  onChange={(e) => handleInputChange('good', parseInt(e.target.value) || 0)}
                  placeholder="10"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Miss</label>
                <input
                  type="number"
                  value={scoreData.miss}
                  onChange={(e) => handleInputChange('miss', parseInt(e.target.value) || 0)}
                  placeholder="11"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Early</label>
                <input
                  type="number"
                  value={scoreData.early}
                  onChange={(e) => handleInputChange('early', parseInt(e.target.value) || 0)}
                  placeholder="50"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Late</label>
                <input
                  type="number"
                  value={scoreData.late}
                  onChange={(e) => handleInputChange('late', parseInt(e.target.value) || 0)}
                  placeholder="39"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.calculationBox}>
            <h3 style={styles.calculationTitle}>🧮 การคำนวณ Rating</h3>
            <div style={styles.calculationDetails}>
              <p><strong>Level:</strong> {scoreData.level} → {calculateLevel(scoreData.level)}</p>
              <p><strong>Rank Constant:</strong> {scoreData.rank} → {rankConstants[scoreData.rank] || 0}</p>
              <p><strong>Achievement Rate:</strong> {scoreData.achievementRate}% → {scoreData.achievementRate / 100}</p>
              <p><strong>สูตร:</strong> Level × Rank Constant × Achievement Rate</p>
              <p><strong>ผลลัพธ์:</strong> {calculatedRating.toFixed(4)}</p>
            </div>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? '⏳ กำลังส่ง Score...' : '🚀 ส่ง Score'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  submissionBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
  },
  header: {
    padding: '40px 30px 20px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9,
  },
  form: {
    padding: '30px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    color: '#333',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  calculationBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #e1e5e9',
  },
  calculationTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    color: '#333',
  },
  calculationDetails: {
    fontSize: '14px',
    lineHeight: '1.6',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fcc',
  },
  successMessage: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #cfc',
  },
};

export default ScoreSubmission; 