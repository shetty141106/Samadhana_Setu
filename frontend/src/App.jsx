import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/landing/LandingPage';
import { Login } from './pages/auth/Login';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { NodalDashboard } from './pages/nodal/NodalDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/shared/ProfilePage';
import { ROLES } from './utils/constants';

function MainAppContent() {
  const { currentRole } = useAuth();
  const [currentPath, setCurrentPath] = useState('landing');

  const renderCurrentView = () => {
    // 1. Public Landing Page
    if (currentPath === 'landing') {
      return <LandingPage onNavigate={(path) => setCurrentPath(path)} />;
    }

    // 2. Login / Role Switch
    if (currentPath === 'login') {
      return <Login onNavigate={(path) => setCurrentPath(path)} />;
    }

    // 3. Shared Profile
    if (currentPath === 'profile') {
      return <ProfilePage onNavigate={(path) => setCurrentPath(path)} />;
    }

    // 4. Role Based Routing
    switch (currentRole) {
      case ROLES.CITIZEN:
        return <CitizenDashboard currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />;
      case ROLES.NODAL:
        return <NodalDashboard currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />;
      case ROLES.FACULTY:
        return <FacultyDashboard currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />;
      case ROLES.STUDENT:
        return <StudentDashboard currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />;
      case ROLES.INDUSTRY:
        return <IndustryDashboard currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />;
      case ROLES.ADMIN:
        return <AdminDashboard currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />;
      default:
        return <LandingPage onNavigate={(path) => setCurrentPath(path)} />;
    }
  };

  const isLandingView = currentPath === 'landing' || currentPath === 'login';

  return (
    <AppShell
      currentPath={currentPath}
      onNavigate={(path) => setCurrentPath(path)}
      isLanding={isLandingView}
    >
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
