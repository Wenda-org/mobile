import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Default API fallback URL (typically the local dev machine IP for physical devices or emulator localhost)
export const CORE_API_URL = 'http://192.168.100.10:3000/api';

const coreApi = axios.create({
  baseURL: CORE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
coreApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@wenda_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Ignore
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 Unauthorized)
coreApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Clear auth cache
        await AsyncStorage.multiRemove(['@wenda_access_token', '@wenda_user']);
      } catch (e) {
        // Ignore
      }
      
      // Redirect to login screen
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export default coreApi;
