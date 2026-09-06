import React, { useState } from 'react';
import { GovtBanner } from './GovtBanner';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useData } from '../../context/DataContext';

export const AppShell = ({ children, currentPath, onNavigate, isLanding = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dataLoading, dataError } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-jh-earth-50 text-jh-charcoal selection:bg-jh-green-100 selection:text-jh-green-900">
      <GovtBanner />
      <Topbar isLanding={isLanding} onNavigate={onNavigate} activeNav={currentPath} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!isLanding && dataError && <div role="alert" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-3"><div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900"><strong>Live data notice:</strong> {dataError}</div></div>}
      {dataLoading && <div className="h-0.5 w-full overflow-hidden bg-jh-earth-200" aria-label="Loading live platform data"><div className="h-full w-1/3 bg-jh-green-700 animate-pulse" /></div>}
      {isLanding ? <main className="flex-1 w-full">{children}</main> : <div className="flex-1 flex max-w-7xl w-full mx-auto"><Sidebar currentPath={currentPath} onNavigate={onNavigate} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /><main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main></div>}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
