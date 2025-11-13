import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Core API Configuration (Backend principal)
export const coreApi = axios.create({
//   baseURL: 'http://192.168.100.220:3000/api',
  baseURL: 'https://backend-core-v42h.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ML API Configuration (Backend de Machine Learning)
export const mlApi = axios.create({
  baseURL: 'https://backend-ml-c75p.onrender.com/api/ml',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // ML pode demorar mais
});

// Interceptor para adicionar token automaticamente nas requisições do Core API
coreApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@wenda_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log da requisição em desenvolvimento
      if (__DEV__) {
        console.log(`[Core API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.data) {
          console.log('[Core API] Request data:', JSON.stringify(config.data, null, 2));
        }
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta do Core API
coreApi.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[Core API] Response ${response.status}:`, response.data);
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      console.error('[Core API] Error:', error.message);
      console.error('[Core API] Error response:', error.response?.data);
      console.error('[Core API] Error status:', error.response?.status);
    }
    
    if (error.response?.status === 401) {
      // Token inválido ou expirado - fazer logout
      await AsyncStorage.removeItem('@wenda_access_token');
      await AsyncStorage.removeItem('@wenda_user');
    }
    return Promise.reject(error);
  }
);

// Interceptor de log para ML API (desenvolvimento)
if (__DEV__) {
  mlApi.interceptors.request.use(
    (config) => {
      console.log(`[ML API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default { coreApi, mlApi };
