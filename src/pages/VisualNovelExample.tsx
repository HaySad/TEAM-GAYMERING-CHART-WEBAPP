import React from 'react';
import { useNavigate } from 'react-router-dom';
import VisualNovel from '../components/VisualNovel';

const VisualNovelExample: React.FC = () => {
  const navigate = useNavigate();
  const [storyData, setStoryData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    // โหลดข้อมูลเรื่อง
    fetch('/Episode1-Liftoff-to-the-sky.json')
      .then(res => res.json())
      .then(data => {
        setStoryData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('ไม่สามารถโหลดข้อมูลเรื่องได้: ' + err.message);
        setLoading(false);
      });
  }, []);

  const handleComplete = () => {
    alert('จบเรื่องแล้ว! กลับไปหน้าหลัก');
    navigate('/');
  };

  const handleSceneChange = (sceneId: string) => {
    console.log('Scene changed to:', sceneId);
    // สามารถใช้สำหรับ analytics หรือ achievements
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)',
        color: 'white'
      }}>
        <div>กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)',
        color: 'white'
      }}>
        <div>
          <h2>เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>กลับหน้าหลัก</button>
        </div>
      </div>
    );
  }

  return (
    <VisualNovel
      scenes={storyData}
      startSceneId="start"
      onComplete={handleComplete}
      onSceneChange={handleSceneChange}
      enableSaveLoad={true}
      storyId="example_story"
      className="example-story"
    />
  );
};

export default VisualNovelExample;
