import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_CONFIGS } from '../../utils/constants';
import { SamadhanLogo } from '../../components/common/Emblem';
import { Button } from '../../components/ui/Button';
import { 
  UserCircle, 
  ShieldCheck, 
  GraduationCap, 
  Layers, 
  Building2, 
  Briefcase, 
  Lock, 
  Mail, 
  User,
  Building,
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  UserPlus, 
  CheckCircle2 
} from 'lucide-react';

const LIVE_AUTH = import.meta.env.VITE_ENABLE_LIVE_API === 'true';

export const Login = ({ onNavigate }) => {
  const { switchRole, login, logout, authLoading, authError, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [localError, setLocalError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState(ROLES.CITIZEN);
  const [regOrg, setRegOrg] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

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

  const handleStandardSubmit = async e => {
    e.preventDefault();
    setLocalError('');
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setLocalError('Enter your email / official ID and password.');
      return;
    }
    try {
      if (login) {
        const authenticated = await login({ email: normalizedEmail, password });
        const serverRole = String(authenticated?.role || '').toLowerCase();
        if (serverRole) {
          onNavigate(serverRole);
          return;
        }
      }
      switchRole(selectedRole || ROLES.CITIZEN);
      onNavigate(selectedRole || 'citizen');
    } catch (error) {
      setLocalError(error.message || 'Sign in failed. Please verify your email and password.');
    }
  };

  const handleRegisterSubmit = e => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      switchRole(regRole);
      onNavigate(regRole);
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-jh-earth-100">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80"
          alt="Jharkhand Canopy"
          className="w-full h-full object-cover filter blur-[4px] brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-[#082819]/85 opacity-90" />
      </div>

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-jh-earth-200 overflow-hidden">
        
        {/* Left Col: 1-Click Fast Persona Selector (6 Cols) */}
        <div className="md:col-span-6 p-6 sm:p-8 bg-jh-earth-50/80 border-b md:border-b-0 md:border-r border-jh-earth-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-jh-terracotta-700 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Persona Demo Launcher</span>
            </div>
            <h3 className="text-xl font-bold text-jh-green-950 mb-1">
              Select a Role to Preview
            </h3>
            <p className="text-xs text-jh-earth-600 mb-5">
              Instant one-click authentication for live preview across all 6 specialized portals:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(ROLES).map(roleKey => {
                const cfg = ROLE_CONFIGS[roleKey];
                const Icon = getRoleIcon(roleKey);
                const selected = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleRoleSelect(roleKey)}
                    className={`text-left p-2.5 rounded-2xl border transition-all duration-200 flex items-start gap-2.5 group ${
                      selected
                        ? 'border-jh-green-700 bg-jh-green-50 ring-2 ring-jh-green-700/20 shadow-jh-soft'
                        : 'border-jh-earth-200 bg-white hover:border-jh-green-700 hover:shadow-jh-soft'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-jh-green-50 text-jh-green-900 flex items-center justify-center flex-shrink-0 group-hover:bg-jh-green-900 group-hover:text-white transition-colors">
                      {selected ? <CheckCircle2 className="w-4 h-4 text-jh-green-900" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-jh-green-950 group-hover:text-jh-terracotta-700 truncate">
                        {cfg.label}
                      </h4>
                      <p className="text-[9.5px] text-jh-earth-600 truncate">
                        {cfg.portalTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-jh-earth-200 flex items-center justify-between text-xs text-jh-earth-600">
            <span>Govt of Jharkhand Unified SSO</span>
            <span className="font-semibold text-jh-green-900">Security Standard v2.4</span>
          </div>
        </div>

        {/* Right Col: Standard Login / Register Form (6 Cols) */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <SamadhanLogo size="md" />
              
              {/* Tab Switcher */}
              <div className="flex bg-jh-earth-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-jh-green-900 text-white shadow-xs' : 'text-jh-earth-700 hover:text-jh-charcoal'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    authMode === 'register' ? 'bg-jh-green-900 text-white shadow-xs' : 'text-jh-earth-700 hover:text-jh-charcoal'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {(localError || authError) && (
              <div role="alert" className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{localError || authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleStandardSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1">
                    Email / Official ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
                    <input
                      type="email"
                      required
                      placeholder="birsa.munda@jharkhand.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="md" className="w-full" icon={ArrowRight} disabled={authLoading}>
                    {authLoading ? 'Signing In...' : selectedRole ? `Sign In as ${ROLE_CONFIGS[selectedRole]?.label || 'Selected Role'}` : 'Sign In to Workspace'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                {regSuccess ? (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-jh-green-950">Registration Successful!</h4>
                    <p className="text-xs text-jh-earth-600">Redirecting to your new workspace...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-jh-earth-800 mb-0.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jh-earth-500" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Chandra"
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jh-green-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-jh-earth-800 mb-0.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jh-earth-500" />
                        <input
                          type="email"
                          required
                          placeholder="name@organization.in"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jh-green-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-jh-earth-800 mb-0.5">System Role *</label>
                      <select
                        value={regRole}
                        onChange={e => setRegRole(e.target.value)}
                        className="w-full p-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg font-medium text-jh-charcoal"
                      >
                        <option value={ROLES.CITIZEN}>Citizen (Grievance Submitter)</option>
                        <option value={ROLES.NODAL}>District Nodal Officer</option>
                        <option value={ROLES.FACULTY}>Academic Faculty / PI</option>
                        <option value={ROLES.STUDENT}>Student Researcher</option>
                        <option value={ROLES.INDUSTRY}>Industry / CSR Partner</option>
                        <option value={ROLES.ADMIN}>Government Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-jh-earth-800 mb-0.5">District / University / Organization</label>
                      <div className="relative">
                        <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jh-earth-500" />
                        <input
                          type="text"
                          placeholder="e.g. Ranchi / BIT Mesra / Tata Steel"
                          value={regOrg}
                          onChange={e => setRegOrg(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jh-green-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-jh-earth-800 mb-0.5">Create Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jh-earth-500" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jh-green-700"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
                        Create Account & Enter Portal
                      </Button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>

          <div className="pt-3 text-center">
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs text-jh-earth-600 hover:text-jh-green-900 hover:underline"
            >
              ← Return to Public Home
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
