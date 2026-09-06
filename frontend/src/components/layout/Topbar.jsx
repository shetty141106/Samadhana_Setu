import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_CONFIGS } from '../../utils/constants';
import { SamadhanLogo, JharkhandGovBadge } from '../common/Emblem';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { 
  UserCircle, 
  ChevronDown, 
  Sparkles, 
  Search, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin
} from 'lucide-react';

export const Topbar = ({ 
  isLanding = false, 
  onNavigate, 
  activeNav = 'landing',
  sidebarOpen,
  setSidebarOpen 
}) => {
  const { currentRole, currentUser, roleConfig, switchRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const roleMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case ROLES.CITIZEN: return UserCircle;
      case ROLES.NODAL: return ShieldCheck;
      case ROLES.FACULTY: return GraduationCap;
      case ROLES.STUDENT: return Layers;
      case ROLES.INDUSTRY: return Building;
      case ROLES.ADMIN: return Briefcase;
      default: return UserCircle;
    }
  };

  const handleRoleSelect = (newRole) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
    if (onNavigate) {
      onNavigate(ROLE_CONFIGS[newRole].id);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-jh-earth-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Left: Mobile Menu Trigger & Logo */}
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
            >
              <SamadhanLogo size="md" />
            </button>
          </div>

          {/* Center (Landing Nav Links or Global Search) */}
          {isLanding ? (
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={() => onNavigate && onNavigate('landing')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                  activeNav === 'landing' ? 'text-jh-green-900 bg-jh-green-100/50' : 'text-jh-earth-800 hover:text-jh-green-900'
                }`}
              >
                Home
              </button>
              <a
                href="#how-it-works"
                className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors"
              >
                How It Works
              </a>
              <a
                href="#initiatives"
                className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors"
              >
                Key Focus Areas
              </a>
              <a
                href="#universities"
                className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors"
              >
                For Universities
              </a>
              <a
                href="#industry"
                className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800 hover:text-jh-green-900 rounded-lg transition-colors"
              >
                For Industry & CSR
              </a>
            </div>
          ) : (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
                <input
                  type="text"
                  placeholder="Search issues, projects, districts, or researchers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700/50 focus:bg-white text-jh-charcoal transition-all placeholder:text-jh-earth-400"
                />
              </div>
            </div>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Persona Fast-Switcher (Demonstrates all 6 roles instantly) */}
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-jh-green-800/30 bg-jh-green-50/80 hover:bg-jh-green-100 transition-all text-xs font-semibold text-jh-green-950 shadow-2xs"
                title="Switch User Role to test different dashboards"
              >
                <div className="w-2 h-2 rounded-full bg-jh-terracotta-500 animate-ping"></div>
                <span className="hidden sm:inline text-jh-earth-700 font-normal">Role:</span>
                <span className="font-bold text-jh-green-900">{roleConfig.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-jh-green-800 ml-0.5" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-jh-earth-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-jh-earth-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-jh-earth-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-jh-terracotta-500" />
                      Role-Based View Switcher
                    </p>
                    <p className="text-[10.5px] text-jh-earth-500">Instant switch to explore all 6 dashboard personas</p>
                  </div>

                  <div className="space-y-1">
                    {Object.values(ROLES).map((roleKey) => {
                      const cfg = ROLE_CONFIGS[roleKey];
                      const Icon = getRoleIcon(roleKey);
                      const isSelected = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => handleRoleSelect(roleKey)}
                          className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${
                            isSelected
                              ? 'bg-jh-green-900 text-white shadow-xs font-semibold'
                              : 'hover:bg-jh-earth-100 text-jh-charcoal'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-jh-earth-200 text-jh-green-900'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold leading-tight truncate">{cfg.label}</div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-jh-earth-200' : 'text-jh-earth-600'}`}>
                              {cfg.portalTitle}
                            </div>
                          </div>
                          {isSelected && <span className="text-xs font-bold text-jh-gold-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications (When not on landing) */}
            {!isLanding && <NotificationDropdown />}

            {/* Login / Launch Portal CTA */}
            {isLanding ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-jh-green-900 hover:text-jh-terracotta-700 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate && onNavigate(roleConfig.id)}
                  className="px-4 py-2 text-xs sm:text-sm font-bold bg-jh-green-900 text-jh-earth-50 hover:bg-jh-green-800 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                >
                  Enter Portal
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-jh-earth-100 transition-colors"
                title="View Profile"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-jh-green-800/30"
                />
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};
