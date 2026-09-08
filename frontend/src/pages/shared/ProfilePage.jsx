import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Mail, Building, LogOut, UserRound } from 'lucide-react';

export const ProfilePage = ({ onNavigate }) => {
  const { currentUser, roleConfig, logout } = useAuth();
  const handleSignOut = () => { logout(); onNavigate('landing'); };
  return <div className="max-w-4xl mx-auto space-y-6"><div className="bg-white rounded-3xl border border-jh-earth-200 shadow-jh-soft overflow-hidden">
    <div className="h-40 bg-gradient-to-r from-jh-green-900 via-jh-green-800 to-jh-terracotta-700 relative"><div className="absolute top-4 right-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleConfig?.badgeColor || ''} bg-white shadow-xs`}>{roleConfig?.label || 'User'} Access</span></div></div>
    <div className="px-6 sm:px-8 pb-8 relative"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6"><div className="flex items-end gap-4"><div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-jh-green-100 text-jh-green-900 grid place-items-center"><UserRound className="w-10 h-10" /></div><div className="mb-2"><h2 className="text-xl sm:text-2xl font-bold text-jh-green-950">{currentUser?.name || 'User'}</h2><p className="text-xs text-jh-earth-600 font-medium">{roleConfig?.portalTitle || 'Samadhan Setu Portal'}</p></div></div><Button variant="outline" size="sm" icon={LogOut} onClick={handleSignOut}>Sign Out</Button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-jh-earth-200"><div className="flex items-center gap-3 p-3 bg-jh-earth-50 rounded-xl"><Mail className="w-4 h-4 text-jh-green-800" /><div><span className="text-jh-earth-500 block text-[10px] uppercase font-bold">Email Address</span><span className="font-bold text-jh-charcoal">{currentUser?.email || 'Not provided'}</span></div></div><div className="flex items-center gap-3 p-3 bg-jh-earth-50 rounded-xl"><Building className="w-4 h-4 text-jh-terracotta-600" /><div><span className="text-jh-earth-500 block text-[10px] uppercase font-bold">Affiliation</span><span className="font-bold text-jh-charcoal">{currentUser?.organization || currentUser?.university || currentUser?.department || 'Not provided'}</span></div></div></div>
    </div></div></div>;
};
