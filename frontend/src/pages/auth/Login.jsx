import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_CONFIGS } from '../../utils/constants';
import { SamadhanLogo } from '../../components/common/Emblem';
import { Button } from '../../components/ui/Button';
import { UserCircle, ShieldCheck, GraduationCap, Layers, Building2, Briefcase, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login = ({ onNavigate }) => {
  const { switchRole, login, authLoading, authError, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [localError, setLocalError] = useState('');

  const getRoleIcon = roleId => ({
    [ROLES.CITIZEN]: UserCircle,
    [ROLES.NODAL]: ShieldCheck,
    [ROLES.FACULTY]: GraduationCap,
    [ROLES.STUDENT]: Layers,
    [ROLES.INDUSTRY]: Building2,
    [ROLES.ADMIN]: Briefcase
  }[roleId] || UserCircle);

  const handleRoleSelect = roleKey => {
    if (isAuthenticated) return;
    setLocalError('');
    setSelectedRole(roleKey);
    switchRole(roleKey);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLocalError('');
    if (!selectedRole) {
      setLocalError('Select a role before signing in.');
      return;
    }
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setLocalError('Enter your email / official ID and password.');
      return;
    }
    try {
      const authenticated = await login({ email: normalizedEmail, password });
      const serverRole = String(authenticated?.role || '').toLowerCase();
      if (serverRole) {
        onNavigate(serverRole);
        return;
      }
      switchRole(selectedRole);
      onNavigate(selectedRole);
    } catch (error) {
      setLocalError(error.message || 'Sign in failed. Please verify your email and password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 relative overflow-hidden bg-jh-earth-100">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80" alt="Jharkhand Canopy" className="w-full h-full object-cover filter blur-[4px] brightness-[0.75]" />
        <div className="absolute inset-0 bg-[#082819]/85 opacity-90" />
      </div>
      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-jh-earth-200 overflow-hidden">
        <div className="md:col-span-6 p-6 sm:p-8 bg-jh-earth-50/80 border-b md:border-b-0 md:border-r border-jh-earth-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-jh-terracotta-700 mb-1"><Sparkles className="w-4 h-4" /><span>Select access role</span></div>
            <h3 className="text-xl font-bold text-jh-green-950 mb-1">Choose your workspace</h3>
            <p className="text-xs text-jh-earth-600 mb-5">Select the role associated with your account before signing in.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(ROLES).map(roleKey => {
                const cfg = ROLE_CONFIGS[roleKey];
                const Icon = getRoleIcon(roleKey);
                const selected = selectedRole === roleKey;
                return <button key={roleKey} type="button" onClick={() => handleRoleSelect(roleKey)} className={`text-left p-2.5 rounded-2xl border transition-all flex items-start gap-2.5 group ${selected ? 'border-jh-green-700 bg-jh-green-50 ring-2 ring-jh-green-700/20 shadow-jh-soft' : 'border-jh-earth-200 bg-white hover:border-jh-green-700 hover:shadow-jh-soft'}`}>
                  <div className="w-8 h-8 rounded-xl bg-jh-green-50 text-jh-green-900 flex items-center justify-center flex-shrink-0">{selected ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}</div>
                  <div className="min-w-0"><h4 className="text-xs font-bold text-jh-green-950 truncate">{cfg.label}</h4><p className="text-[9.5px] text-jh-earth-600 truncate">{cfg.portalTitle}</p></div>
                </button>;
              })}
            </div>
          </div>
          <div className="pt-5 mt-4 border-t border-jh-earth-200 flex items-center justify-between text-xs text-jh-earth-600"><span>Govt of Jharkhand Unified SSO</span><span className="font-semibold text-jh-green-900">Security Standard v2.4</span></div>
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5"><SamadhanLogo size="md" /><button type="button" onClick={() => onNavigate('register')} className="text-xs font-bold text-jh-green-800 hover:text-jh-terracotta-700">New user? Register</button></div>
            {(localError || authError) && <div role="alert" className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{localError || authError}</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1">Email / Official ID</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input type="email" required placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full pl-9 pr-3 py-2.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" /></div></div>
              <div><label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full pl-9 pr-3 py-2.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" /></div></div>
              {selectedRole && <Button type="submit" variant="primary" size="md" className="w-full" icon={ArrowRight} disabled={authLoading}>{authLoading ? 'Signing In...' : `Sign In as ${ROLE_CONFIGS[selectedRole]?.label || 'Selected Role'}`}</Button>}
            </form>
            {!selectedRole && <p className="mt-4 text-center text-[11px] text-jh-earth-500">Select a role on the left to continue.</p>}
          </div>
          <button onClick={() => onNavigate('landing')} className="pt-6 text-xs text-jh-earth-600 hover:text-jh-green-900 hover:underline">← Return to Public Home</button>
        </div>
      </div>
    </div>
  );
};
