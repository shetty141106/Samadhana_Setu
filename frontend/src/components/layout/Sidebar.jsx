import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { 
  LayoutDashboard, 
  FilePlus2, 
  ListOrdered, 
  Map, 
  ShieldCheck, 
  GraduationCap, 
  KanbanSquare, 
  CheckSquare, 
  Users, 
  Briefcase, 
  Building2, 
  Coins, 
  BarChart3, 
  UserCog, 
  Sliders, 
  User, 
  Bell, 
  Home,
  Award,
  Globe2,
  FileCheck2
} from 'lucide-react';

export const Sidebar = ({ 
  currentPath, 
  onNavigate, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { currentRole, currentUser, roleConfig } = useAuth();

  const getNavItems = () => {
    switch (currentRole) {
      case ROLES.CITIZEN:
        return [
          { id: 'citizen', label: 'Overview', icon: LayoutDashboard },
          { id: 'report-issue', label: 'Report New Issue', icon: FilePlus2, highlight: true },
          { id: 'my-issues', label: 'My Submissions', icon: ListOrdered },
          { id: 'issue-map', label: 'Jharkhand Issue Map', icon: Map },
          { id: 'profile', label: 'My Profile', icon: User }
        ];

      case ROLES.NODAL:
        return [
          { id: 'nodal', label: 'Verification Desk', icon: LayoutDashboard },
          { id: 'verify-issues', label: 'Pending Verification', icon: ShieldCheck, badge: '8' },
          { id: 'area-map', label: 'District GIS Map', icon: Map },
          { id: 'assigned-issues', label: 'Assigned to R&D', icon: FileCheck2 },
          { id: 'profile', label: 'Officer Profile', icon: User }
        ];

      case ROLES.FACULTY:
        return [
          { id: 'faculty', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'mentored-projects', label: 'Mentored Projects', icon: GraduationCap },
          { id: 'milestone-approvals', label: 'Milestone Approvals', icon: Award, badge: '2' },
          { id: 'csr-connect', label: 'Industry & CSR Grants', icon: Coins },
          { id: 'profile', label: 'Faculty Profile', icon: User }
        ];

      case ROLES.STUDENT:
        return [
          { id: 'student', label: 'Lab Dashboard', icon: LayoutDashboard },
          { id: 'kanban', label: 'R&D Kanban Board', icon: KanbanSquare, highlight: true },
          { id: 'my-tasks', label: 'My Sprint Tasks', icon: CheckSquare },
          { id: 'team-roster', label: 'Research Team', icon: Users },
          { id: 'profile', label: 'Student Profile', icon: User }
        ];

      case ROLES.INDUSTRY:
        return [
          { id: 'industry', label: 'CSR Command Desk', icon: LayoutDashboard },
          { id: 'browse-projects', label: 'Browse R&D Projects', icon: Building2 },
          { id: 'my-sponsorships', label: 'Active CSR Grants', icon: Coins },
          { id: 'csr-impact', label: 'ESG Impact Analytics', icon: BarChart3 },
          { id: 'profile', label: 'Corporate Profile', icon: User }
        ];

      case ROLES.ADMIN:
        return [
          { id: 'admin', label: 'State Overview', icon: LayoutDashboard },
          { id: 'heatmaps', label: 'GIS Heatmap Analytics', icon: Globe2 },
          { id: 'user-management', label: 'User & Role Directory', icon: UserCog },
          { id: 'system-metrics', label: 'Platform Performance', icon: BarChart3 },
          { id: 'profile', label: 'Admin Profile', icon: User }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    onNavigate(id);
    if (setSidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed md:sticky top-16 md:top-18 left-0 z-30 h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] w-64 bg-jh-earth-50 border-r border-jh-earth-200 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* User Persona Card */}
        <div className="p-4 border-b border-jh-earth-200 bg-white/70">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-jh-green-800/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-jh-green-950 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-jh-earth-600 truncate">{currentUser.title || roleConfig.portalTitle}</p>
              <span className={`inline-block mt-1 text-[9.5px] font-bold px-2 py-0.2 rounded-full border ${roleConfig.badgeColor}`}>
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-jh-earth-500">
            {roleConfig.portalTitle}
          </div>

          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-jh-green-900 text-white shadow-xs'
                    : item.highlight
                    ? 'bg-jh-terracotta-100/70 text-jh-terracotta-800 hover:bg-jh-terracotta-200/80 border border-jh-terracotta-300/60'
                    : 'text-jh-charcoal hover:bg-jh-earth-200/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-jh-terracotta-600' : 'text-jh-green-800'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-jh-green-900' : 'bg-jh-terracotta-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Switch to Public Landing */}
        <div className="p-3 border-t border-jh-earth-200 bg-white/50">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-jh-green-900 bg-jh-green-100/60 hover:bg-jh-green-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Public Landing Page</span>
          </button>
        </div>

      </aside>
    </>
  );
};
