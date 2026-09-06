import { apiClient } from './client';

export const processIssue = (payload) => apiClient.post('/api/ai/process', payload);
export const processIssueById = (issueId) => apiClient.post(`/api/ai/issues/${issueId}/process`);

export const aiApi = { processIssue, processIssueById };
