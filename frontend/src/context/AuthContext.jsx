import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ROLES, ROLE_CONFIGS } from '../utils/constants';
import { authApi } from '../api/auth.api';
import { notificationApi } from '../api/notification.api';
import { clearAuthToken, setAuthToken } from '../api/client';

const AuthContext = createContext(null);
const LIVE_AUTH = import.meta.env.VITE_ENABLE_LIVE_API === 'true';
const SESSION_KEY = 'samadhansetu_session';

const normalizeRole = role => {
  const value = String(role || '').trim().toUpperCase();
  const aliases = { CITIZEN: ROLES.CITIZEN, NODAL: ROLES.NODAL, NODAL_OFFICER: ROLES.NODAL, FACULTY: ROLES.FACULTY, ACADEMIC_FACULTY: ROLES.FACULTY, STUDENT: ROLES.STUDENT, STUDENT_RESEARCHER: ROLES.STUDENT, INDUSTRY: ROLES.INDUSTRY, INDUSTRY_CSR: ROLES.INDUSTRY, ADMIN: ROLES.ADMIN, SYSTEM_ADMIN: ROLES.ADMIN };
  return aliases[value] || ROLES.CITIZEN;
};
const readSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
const notificationToUi = n => ({ ...n, read: Boolean(n.read ?? n.readStatus), readStatus: Boolean(n.read ?? n.readStatus) });

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession());
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const currentRole = session?.role ? normalizeRole(session.role) : null;
  const currentUser = session ? { ...session, role: currentRole, id: session.userId ?? session.id } : null;
  const roleConfig = currentRole ? ROLE_CONFIGS[currentRole] : null;
  const isAuthenticated = Boolean(session?.token);

  useEffect(() => {
    const handleAuthInvalidated = () => { clearAuthToken(); localStorage.removeItem(SESSION_KEY); setSession(null); setNotifications([]); setAuthError('Your session has expired. Please sign in again.'); };
    window.addEventListener('samadhansetu-auth-invalidated', handleAuthInvalidated);
    const handleStorage = event => { if (event.key === SESSION_KEY || event.key === 'samadhansetu_token') setSession(readSession()); };
    window.addEventListener('storage', handleStorage);
    return () => { window.removeEventListener('samadhansetu-auth-invalidated', handleAuthInvalidated); window.removeEventListener('storage', handleStorage); };
  }, []);

  useEffect(() => {
    if (!LIVE_AUTH || !isAuthenticated || !currentUser?.id) { setNotifications([]); return; }
    let cancelled = false;
    notificationApi.listUserNotifications(currentUser.id).then(items => { if (!cancelled && Array.isArray(items)) setNotifications(items.map(notificationToUi)); }).catch(error => { if (error?.status === 401) window.dispatchEvent(new Event('samadhansetu-auth-invalidated')); });
    return () => { cancelled = true; };
  }, [isAuthenticated, currentUser?.id]);

  const login = async credentials => {
    setAuthLoading(true); setAuthError('');
    try {
      if (!LIVE_AUTH) throw new Error('Live authentication is disabled. Set VITE_ENABLE_LIVE_API=true.');
      const response = await authApi.login(credentials);
      if (!response?.token) throw new Error('The server did not return an authentication token.');
      const nextSession = { ...response, role: normalizeRole(response.role) };
      setAuthToken(response.token); localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession)); setSession(nextSession); return nextSession;
    } catch (error) { setAuthError(error.message || 'Unable to sign in. Please check your credentials.'); throw error; }
    finally { setAuthLoading(false); }
  };

  const register = async payload => {
    setAuthLoading(true); setAuthError('');
    try {
      if (!LIVE_AUTH) throw new Error('Live authentication is disabled.');
      const response = await authApi.register(payload);
      if (response?.token) { const nextSession = { ...response, role: normalizeRole(response.role) }; setAuthToken(response.token); localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession)); setSession(nextSession); }
      return response;
    } catch (error) { setAuthError(error.message || 'Unable to register.'); throw error; }
    finally { setAuthLoading(false); }
  };

  const logout = () => { clearAuthToken(); localStorage.removeItem(SESSION_KEY); setSession(null); setNotifications([]); setAuthError(''); };
  const switchRole = () => {};
  const markNotificationAsRead = async id => { if (LIVE_AUTH && isAuthenticated) await notificationApi.markAsRead(id).catch(error => { if (error?.status === 401) window.dispatchEvent(new Event('samadhansetu-auth-invalidated')); }); setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, readStatus: true } : n)); };
  const markAllNotificationsAsRead = async () => { const unread = notifications.filter(n => !n.read && !n.readStatus); if (LIVE_AUTH && isAuthenticated) await Promise.allSettled(unread.map(n => notificationApi.markAsRead(n.id))); setNotifications(prev => prev.map(n => ({ ...n, read: true, readStatus: true }))); };
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  const value = useMemo(() => ({ currentRole, currentUser, roleConfig, switchRole, login, register, logout, isAuthenticated, authLoading, authError, language, toggleLanguage, notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadCount: notifications.filter(n => !n.read && !n.readStatus).length }), [currentRole, currentUser, roleConfig, session, isAuthenticated, authLoading, authError, language, notifications]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; };
