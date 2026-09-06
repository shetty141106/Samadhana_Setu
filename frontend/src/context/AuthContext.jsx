import React, { createContext, useContext, useState } from 'react';
import { ROLES, ROLE_CONFIGS } from '../utils/constants';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(ROLES.CITIZEN);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const currentUser = MOCK_USERS.find(u => u.role === currentRole) || MOCK_USERS[0];
  const roleConfig = ROLE_CONFIGS[currentRole];

  const switchRole = (newRole) => {
    if (Object.values(ROLES).includes(newRole)) {
      setCurrentRole(newRole);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentUser,
        roleConfig,
        switchRole,
        language,
        toggleLanguage,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadCount: notifications.filter(n => !n.read).length
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
