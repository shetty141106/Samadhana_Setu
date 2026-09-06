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

function MainAppContent() {
  const { currentRole, isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState('landing');

  useEffect(() => {
    if (isAuthenticated) {
      if (currentPath === 'landing' || currentPath === 'login' || currentPath === 'register' || (ROLE_PATHS.includes(currentPath) && currentPath !== currentRole)) {
        setCurrentPath(currentRole);
      }
    } else if (currentPath === 'profile' || ROLE_PATHS.includes(currentPath)) {
      setCurrentPath('login');
    }
  }, [isAuthenticated, currentRole, currentPath]);

  const navigate = (path) => {
    if (isAuthenticated && ROLE_PATHS.includes(path) && path !== currentRole) {
      setCurrentPath(currentRole);
      return;
    }
    if (!isAuthenticated && (path === 'profile' || ROLE_PATHS.includes(path))) {
      setCurrentPath('login');
      return;
    }
    setCurrentPath(path);
  };

  const renderCurrentView = () => {
    if (currentPath === 'landing') return <LandingPage onNavigate={navigate} />;
    if (currentPath === 'login') return <Login onNavigate={navigate} />;
    if (currentPath === 'register') return <Register onNavigate={navigate} />;
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

  const isLandingView = ['landing', 'login', 'register'].includes(currentPath) && !isAuthenticated;

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
