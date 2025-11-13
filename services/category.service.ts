import { coreApi } from './api.config';
import type {
  ApiResponse,
  Category,
  CategoryWithCount,
} from '../types/api.types';

export const categoryService = {
  /**
   * Listar todas as categorias
   */
  async getCategories(): Promise<ApiResponse<CategoryWithCount[]>> {
    const response = await coreApi.get<ApiResponse<CategoryWithCount[]>>('/categories');
    return response.data;
  },

  /**
   * Obter detalhes de uma categoria específica
   */
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await coreApi.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
};
