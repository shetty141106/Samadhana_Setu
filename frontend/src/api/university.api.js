import { apiClient } from './client';

export const listUniversities = () => apiClient.get('/api/universities');
export const getUniversity = (id) => apiClient.get(`/api/universities/${id}`);
export const searchUniversities = (name) => apiClient.get(`/api/universities/search?name=${encodeURIComponent(name)}`);
export const searchUniversitiesByLocation = (value) => apiClient.get(`/api/universities/location?value=${encodeURIComponent(value)}`);
export const routeIssueToUniversities = (category) => apiClient.get(`/api/universities/routing?category=${encodeURIComponent(category)}`);
export const createUniversity = (payload) => apiClient.post('/api/universities', payload);
export const updateUniversity = (id, payload) => apiClient.put(`/api/universities/${id}`, payload);
export const deleteUniversity = (id) => apiClient.delete(`/api/universities/${id}`);

export const universityApi = {
  listUniversities,
  getUniversity,
  searchUniversities,
  searchUniversitiesByLocation,
  routeIssueToUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity
};
