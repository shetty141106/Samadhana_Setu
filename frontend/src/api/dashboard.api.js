import { apiClient } from './client';

export const getSummary = () => apiClient.get('/api/dashboard/summary');
export const getIssueStatus = () => apiClient.get('/api/dashboard/issues/status');
export const getIssuePriority = () => apiClient.get('/api/dashboard/issues/priority');
export const getIssueCategories = () => apiClient.get('/api/dashboard/issues/categories');
export const getProjectStatus = () => apiClient.get('/api/dashboard/projects/status');
export const getTaskStatus = () => apiClient.get('/api/dashboard/tasks/status');
export const getUniversityParticipation = () => apiClient.get('/api/dashboard/universities');
export const getLocationAnalytics = () => apiClient.get('/api/dashboard/locations');
export const getFinancials = () => apiClient.get('/api/dashboard/financials');

export const dashboardApi = {
  getSummary,
  getIssueStatus,
  getIssuePriority,
  getIssueCategories,
  getProjectStatus,
  getTaskStatus,
  getUniversityParticipation,
  getLocationAnalytics,
  getFinancials
};
