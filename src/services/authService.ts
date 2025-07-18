import api, { setAuthToken, setRefreshToken, removeTokens } from '@/lib/api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/api';

// Backend response interface (different from frontend AuthResponse)
interface BackendAuthResponse {
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<BackendAuthResponse>('/auth/login/', credentials);
      const { tokens, user } = response.data;
      
      // Store tokens
      setAuthToken(tokens.access);
      setRefreshToken(tokens.refresh);
      
      // Convert to frontend format
      return {
        access: tokens.access,
        refresh: tokens.refresh,
        user
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Map frontend fields to backend fields
      const backendData = {
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone_number, // Map phone_number to phone
      };

      const response = await api.post<BackendAuthResponse>('/auth/register/', backendData);
      const { tokens, user } = response.data;
      
      // Store tokens
      setAuthToken(tokens.access);
      setRefreshToken(tokens.refresh);
      
      // Convert to frontend format
      return {
        access: tokens.access,
        refresh: tokens.refresh,
        user
      };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const fieldErrors = error.response?.data;
      
      if (fieldErrors && typeof fieldErrors === 'object') {
        // Handle Django field errors
        for (const [field, errors] of Object.entries(fieldErrors)) {
          if (Array.isArray(errors) && errors.length > 0) {
            throw new Error(`${field}: ${errors[0]}`);
          }
        }
      }
      
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      // Even if logout fails on server, we should clear local tokens
      console.error('Logout error:', error);
    } finally {
      removeTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch<User>('/auth/profile/', userData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password/', {
        old_password: currentPassword,
        new_password: newPassword,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await api.post<{ access: string }>('/auth/token/refresh/', {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      setAuthToken(access);
      
      return response.data;
    } catch (error: any) {
      removeTokens();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  setStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearStoredUser(): void {
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export default authService; 