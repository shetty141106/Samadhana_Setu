import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_CONFIGS } from '../../utils/constants';
import { SamadhanLogo } from '../../components/common/Emblem';
import { Button } from '../../components/ui/Button';
import { UserCircle, ShieldCheck, GraduationCap, Layers, Building2, Briefcase, Lock, Mail, ArrowRight, Sparkles, AlertCircle, UserPlus } from 'lucide-react';

const LIVE_AUTH = import.meta.env.VITE_ENABLE_LIVE_API === 'true';

export const Login = ({ onNavigate }) => {
  const { switchRole, login, authLoading, authError, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const getRoleIcon = roleId => ({
    [ROLES.CITIZEN]: UserCircle,
    [ROLES.NODAL]: ShieldCheck,
    [ROLES.FACULTY]: GraduationCap,
    [ROLES.STUDENT]: Layers,
    [ROLES.INDUSTRY]: Building2,
    [ROLES.ADMIN]: Briefcase
  }[roleId] || UserCircle);

  const handleQuickLogin = roleKey => {
    if (LIVE_AUTH || isAuthenticated) return;
    switchRole(roleKey);
    onNavigate(roleKey);
  };

  const handleStandardSubmit = async e => {
    e.preventDefault();
    setLocalError('');
    try {
      const authenticated = await login({ email: email.trim(), password });
      if (authenticated?.role) onNavigate(String(authenticated.role).toLowerCase());
      else onNavigate('citizen');
    } catch (error) {
      setLocalError(error.message || 'Sign in failed. Please verify your email and password.');
    }
  };

  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-jh-earth-100">
    <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80" alt="Jharkhand Canopy" className="w-full h-full object-cover filter blur-[4px] brightness-[0.75]" /><div className="absolute inset-0 bg-forest-overlay opacity-90" /></div>
    <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-jh-earth-200 overflow-hidden">
      <div className="md:col-span-7 p-6 sm:p-8 bg-jh-earth-50/80 border-b md:border-b-0 md:border-r border-jh-earth-200 flex flex-col justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-jh-terracotta-700 mb-1"><Sparkles className="w-4 h-4" /><span>{LIVE_AUTH ? 'Role-Based Secure Sign In' : 'Interactive Persona Demo Launcher'}</span></div><h3 className="text-xl font-bold text-jh-green-950 mb-1">{LIVE_AUTH ? 'Sign in with your assigned role' : 'Select a Role to Preview'}</h3><p className="text-xs text-jh-earth-600 mb-6">{LIVE_AUTH ? 'Live mode uses the Spring Boot JWT account and its server-assigned role. Role switching is disabled after authentication.' : 'Demo personas are available only in offline demo mode.'}</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Object.values(ROLES).map(roleKey => { const cfg = ROLE_CONFIGS[roleKey]; const Icon = getRoleIcon(roleKey); return <button key={roleKey} type="button" disabled={LIVE_AUTH || isAuthenticated} onClick={() => handleQuickLogin(roleKey)} className={`text-left p-3 rounded-2xl border transition-all duration-200 flex items-start gap-3 group ${LIVE_AUTH || isAuthenticated ? 'border-jh-earth-200 bg-jh-earth-50 opacity-60 cursor-not-allowed' : 'border-jh-earth-200 bg-white hover:border-jh-green-700 hover:shadow-jh-soft'}`}><div className="w-9 h-9 rounded-xl bg-jh-green-50 text-jh-green-900 flex items-center justify-center flex-shrink-0 group-hover:bg-jh-green-900 group-hover:text-white transition-colors"><Icon className="w-5 h-5" /></div><div className="min-w-0"><h4 className="text-xs font-bold text-jh-green-950 truncate">{cfg.label}</h4><p className="text-[10px] text-jh-earth-600 truncate">{cfg.portalTitle}</p></div></button>; })}</div></div><div className="pt-6 mt-4 border-t border-jh-earth-200 flex items-center justify-between text-xs text-jh-earth-600"><span>Govt of Jharkhand Unified SSO</span><span className="font-semibold text-jh-green-900">JWT / RBAC</span></div></div>
      <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between"><div><div className="mb-6"><SamadhanLogo size="md" /><p className="text-xs text-jh-earth-600 mt-2">Official single sign-on portal for citizens, officers, researchers, and CSR sponsors.</p></div>{(localError || authError) && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{localError || authError}</span></div>}{isAuthenticated && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">You are already signed in. Use your current workspace or sign out before using another account.</div>}<form onSubmit={handleStandardSubmit} className="space-y-4"><div><label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1">Email / Official ID</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full pl-9 pr-3 py-2 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" /></div></div><div><label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full pl-9 pr-3 py-2 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" /></div></div><div className="pt-2"><Button type="submit" variant="primary" size="md" className="w-full" icon={ArrowRight} disabled={authLoading || isAuthenticated}>{authLoading ? 'Signing In...' : isAuthenticated ? 'Already Signed In' : 'Sign In to Workspace'}</Button></div></form><button type="button" onClick={() => onNavigate('register')} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-jh-green-700/30 bg-jh-green-50 px-4 py-2.5 text-xs font-bold text-jh-green-900 hover:bg-jh-green-100 transition-colors"><UserPlus className="w-4 h-4" /> Create a Citizen Account</button></div><div className="pt-4 text-center"><button onClick={() => onNavigate('landing')} className="text-xs text-jh-earth-600 hover:text-jh-green-900 hover:underline">← Return to Public Home</button></div></div>
    </div>
  </div>;
};
