import { apiClient } from './client';

export const listUniversities = () => apiClient.get('/api/universities');
export const getUniversity = (id) => apiClient.get(`/api/universities/${id}`);
export const createUniversity = (payload) => apiClient.post('/api/universities', payload);
export const updateUniversity = (id, payload) => apiClient.put(`/api/universities/${id}`, payload);
export const deleteUniversity = (id) => apiClient.delete(`/api/universities/${id}`);

export const universityApi = {
  listUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity
};
