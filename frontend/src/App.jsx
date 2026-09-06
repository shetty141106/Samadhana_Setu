import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/landing/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { NodalDashboard } from './pages/nodal/NodalDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/shared/ProfilePage';
import { ROLES } from './utils/constants';

const ROLE_PATHS = Object.values(ROLES);
const PUBLIC_PATHS = ['landing', 'login', 'register', 'universities', 'how-it-works'];

const readHashPath = () => {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return raw || 'landing';
};

function MainAppContent() {
  const { currentRole, isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(readHashPath);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(readHashPath());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (currentPath === 'landing' || currentPath === 'login' || currentPath === 'register' || (ROLE_PATHS.includes(currentPath) && currentPath !== currentRole)) {
        setCurrentPath(currentRole);
        window.history.replaceState(null, '', `#${currentRole}`);
      }
    } else if (currentPath === 'profile' || ROLE_PATHS.includes(currentPath)) {
      setCurrentPath('login');
      window.history.replaceState(null, '', '#login');
    }
  }, [isAuthenticated, currentRole, currentPath]);

  const navigate = (path) => {
    if (!path) return;
    if (isAuthenticated && ROLE_PATHS.includes(path) && path !== currentRole) {
      setCurrentPath(currentRole);
      window.history.replaceState(null, '', `#${currentRole}`);
      return;
    }
    if (!isAuthenticated && (path === 'profile' || ROLE_PATHS.includes(path))) {
      setCurrentPath('login');
      window.history.replaceState(null, '', '#login');
      return;
    }
    setCurrentPath(path);
    window.history.pushState(null, '', `#${path}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const renderCurrentView = () => {
    if (PUBLIC_PATHS.includes(currentPath)) {
      if (currentPath === 'login') return <Login onNavigate={navigate} />;
      if (currentPath === 'register') return <Register onNavigate={navigate} />;
      return <LandingPage onNavigate={navigate} initialSection={currentPath} />;
    }
    if (currentPath === 'profile') return <ProfilePage onNavigate={navigate} />;

    switch (currentRole) {
      case ROLES.CITIZEN: return <CitizenDashboard currentPath={currentPath} onNavigate={navigate} />;
      case ROLES.NODAL: return <NodalDashboard currentPath={currentPath} onNavigate={navigate} />;
      case ROLES.FACULTY: return <FacultyDashboard currentPath={currentPath} onNavigate={navigate} />;
      case ROLES.STUDENT: return <StudentDashboard currentPath={currentPath} onNavigate={navigate} />;
      case ROLES.INDUSTRY: return <IndustryDashboard currentPath={currentPath} onNavigate={navigate} />;
      case ROLES.ADMIN: return <AdminDashboard currentPath={currentPath} onNavigate={navigate} />;
      default: return <LandingPage onNavigate={navigate} />;
    }
  };

  const isLandingView = PUBLIC_PATHS.includes(currentPath) && !isAuthenticated;

  return (
    <AppShell currentPath={currentPath} onNavigate={navigate} isLanding={isLandingView}>
      {renderCurrentView()}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
