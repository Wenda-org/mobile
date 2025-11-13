import { useState, useCallback } from 'react';
import { destinationService } from '../services';
import type { DestinationSummary, DestinationFilters, Destination } from '../types/api.types';

export function useDestinations() {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchDestinations = useCallback(async (filters?: DestinationFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await destinationService.getDestinations(filters);
      setDestinations(response.data);
      setPagination(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar destinos');
      console.error('Erro ao carregar destinos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (filters?: DestinationFilters) => {
    if (!pagination.hasNext || loading) return;

    try {
      setLoading(true);
      const response = await destinationService.getDestinations({
        ...filters,
        page: pagination.currentPage + 1,
      });
      setDestinations((prev) => [...prev, ...response.data]);
      setPagination(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar mais destinos');
      console.error('Erro ao carregar mais destinos:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination, loading]);

  return {
    destinations,
    loading,
    error,
    pagination,
    fetchDestinations,
    loadMore,
  };
}

export function useDestination(id?: string) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDestination = useCallback(async (destinationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await destinationService.getDestinationById(destinationId);
      if (response.success && response.data) {
        setDestination(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar destino');
      console.error('Erro ao carregar destino:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    destination,
    loading,
    error,
    fetchDestination,
  };
}
