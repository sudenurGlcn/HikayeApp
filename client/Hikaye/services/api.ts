import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { store } from '../store/store';
import { clearAuth } from '../store/authSlice';
import type { SignUpData, AuthResponse, LoginCredentials } from '../types';

// Expo 49+: Constants.expoConfig; Expo Go: Constants.manifest (deprecated)
const expoExtra: any = (Constants as any).expoConfig?.extra || (Constants as any).manifest?.extra || {};
const { apiBaseUrl } = expoExtra as { apiBaseUrl?: string };

const fallbackBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:5079/api'
  : 'http://localhost:5079/api';

export const api = axios.create({
  baseURL: apiBaseUrl || fallbackBaseUrl,
});

// Request interceptor - header'a token ekle
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - 401'de oturumu temizle
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      store.dispatch(clearAuth());
      // Not: Kullanıcı tercihi Sweet Alert; ekranda UI seviyesi uyarı komponentiyle gösterilebilir.
    }
    if (!error.response) {
      // Ağ hatası / CORS / DNS / Sunucuya ulaşılamadı
      const url = (error.config as any)?.baseURL + (error.config as any)?.url;
      console.log('Network error:', { message: error.message, url });
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  signup: async (data: SignUpData): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/Auth/register', data);
    return res.data;
  },
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/Auth/login', data);
    return res.data;
  },
};

// Books servisleri
export const bookService = {
  latest: async (count: number = 8): Promise<any[]> => {
    const res = await api.get(`/Books/latest`, { params: { count } });
    return res.data;
  },
  detail: async (id: number | string): Promise<any> => {
    const res = await api.get(`/Books/${id}`);
    return res.data;
  },
  startReading: async (childId: number, bookId: number): Promise<any> => {
    const res = await api.post(`/Books/start-reading`, { childId, bookId });
    return res.data; // BookPageResponseDto
  },
  navigatePage: async (payload: { bookId: number; currentPageNumber: number; direction: 'Next' | 'Previous'; childId: number }): Promise<any> => {
    const res = await api.post(`/Books/page/navigate`, payload);
    return res.data; // GetBookPageResponseDto
  },
  addFavorite: async (payload: { childId: number; bookId: number }): Promise<any> => {
    const res = await api.post(`/Books/favorite`, payload);
    return res.data;
  },
  inProgressByChild: async (childId: number): Promise<any[]> => {
    const res = await api.get(`/Books/children/${childId}/in-progress`);
    return res.data;
  },
  favoritesByChild: async (childId: number): Promise<any[]> => {
    const res = await api.get(`/Books/children/${childId}/favorites`);
    return res.data;
  },
  byCategory: async (categoryId: number): Promise<any[]> => {
    const res = await api.get(`/Books/by-category/${categoryId}`);
    return res.data;
  },
  completeBook: async (childId: number, bookId: number): Promise<boolean> => {
    const res = await api.post(`/ReadingProgress/complete`, { childId, bookId });
    return res.data;
  },
};

export const activitiesService = {
  getHint: async (activityId: number): Promise<{ hintText: string }> => {
    const url = `/Activities/${activityId}/hint`;
    try {
      console.log('[activitiesService.getHint] GET', (api.defaults.baseURL || '') + url, { activityId });
      const res = await api.get(url);
      console.log('[activitiesService.getHint] OK', res.status, res.data);
      const data = res.data as any;
      return { hintText: data?.hintText || data?.HintText || '' };
    } catch (e: any) {
      const cfg = e?.config || {};
      console.error('[activitiesService.getHint] ERROR', {
        url: (cfg.baseURL || '') + (cfg.url || url),
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message,
      });
      throw e;
    }
  },
};

// Categories servisleri
export const categoryService = {
  all: async (): Promise<{ id: number; categoryName: string; icon?: string }[]> => {
    const res = await api.get(`/Categories`);
    return res.data;
  },
};

// TODO: Backend bağlantısı yapıldığında aktif edilecek
/*
// Request interceptor - token eklemek için
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi için
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);
*/