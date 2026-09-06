import { apiClient } from './client';

export const listOrganizations = () => apiClient.get('/api/industry/organizations');
export const getOrganization = (id) => apiClient.get(`/api/industry/organizations/${id}`);
export const searchOrganizations = (name) => apiClient.get(`/api/industry/organizations/search?name=${encodeURIComponent(name)}`);
export const verifyOrganization = (id) => apiClient.get(`/api/industry/organizations/${id}/verification`);
export const createOrganization = (payload) => apiClient.post('/api/industry/organizations', payload);
export const updateOrganization = (id, payload) => apiClient.put(`/api/industry/organizations/${id}`, payload);
export const deleteOrganization = (id) => apiClient.delete(`/api/industry/organizations/${id}`);

export const createSponsorship = (payload) => apiClient.post('/api/industry/sponsorships', payload);
export const listSponsorships = () => apiClient.get('/api/industry/sponsorships');
export const getSponsorship = (id) => apiClient.get(`/api/industry/sponsorships/${id}`);
export const listOrganizationSponsorships = (organizationId) => apiClient.get(`/api/industry/organizations/${organizationId}/sponsorships`);
export const listProjectSponsorships = (projectId) => apiClient.get(`/api/industry/projects/${projectId}/sponsorships`);
export const updateSponsorship = (id, payload) => apiClient.put(`/api/industry/sponsorships/${id}`, payload);

export const industryApi = {
  listOrganizations,
  getOrganization,
  searchOrganizations,
  verifyOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  createSponsorship,
  listSponsorships,
  getSponsorship,
  listOrganizationSponsorships,
  listProjectSponsorships,
  updateSponsorship
};
