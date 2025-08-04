import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthButton from './components/AuthButton';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import ScoreSubmission from './pages/ScoreSubmission';
import MainPage from './MainPage';
import MaiChart from './MaiChart';
import SongDetail from './pages/SongDetail';
import EventHorizon from './pages/EventHorizon';
import WorldMap from './components/WorldMap';
import HigurashiDan from './pages/HigurashiDan';
import SolarSystem from './pages/SolarSystem';
import './App.css';

// Loading component
const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    ⏳ กำลังโหลด...
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AuthButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          !isLoggedIn ? <Login /> : <Navigate to="/" replace />
        } />
        <Route path="/signup" element={
          !isLoggedIn ? <Signup /> : <Navigate to="/" replace />
        } />
        
        {/* Protected Routes */}
        <Route path="/discord-competition-4" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        <Route path="/mai-chart" element={
          <ProtectedRoute>
            <MaiChart />
          </ProtectedRoute>
        } />
        <Route path="/song/:id" element={
          <ProtectedRoute>
            <SongDetail />
          </ProtectedRoute>
        } />
        <Route path="/event-horizon" element={
          <ProtectedRoute>
            <EventHorizon />
          </ProtectedRoute>
        } />
        <Route path="/world-map" element={
          <ProtectedRoute>
            <WorldMap />
          </ProtectedRoute>
        } />
        <Route path="/higurashi-dan" element={
          <ProtectedRoute>
            <HigurashiDan />
          </ProtectedRoute>
        } />
        <Route path="/solar-system" element={
          <ProtectedRoute>
            <SolarSystem />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/score-submission" element={
          <ProtectedRoute>
            <ScoreSubmission />
          </ProtectedRoute>
        } />
        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/mai-chart" replace />} />
        <Route path="*" element={<Navigate to="/mai-chart" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
