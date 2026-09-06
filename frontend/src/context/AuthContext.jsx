import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ROLES, ROLE_CONFIGS } from '../utils/constants';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from '../data/mockData';
import { authApi } from '../api/auth.api';
import { notificationApi } from '../api/notification.api';
import { clearAuthToken, setAuthToken } from '../api/client';

const AuthContext = createContext(null);
const LIVE_AUTH = import.meta.env.VITE_ENABLE_LIVE_API === 'true';
const SESSION_KEY = 'samadhansetu_session';

const normalizeRole = (role) => {
  const value = String(role || '').trim().toUpperCase();
  const aliases = {
    CITIZEN: ROLES.CITIZEN,
    NODAL: ROLES.NODAL,
    NODAL_OFFICER: ROLES.NODAL,
    FACULTY: ROLES.FACULTY,
    ACADEMIC_FACULTY: ROLES.FACULTY,
    STUDENT: ROLES.STUDENT,
    STUDENT_RESEARCHER: ROLES.STUDENT,
    INDUSTRY: ROLES.INDUSTRY,
    INDUSTRY_CSR: ROLES.INDUSTRY,
    ADMIN: ROLES.ADMIN,
    SYSTEM_ADMIN: ROLES.ADMIN
  };
  return aliases[value] || ROLES.CITIZEN;
};

const readSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
};
const notificationToUi = n => ({ ...n, read: Boolean(n.read ?? n.readStatus), readStatus: Boolean(n.read ?? n.readStatus) });

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession());
  const [demoRole, setDemoRole] = useState(ROLES.CITIZEN);
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const currentRole = session?.role ? normalizeRole(session.role) : demoRole;
  const demoUser = MOCK_USERS.find(u => u.role === demoRole) || MOCK_USERS[0];
  const currentUser = session ? { ...demoUser, ...session, role: currentRole, id: session.userId ?? session.id } : demoUser;
  const roleConfig = ROLE_CONFIGS[currentRole];
  const isAuthenticated = Boolean(session?.token);

  useEffect(() => {
    if (!LIVE_AUTH || !isAuthenticated || !currentUser?.id) return;
    let cancelled = false;
    notificationApi.listUserNotifications(currentUser.id)
      .then(items => { if (!cancelled && Array.isArray(items)) setNotifications(items.map(notificationToUi)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isAuthenticated, currentUser?.id]);

  const login = async credentials => {
    setAuthLoading(true); setAuthError('');
    try {
      if (!LIVE_AUTH) {
        const mock = MOCK_USERS.find(u => u.email.toLowerCase() === credentials.email.toLowerCase()) || MOCK_USERS[0];
        setDemoRole(mock.role);
        return { ...mock, token: 'demo-token' };
      }
      const response = await authApi.login(credentials);
      const nextSession = { ...response, role: normalizeRole(response.role) };
      setAuthToken(response.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      setAuthError(error.message || 'Unable to sign in. Please check your credentials.');
      throw error;
    } finally { setAuthLoading(false); }
  };

  const register = async payload => {
    setAuthLoading(true); setAuthError('');
    try {
      if (!LIVE_AUTH) return null;
      const response = await authApi.register(payload);
      if (response?.token) {
        const nextSession = { ...response, role: normalizeRole(response.role) };
        setAuthToken(response.token);
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      }
      return response;
    } catch (error) {
      setAuthError(error.message || 'Unable to register.');
      throw error;
    } finally { setAuthLoading(false); }
  };

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setDemoRole(ROLES.CITIZEN);
    setNotifications(MOCK_NOTIFICATIONS);
  };
  const switchRole = newRole => { if (!isAuthenticated && Object.values(ROLES).includes(newRole)) setDemoRole(newRole); };
  const markNotificationAsRead = async id => { if (LIVE_AUTH && isAuthenticated) await notificationApi.markAsRead(id).catch(() => {}); setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, readStatus: true } : n)); };
  const markAllNotificationsAsRead = async () => { const unread = notifications.filter(n => !n.read && !n.readStatus); if (LIVE_AUTH && isAuthenticated) await Promise.allSettled(unread.map(n => notificationApi.markAsRead(n.id))); setNotifications(prev => prev.map(n => ({ ...n, read: true, readStatus: true }))); };
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  const value = useMemo(() => ({ currentRole, currentUser, roleConfig, switchRole, login, register, logout, isAuthenticated, authLoading, authError, language, toggleLanguage, notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadCount: notifications.filter(n => !n.read && !n.readStatus).length }), [currentRole, currentUser, roleConfig, session, isAuthenticated, authLoading, authError, language, notifications]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within an AuthProvider'); return context; };
