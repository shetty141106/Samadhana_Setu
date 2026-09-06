import { apiClient } from './client';

const statusToUi = {
  REPORTED: 'SUBMITTED',
  VERIFIED: 'VERIFIED',
  ASSIGNED: 'IN_RD',
  IN_PROGRESS: 'IN_RD',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

const statusToBackend = {
  SUBMITTED: 'REPORTED',
  VERIFIED: 'VERIFIED',
  IN_RD: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

export const mapIssueToUiModel = (issue = {}) => ({
  ...issue,
  status: statusToUi[issue.status] || issue.status,
  uiStatus: statusToUi[issue.status] || issue.status,
  latitude: issue.latitude != null ? Number(issue.latitude) : null,
  longitude: issue.longitude != null ? Number(issue.longitude) : null,
  evidenceMedia: issue.evidenceMedia || []
});

export const mapIssueToApiModel = (issue = {}) => ({
  title: issue.title,
  description: issue.description,
  location: issue.location,
  latitude: issue.latitude != null ? String(issue.latitude) : undefined,
  longitude: issue.longitude != null ? String(issue.longitude) : undefined,
  priority: issue.priority,
  evidenceMedia: issue.evidenceMedia || []
});

export const listIssues = async () => (await apiClient.get('/api/issues')).map(mapIssueToUiModel);
export const getIssue = async (id) => mapIssueToUiModel(await apiClient.get(`/api/issues/${id}`));
export const getCitizenIssues = async (citizenId) => (await apiClient.get(`/api/issues/citizen/${citizenId}`)).map(mapIssueToUiModel);
export const getIssuesByStatus = async (status) => (await apiClient.get(`/api/issues/status/${statusToBackend[status] || status}`)).map(mapIssueToUiModel);
export const getIssuesByPriority = async (priority) => (await apiClient.get(`/api/issues/priority/${priority}`)).map(mapIssueToUiModel);
export const createIssue = async (issue) => mapIssueToUiModel(await apiClient.post('/api/issues', mapIssueToApiModel(issue)));
export const updateIssue = async (id, issue) => mapIssueToUiModel(await apiClient.put(`/api/issues/${id}`, mapIssueToApiModel(issue)));
export const updateIssueStatus = async (id, status) => mapIssueToUiModel(await apiClient.patch(`/api/issues/${id}/status?status=${encodeURIComponent(statusToBackend[status] || status)}`));
export const updateIssuePriority = async (id, priority) => mapIssueToUiModel(await apiClient.patch(`/api/issues/${id}/priority?priority=${encodeURIComponent(priority)}`));
export const uploadEvidence = (id, formData) => apiClient.post(`/api/issues/${id}/evidence`, formData);
export const deleteIssue = (id) => apiClient.delete(`/api/issues/${id}`);

export const issueApi = {
  listIssues,
  getIssue,
  getCitizenIssues,
  getIssuesByStatus,
  getIssuesByPriority,
  createIssue,
  updateIssue,
  updateIssueStatus,
  updateIssuePriority,
  uploadEvidence,
  deleteIssue,
  mapIssueToUiModel,
  mapIssueToApiModel
};
