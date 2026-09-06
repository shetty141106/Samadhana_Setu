import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SamadhanLogo } from '../common/Emblem';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Search, Menu, X } from 'lucide-react';

export const Topbar = ({
  isLanding = false,
  onNavigate,
  activeNav = 'landing',
  sidebarOpen,
  setSidebarOpen
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-jh-earth-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <div className="flex items-center gap-3 md:gap-6">
            {!isLanding && (
              <button
                onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg text-jh-green-900 hover:bg-jh-earth-100 transition-colors"
                aria-label="Toggle Navigation"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={() => onNavigate && onNavigate('landing')}
              className="text-left focus:outline-none group transition-transform active:scale-[0.99]"
              aria-label="Samadhan Setu home"
            >
              <SamadhanLogo size="md" />
            </button>
          </div>

          {isLanding ? (
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button onClick={() => onNavigate && onNavigate('landing')} className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeNav === 'landing' ? 'text-jh-green-900 bg-jh-green-100/50' : 'text-jh-earth-800 hover:text-jh-green-900'}`}>Home</button>
              <a href="#how-it-works" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors">How It Works</a>
              <a href="#initiatives" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors">Key Focus Areas</a>
              <a href="#universities" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors">For Universities</a>
              <a href="#industry" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors">For Industry & CSR</a>
            </div>
          ) : (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
                <input type="search" placeholder="Search issues, projects, districts, or researchers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700/50 focus:bg-white text-jh-charcoal transition-all placeholder:text-jh-earth-400" aria-label="Search platform" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {!isLanding && isAuthenticated && <NotificationDropdown />}
            {isLanding ? (
              <div className="flex items-center gap-2">
                <button onClick={() => onNavigate && onNavigate('login')} className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-jh-green-900 hover:text-jh-terracotta-700 transition-colors">Login</button>
                <button onClick={() => onNavigate && onNavigate('login')} className="px-4 py-2 text-xs sm:text-sm font-bold bg-jh-green-900 text-jh-earth-50 hover:bg-jh-green-800 rounded-xl shadow-xs transition-all active:scale-[0.98]">Enter Portal</button>
              </div>
            ) : (
              <button onClick={() => onNavigate && onNavigate('profile')} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-jh-earth-100 transition-colors" title="View Profile" aria-label="Open profile">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-xl object-cover border border-jh-green-800/30" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
