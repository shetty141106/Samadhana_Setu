import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLES } from '../../utils/constants';
import { SamadhanLogo } from '../common/Emblem';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Search, Menu, X, UserRound } from 'lucide-react';

export const Topbar = ({ isLanding = false, onNavigate, activeNav = 'landing', sidebarOpen, setSidebarOpen }) => {
  const { currentUser, currentRole, isAuthenticated } = useAuth();
  const { issues, projects } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const issueResults = (issues || []).filter(i => [i.title, i.description, i.district, i.locationName, i.categoryLabel, i.submittedBy, i.assignedUniversity].some(v => String(v || '').toLowerCase().includes(q))).slice(0, 5).map(i => ({ type:'Issue', id:i.id, title:i.title, meta:i.district || i.categoryLabel }));
    const projectResults = (projects || []).filter(p => [p.title, p.university, p.department, p.facultyMentor, p.studentLead, ...(p.teamMembers || []).map(m => m.name)].some(v => String(v || '').toLowerCase().includes(q))).slice(0, 5).map(p => ({ type:'Project', id:p.id, title:p.title, meta:p.university || p.department }));
    return [...issueResults, ...projectResults].slice(0, 8);
  }, [searchQuery, issues, projects]);

  const openResult = type => {
    const target = type === 'Issue'
      ? ({ [ROLES.CITIZEN]:'my-issues', [ROLES.NODAL]:'verify-issues', [ROLES.ADMIN]:'heatmaps' }[currentRole] || 'admin')
      : ({ [ROLES.FACULTY]:'mentored-projects', [ROLES.STUDENT]:'kanban', [ROLES.INDUSTRY]:'browse-projects', [ROLES.ADMIN]:'admin', [ROLES.NODAL]:'assigned-issues', [ROLES.CITIZEN]:'citizen' }[currentRole] || currentRole);
    setSearchQuery(''); onNavigate && onNavigate(target);
  };

  return <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-jh-earth-200/90 shadow-xs"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16 md:h-18">
    <div className="flex items-center gap-3 md:gap-6">{!isLanding && <button onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-lg text-jh-green-900 hover:bg-jh-earth-100" aria-label="Toggle Navigation">{sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>}<button onClick={() => onNavigate && onNavigate('landing')} className="text-left focus:outline-none" aria-label="Samadhan Setu home"><SamadhanLogo size="md" /></button></div>
    {isLanding ? <div className="hidden lg:flex items-center gap-1 xl:gap-2"><button onClick={() => onNavigate && onNavigate('landing')} className="px-3 py-1.5 text-sm font-semibold">Home</button><a href="#how-it-works" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800">How It Works</a><a href="#initiatives" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800">Key Focus Areas</a><a href="#universities" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800">For Universities</a><a href="#industry" className="px-3 py-1.5 text-sm font-semibold text-jh-earth-800">For Industry & CSR</a></div> : <div className="hidden md:block flex-1 max-w-md mx-6 relative"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input type="search" placeholder="Search issues, projects, districts, or researchers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setSearchQuery(''); }} className="w-full pl-9 pr-4 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700/50 focus:bg-white text-jh-charcoal" aria-label="Search platform" />{searchQuery.trim() && <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-jh-earth-200 rounded-xl shadow-lg overflow-hidden z-50">{results.length ? results.map(r => <button key={`${r.type}-${r.id}`} type="button" onClick={() => openResult(r.type)} className="w-full text-left px-3 py-2.5 hover:bg-jh-earth-50 border-b last:border-b-0"><div className="text-[10px] uppercase font-bold text-jh-green-800">{r.type}</div><div className="text-xs font-semibold text-jh-charcoal truncate">{r.title}</div><div className="text-[10px] text-jh-earth-500 truncate">{r.meta}</div></button>) : <div className="px-3 py-4 text-xs text-jh-earth-500">No matching live records found.</div>}</div>}</div></div>}
    <div className="flex items-center gap-2 sm:gap-3">{!isLanding && isAuthenticated && <NotificationDropdown />}{isLanding ? <div className="flex items-center gap-2"><button onClick={() => onNavigate && onNavigate('login')} className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-jh-green-900">Login</button><button onClick={() => onNavigate && onNavigate('login')} className="px-4 py-2 text-xs sm:text-sm font-bold bg-jh-green-900 text-white rounded-xl">Enter Portal</button></div> : <button onClick={() => onNavigate && onNavigate('profile')} className="flex items-center justify-center w-9 h-9 rounded-xl bg-jh-green-100 text-jh-green-900 border border-jh-green-800/20" title="View Profile" aria-label="Open profile"><UserRound className="w-5 h-5" /></button>}</div>
  </div></div></nav>;
};
