import { apiClient } from './client';

export const createNotification = (payload) => apiClient.post('/api/notifications', payload);
export const listUserNotifications = (userId) => apiClient.get(`/api/notifications/user/${userId}`);
export const listUnreadNotifications = (userId) => apiClient.get(`/api/notifications/user/${userId}/unread`);
export const getUnreadCount = (userId) => apiClient.get(`/api/notifications/user/${userId}/unread/count`);
export const markAsRead = (id) => apiClient.put(`/api/notifications/${id}/read`);
export const deleteNotification = (id) => apiClient.delete(`/api/notifications/${id}`);

export const notificationApi = {
  createNotification,
  listUserNotifications,
  listUnreadNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification
};
