import { apiRequest, setAuthToken, removeAuthToken } from '@/lib/api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface RegisterResponse {
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    setAuthToken(data.access_token);
    return data;
  },

  async register(email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  logout(): void {
    removeAuthToken();
  },
};

