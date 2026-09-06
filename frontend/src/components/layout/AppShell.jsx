import React, { useState } from 'react';
import { GovtBanner } from './GovtBanner';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const AppShell = ({ 
  children, 
  currentPath, 
  onNavigate,
  isLanding = false 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-jh-earth-50 text-jh-charcoal selection:bg-jh-green-100 selection:text-jh-green-900">
      
      {/* 1. Official Govt Banner */}
      <GovtBanner />

      {/* 2. Top Navigation Bar */}
      <Topbar
        isLanding={isLanding}
        onNavigate={onNavigate}
        activeNav={currentPath}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 3. Main Workspace / Layout */}
      {isLanding ? (
        <main className="flex-1 w-full">
          {children}
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Sidebar */}
          <Sidebar
            currentPath={currentPath}
            onNavigate={onNavigate}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content View */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      )}

      {/* 4. Footer */}
      <Footer onNavigate={onNavigate} />

    </div>
  );
};
