import { useState, useEffect } from 'react';

interface DatabaseStatus {
  isConnected: boolean;
  isFallbackMode: boolean;
  message: string;
}

export const useDatabaseStatus = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    isConnected: false,
    isFallbackMode: false,
    message: 'Checking database status...'
  });
  const [loading, setLoading] = useState(true);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database-status');
      const data = await response.json();
      
      setStatus({
        isConnected: data.isConnected,
        isFallbackMode: data.isFallbackMode,
        message: data.message
      });
    } catch (error) {
      console.error('Failed to check database status:', error);
      setStatus({
        isConnected: false,
        isFallbackMode: true,
        message: 'ไม่สามารถตรวจสอบสถานะฐานข้อมูลได้'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();

    // ตรวจสอบสถานะทุก 30 วินาที
    const interval = setInterval(checkDatabaseStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    loading,
    refetch: checkDatabaseStatus
  };
};
