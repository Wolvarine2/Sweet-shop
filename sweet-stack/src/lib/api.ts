// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('sweetshop_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('sweetshop_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('sweetshop_token');
};

// API request helper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return {} as T;
}

// WebSocket URL helper
export const getWebSocketUrl = (channel: 'stock' | 'admin'): string => {
  const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  return `${wsBaseUrl}/ws/${channel}`;
};

export default API_BASE_URL;

