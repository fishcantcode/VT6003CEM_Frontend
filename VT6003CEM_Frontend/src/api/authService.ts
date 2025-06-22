import axios from 'axios';
import type { User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  isOperator: boolean;
  operatorCode?: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  operatorCode?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'operator' | 'admin';
    profile: {
      firstName: string;
      lastName: string;
      bio?: string;
    };
    isEmployee: boolean;
    avatarImage?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    bio?: string;
  };
  role: 'user' | 'operator';
  isEmployee: boolean;
  avatarImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  profile: {
    firstName?: string;
    lastName?: string;
    bio?: string;
  };
}

export interface AvatarUploadPayload {
  avatar: File;
}

export const authService = {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: loginData.email,
        password: loginData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const roleData = await this.getUserRole();
        const userWithRole = {
          ...response.data.user,
          role: roleData.role,
        };
        localStorage.setItem('user', JSON.stringify(userWithRole));
        window.dispatchEvent(new Event('authChange'));
      }
      
      return response.data;
    } catch (error: any) {
      localStorage.removeItem('token');
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },

  async register(userData: SignupData): Promise<AuthResponse> {
    try {
      const registerPayload: RegisterPayload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstname: userData.firstname,
        lastname: userData.lastname,
      };
      if (userData.isOperator && userData.operatorCode) {
        registerPayload.operatorCode = userData.operatorCode;
      }
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('authChange'));
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors;
        throw new Error(JSON.stringify({
          message: error.response.data.message || 'Invalid input.',
          errors: fieldErrors
        }));
      }
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    }
  },

  async getUserRole(): Promise<{ role: 'user' | 'operator' | 'admin' }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/role`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      throw error;
    }
  },

  updateCurrentUser(updates: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  isOperator(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'operator';
  },

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      return response.data;
    } catch (error: any) {
      console.error('Get user profile error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
    }
  },

  async updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/profile`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

 
      const updatedUser = response.data;
      const currentUser = this.getCurrentUser();
      const mergedUser = { 
        ...currentUser, 
        ...updatedUser,
        profile: {
          ...currentUser?.profile,
          ...updatedUser.profile
        }
      };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      window.dispatchEvent(new Event('authChange'));

      return updatedUser;
    } catch (error: any) {
      console.error('Update user profile error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update user profile.');
    }
  },

  getAvatarUrl(userId: number) {
    return `${API_BASE_URL}/user/${userId}/avatar`;
  },

  /**
   * Get the avatar URL for the current logged-in user.
   */
  getOwnAvatarUrl() {
    return `${API_BASE_URL}/user/avatar`;
  },

  /**
   * Fetch the current user's avatar as a data URL for direct display in the UI.
   * This handles the case where the API returns the image directly rather than a URL.
   */
  async getAvatarDataUrl(): Promise<string> {
    try {
 
      const response = await axios.get(`${API_BASE_URL}/user/avatar`, {
        responseType: 'blob'
      });
      
 
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error('Failed to load avatar:', error);
      return ''; // Return empty string on error
    }
  },

  async uploadAvatar(file: File): Promise<{ message: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${API_BASE_URL}/user/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

 
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const avatarUrl = this.getOwnAvatarUrl() + `?${Date.now()}`; // cache busting
        const updatedUser = { ...currentUser, avatarImage: avatarUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('authChange'));
      }

      return response.data;
    } catch (error: any) {
      console.error('Avatar upload error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload avatar.');
    }
  },
};