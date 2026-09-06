import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SamadhanLogo } from '../../components/common/Emblem';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const Register = ({ onNavigate }) => {
  const { register, authLoading, authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    if (password.length < 6) {
      setLocalError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      const response = await register({ name: name.trim(), email: email.trim(), password });
      if (response?.token) {
        onNavigate('citizen');
      } else {
        setRegistered(true);
      }
    } catch (error) {
      setLocalError(error.message || 'Registration failed. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-jh-earth-100">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-jh-earth-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-jh-green-950">Registration Complete</h2>
          <p className="mt-2 text-sm text-jh-earth-600">Your citizen account has been created. Sign in to continue to SamadhanSetu.</p>
          <Button className="mt-6 w-full" variant="primary" onClick={() => onNavigate('login')}>Go to Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-jh-earth-100">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80" alt="Jharkhand forest" className="w-full h-full object-cover filter blur-[4px] brightness-[0.75]" />
        <div className="absolute inset-0 bg-forest-overlay opacity-90" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-jh-earth-200 p-6 sm:p-8">
        <div className="mb-6">
          <SamadhanLogo size="md" />
          <h1 className="mt-5 text-2xl font-bold text-jh-green-950">Create Citizen Account</h1>
          <p className="mt-1 text-xs text-jh-earth-600">Register to report civic issues and track their resolution.</p>
        </div>

        {(localError || authError) && (
          <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{localError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
              <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Enter your full name" className="w-full pl-9 pr-3 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full pl-9 pr-3 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 6 characters" className="w-full pl-9 pr-3 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" placeholder="Re-enter your password" className="w-full pl-9 pr-3 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700" />
            </div>
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full" icon={ArrowRight} disabled={authLoading}>
            {authLoading ? 'Creating Account...' : 'Register as Citizen'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-jh-earth-200 flex items-center justify-between text-xs">
          <button type="button" onClick={() => onNavigate('landing')} className="inline-flex items-center gap-1 text-jh-earth-600 hover:text-jh-green-900 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <button type="button" onClick={() => onNavigate('login')} className="font-semibold text-jh-green-800 hover:text-jh-terracotta-700 hover:underline">Already registered? Sign in</button>
        </div>
      </div>
    </div>
  );
};
