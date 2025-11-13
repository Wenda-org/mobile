/**
 * EXEMPLO DE USO DOS SERVIÇOS DE API
 * 
 * Este arquivo demonstra como usar os serviços de API em seus componentes.
 * Copie e adapte os exemplos conforme necessário.
 */

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authService,
  destinationService,
  categoryService,
  favoriteService,
  reviewService,
  tripService,
  mlService,
} from '../services';

// ========== EXEMPLO 1: LOGIN E REGISTRO ==========

export function LoginExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        // Salvar token e usuário
        await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
        await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));

        console.log('Login bem-sucedido:', response.data.user);
        // Navegar para tela principal
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register({
        name,
        email,
        password,
        confirmPassword: password,
      });

      if (response.success && response.data) {
        // Salvar token e usuário
        await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
        await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));

        console.log('Registro bem-sucedido:', response.data.user);
        // Navegar para tela principal
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
      console.error('Erro no registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, loading, error };
}

// ========== EXEMPLO 2: LISTAR DESTINOS ==========

export function DestinationsExample() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadDestinations = async () => {
    try {
      setLoading(true);

      const response = await destinationService.getDestinations({
        page,
        perPage: 20,
        province: 'Luanda', // Filtro opcional
        sortBy: 'rating', // ou 'popular' ou 'recent'
      });

      if (response.success) {
        setDestinations(response.data);
        console.log('Total de destinos:', response.meta.total);
        console.log('Tem próxima página?', response.meta.hasNext);
      }
    } catch (err) {
      console.error('Erro ao carregar destinos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [page]);

  return { destinations, loading, loadDestinations, setPage };
}

// ========== EXEMPLO 3: DETALHES DO DESTINO ==========

export function DestinationDetailsExample(destinationId: string) {
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestination = async () => {
      try {
        setLoading(true);
        const response = await destinationService.getDestinationById(destinationId);

        if (response.success && response.data) {
          setDestination(response.data);
          console.log('Destino:', response.data);
        }
      } catch (err) {
        console.error('Erro ao carregar destino:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [destinationId]);

  return { destination, loading };
}

// ========== EXEMPLO 4: FAVORITOS ==========

export function FavoritesExample() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  // Carregar todos os favoritos
  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites();
      if (response.success && response.data) {
        setFavorites(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  };

  // Verificar se destino é favorito
  const checkFavorite = async (destinationId: string) => {
    try {
      const response = await favoriteService.checkFavorite(destinationId);
      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite);
        setFavoriteId(response.data.favoriteId || null);
      }
    } catch (err) {
      console.error('Erro ao verificar favorito:', err);
    }
  };

  // Adicionar favorito
  const addFavorite = async (destinationId: string) => {
    try {
      const response = await favoriteService.addFavorite({ destinationId });
      if (response.success && response.data) {
        setIsFavorite(true);
        setFavoriteId(response.data.id);
        console.log('Favorito adicionado!');
      }
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err);
    }
  };

  // Remover favorito
  const removeFavorite = async (favId: string) => {
    try {
      const response = await favoriteService.removeFavorite(favId);
      if (response.success) {
        setIsFavorite(false);
        setFavoriteId(null);
        console.log('Favorito removido!');
      }
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
    }
  };

  return {
    favorites,
    isFavorite,
    favoriteId,
    loadFavorites,
    checkFavorite,
    addFavorite,
    removeFavorite,
  };
}

// ========== EXEMPLO 5: REVIEWS ==========

export function ReviewsExample(destinationId: string) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar reviews do destino
  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviewsByDestination(destinationId, {
        page: 1,
        perPage: 10,
      });

      if (response.success) {
        setReviews(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar review
  const createReview = async (rating: number, comment: string) => {
    try {
      const response = await reviewService.createReview({
        destinationId,
        rating,
        comment,
        visitDate: new Date().toISOString(),
      });

      if (response.success && response.data) {
        console.log('Review criada!', response.data);
        loadReviews(); // Recarregar reviews
      }
    } catch (err) {
      console.error('Erro ao criar review:', err);
    }
  };

  // Marcar review como útil
  const markAsHelpful = async (reviewId: string) => {
    try {
      const response = await reviewService.markAsHelpful(reviewId);
      if (response.success) {
        console.log('Review marcada como útil!');
        loadReviews(); // Recarregar para atualizar contagem
      }
    } catch (err) {
      console.error('Erro ao marcar review:', err);
    }
  };

  return { reviews, loading, loadReviews, createReview, markAsHelpful };
}

// ========== EXEMPLO 6: VIAGENS ==========

export function TripsExample() {
  const [trips, setTrips] = useState<any[]>([]);

  // Listar viagens
  const loadTrips = async () => {
    try {
      const response = await tripService.getTrips();
      if (response.success && response.data) {
        setTrips(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar viagens:', err);
    }
  };

  // Criar viagem
  const createTrip = async () => {
    try {
      const response = await tripService.createTrip({
        title: 'Férias em Luanda',
        description: 'Explorando a capital',
        startDate: '2025-12-01',
        endDate: '2025-12-10',
      });

      if (response.success && response.data) {
        console.log('Viagem criada!', response.data);
        loadTrips();
      }
    } catch (err) {
      console.error('Erro ao criar viagem:', err);
    }
  };

  // Adicionar destino à viagem
  const addDestinationToTrip = async (tripId: string, destinationId: string) => {
    try {
      const response = await tripService.addDestination(tripId, {
        destinationId,
        visitDate: '2025-12-02',
        notes: 'Visitar de manhã',
      });

      if (response.success) {
        console.log('Destino adicionado à viagem!');
        loadTrips();
      }
    } catch (err) {
      console.error('Erro ao adicionar destino à viagem:', err);
    }
  };

  return { trips, loadTrips, createTrip, addDestinationToTrip };
}

// ========== EXEMPLO 7: MACHINE LEARNING - PREVISÃO ==========

export function ForecastExample() {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getForecast = async (province: string, month: number, year: number) => {
    try {
      setLoading(true);

      const response = await mlService.forecast({
        province,
        month,
        year,
      });

      setForecast(response);
      console.log('Previsão de visitantes:', response.predicted_visitors);
      console.log('Intervalo de confiança:', response.confidence_interval);
    } catch (err) {
      console.error('Erro ao obter previsão:', err);
    } finally {
      setLoading(false);
    }
  };

  return { forecast, loading, getForecast };
}

// ========== EXEMPLO 8: MACHINE LEARNING - RECOMENDAÇÕES ==========

export function RecommendationsExample() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    try {
      setLoading(true);

      const response = await mlService.getRecommendations({
        user_preferences: {
          preferred_categories: ['natural', 'historical'],
          preferred_provinces: ['Luanda', 'Benguela'],
          max_distance_km: 100,
        },
        top_n: 10,
      });

      setRecommendations(response.recommendations);
      console.log('Recomendações recebidas:', response.recommendations.length);
    } catch (err) {
      console.error('Erro ao obter recomendações:', err);
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, getRecommendations };
}

// ========== EXEMPLO 9: CATEGORIAS ==========

export function CategoriesExample() {
  const [categories, setCategories] = useState<any[]>([]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        console.log('Categorias:', response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loadCategories };
}
