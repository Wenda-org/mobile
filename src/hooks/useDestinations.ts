import { useQuery } from '@tanstack/react-query';
import { destinationService, GetDestinationsParams } from '../services/destinationService';

export const useDestinations = (params?: GetDestinationsParams) => {
  const destinationsQuery = useQuery({
    queryKey: ['destinations', params],
    queryFn: () => destinationService.getDestinations(params),
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => destinationService.getCategories(),
  });

  return {
    destinations: destinationsQuery.data || [],
    isLoadingDestinations: destinationsQuery.isLoading,
    isRefetchingDestinations: destinationsQuery.isRefetching,
    destinationsError: destinationsQuery.error,
    refetchDestinations: destinationsQuery.refetch,

    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    categoriesError: categoriesQuery.error,
    refetchCategories: categoriesQuery.refetch,
  };
};

export const useDestinationDetail = (id: string) => {
  const query = useQuery({
    queryKey: ['destination', id],
    queryFn: () => destinationService.getDestinationById(id),
    enabled: !!id,
  });

  return {
    destination: query.data,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
  };
};
