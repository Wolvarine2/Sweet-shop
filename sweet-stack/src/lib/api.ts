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

// API request helper with session tracking
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

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    // Clear invalid token and user data
    removeAuthToken();
    localStorage.removeItem('sweetshop_user');
    
    // Dispatch custom event for auth context to handle
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Navigate to home page on session expiry
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      // Handle FastAPI validation errors (array format)
      if (Array.isArray(errorData.detail)) {
        const validationErrors = errorData.detail.map((err: any) => {
          const field = err.loc ? err.loc.slice(1).join('.') : 'field';
          return `${field}: ${err.msg}`;
        }).join(', ');
        errorMessage = `Validation error: ${validationErrors}`;
      }
      // Handle standard error detail (string)
      else if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      } 
      // Handle message field
      else if (errorData.message) {
        errorMessage = typeof errorData.message === 'string'
          ? errorData.message
          : JSON.stringify(errorData.message);
      } 
      // Handle string response
      else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } 
      // Fallback to stringify
      else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
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

