import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCheck, Clock, Check } from 'lucide-react';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-jh-green-900 hover:bg-jh-earth-100 transition-colors focus:outline-none focus:ring-2 focus:ring-jh-green-700"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-jh-terracotta-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-jh-earth-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 bg-jh-earth-50 border-b border-jh-earth-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-jh-terracotta-100 text-jh-terracotta-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-medium text-jh-green-800 hover:text-jh-terracotta-700 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-jh-earth-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-jh-earth-600">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3.5 text-left hover:bg-jh-earth-50/80 transition-colors cursor-pointer ${
                    !n.read ? 'bg-jh-green-50/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className={`text-xs font-semibold ${!n.read ? 'text-jh-green-950 font-bold' : 'text-jh-earth-900'}`}>
                      {n.title}
                    </h5>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-jh-terracotta-500 mt-1 flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-jh-earth-700 mt-1 leading-relaxed">{n.message}</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-jh-earth-500">
                    <Clock className="w-3 h-3" />
                    <span>{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
