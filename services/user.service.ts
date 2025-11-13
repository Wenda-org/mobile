import { coreApi } from './api.config';
import type {
  ApiResponse,
  User,
  UpdateProfileDto,
} from '../types/api.types';

export const userService = {
  /**
   * Obter perfil do usuário atual
   * GET /api/users/me
   */
  async getMe(): Promise<ApiResponse<User>> {
    const response = await coreApi.get<ApiResponse<User>>('/users/me');
    return response.data;
  },

  /**
   * Atualizar perfil do usuário atual
   * PUT /api/users/me
   */
  async updateMe(data: UpdateProfileDto): Promise<ApiResponse<User>> {
    const response = await coreApi.put<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  /**
   * Obter usuário por ID
   * GET /api/users/{id}
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await coreApi.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
};
