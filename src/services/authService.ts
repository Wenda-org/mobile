import coreApi from '../api/coreApi';
import { User, UserPreferences } from '../types/api.types';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
    const response = await coreApi.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: Record<string, any>): Promise<LoginResponse> => {
    const response = await coreApi.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await coreApi.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await coreApi.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User> & { preferences?: UserPreferences }): Promise<User> => {
    const response = await coreApi.put('/auth/me', data);
    return response.data;
  },
};
