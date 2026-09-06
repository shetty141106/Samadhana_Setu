import { apiClient, setAuthToken, clearAuthToken } from './client';

export const login = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  if (response?.token) setAuthToken(response.token);
  return response;
};

export const register = (payload) => apiClient.post('/api/auth/register', payload);
export const logout = () => clearAuthToken();

export const authApi = { login, register, logout };
