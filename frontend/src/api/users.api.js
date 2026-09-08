import { apiClient } from './client';

export const listUsers = () => apiClient.get('/api/users');
export const createUser = payload => apiClient.post('/api/users', payload);

export const usersApi = { listUsers, createUser };
