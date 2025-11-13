import { coreApi } from './api.config';
import type {
  ApiResponse,
  Trip,
  CreateTripDto,
  UpdateTripDto,
  AddDestinationToTripDto,
} from '../types/api.types';

export const tripService = {
  /**
   * Listar todas as viagens do usuário
   */
  async getTrips(): Promise<ApiResponse<Trip[]>> {
    const response = await coreApi.get<ApiResponse<Trip[]>>('/trips');
    return response.data;
  },

  /**
   * Obter detalhes de uma viagem específica
   */
  async getTripById(id: string): Promise<ApiResponse<Trip>> {
    const response = await coreApi.get<ApiResponse<Trip>>(`/trips/${id}`);
    return response.data;
  },

  /**
   * Criar nova viagem
   */
  async createTrip(data: CreateTripDto): Promise<ApiResponse<Trip>> {
    const response = await coreApi.post<ApiResponse<Trip>>('/trips', data);
    return response.data;
  },

  /**
   * Atualizar viagem
   */
  async updateTrip(id: string, data: UpdateTripDto): Promise<ApiResponse<Trip>> {
    const response = await coreApi.put<ApiResponse<Trip>>(`/trips/${id}`, data);
    return response.data;
  },

  /**
   * Deletar viagem
   */
  async deleteTrip(id: string): Promise<ApiResponse<void>> {
    const response = await coreApi.delete<ApiResponse<void>>(`/trips/${id}`);
    return response.data;
  },

  /**
   * Adicionar destino à viagem
   */
  async addDestination(tripId: string, data: AddDestinationToTripDto): Promise<ApiResponse<Trip>> {
    const response = await coreApi.post<ApiResponse<Trip>>(
      `/trips/${tripId}/destinations`,
      data
    );
    return response.data;
  },

  /**
   * Remover destino da viagem
   */
  async removeDestination(tripId: string, destinationId: string): Promise<ApiResponse<Trip>> {
    const response = await coreApi.delete<ApiResponse<Trip>>(
      `/trips/${tripId}/destinations/${destinationId}`
    );
    return response.data;
  },
};
