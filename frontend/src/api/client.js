const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const getStoredToken = () => {
  try {
    return localStorage.getItem('samadhansetu_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem('samadhansetu_token');
    return;
  }
  localStorage.setItem('samadhansetu_token', token);
};

export const clearAuthToken = () => setAuthToken(null);

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiRequest = async (path, options = {}) => {
  const { body, headers = {}, ...rest } = options;
  const token = getStoredToken();
  const requestHeaders = {
    Accept: 'application/json',
    ...headers
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new Event('samadhansetu-auth-invalidated'));
    }
    const message = data?.message || data?.error || (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
    throw new ApiError(message, response.status, data);
  }

  return data;
};

export const apiClient = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' })
};

export { API_BASE_URL };
