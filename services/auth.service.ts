import { coreApi } from './api.config';
import type {
  ApiResponse,
  LoginDto,
  RegisterDto,
  AuthResponse,
  User,
  UpdateProfileDto,
} from '../types/api.types';

export const authService = {
  /**
   * Registrar novo usuário
   * POST /api/auth/register
   */
  async register(data: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    const response = await coreApi.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login do usuário
   * POST /api/auth/login
   */
  async login(data: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const response = await coreApi.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  /**
   * Logout do usuário
   * POST /api/auth/logout
   * Invalidates the current token (client-side removal)
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await coreApi.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  /**
   * Obter perfil do usuário logado
   * GET /api/auth/profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await coreApi.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  /**
   * Atualizar perfil do usuário
   * PUT /api/auth/profile
   */
  async updateProfile(data: UpdateProfileDto): Promise<ApiResponse<User>> {
    console.log('[authService] Sending updateProfile request:', JSON.stringify(data, null, 2));
    const response = await coreApi.put<ApiResponse<User>>('/auth/profile', data);
    console.log('[authService] updateProfile response:', response.data);
    return response.data;
  },
};
