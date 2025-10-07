import { DidYouKnow, Story, StoryDetails } from '../types';
import { api } from './api';

export const storyService = {
  // Rastgele bir "Bunu Biliyor Muydun?" getir
  getRandomDidYouKnow: async () => {
    const response = await api.get('/did-you-know/random');
    return response.data as DidYouKnow;
  },

  // Blog detayını getir
  getBlogDetail: async (id: string) => {
    const response = await api.get(`/did-you-know/${id}`);
    return response.data as DidYouKnow;
  },
  // Tüm hikayeleri getir
  getStories: async () => {
    const response = await api.get('/stories');
    return response.data as Story[];
  },

  // Yeni hikayeleri getir
  getNewStories: async () => {
    const response = await api.get('/stories/new');
    return response.data as Story[];
  },

  // Hikaye detayını getir
  getStoryById: async (id: string) => {
    const response = await api.get(`/stories/${id}/details`);
    return response.data as Story;
  },

  // Hikaye ara
  searchStories: async (query: string) => {
    const response = await api.get(`/stories/search?q=${query}`);
    return response.data as Story[];
  },

  // Favorilere ekle
  addToFavorites: async (storyId: string) => {
    const response = await api.post(`/stories/${storyId}/favorite`);
    return response.data;
  },

  // Favorilerden çıkar
  removeFromFavorites: async (storyId: string) => {
    const response = await api.delete(`/stories/${storyId}/favorite`);
    return response.data;
  },

  // Favori durumunu kontrol et
  checkFavoriteStatus: async (storyId: string) => {
    const response = await api.get(`/stories/${storyId}/favorite`);
    return response.data.isFavorite as boolean;
  },

  // Hikaye okuma başlat
  startReading: async (storyId: string) => {
    const response = await api.post(`/stories/${storyId}/start-reading`);
    return response.data;
  },

  // Hikaye detaylarını getir (bölümler, etkinlikler vb.)
  getStoryDetails: async (storyId: string) => {
    const response = await api.get(`/stories/${storyId}/full-details`);
    return response.data as StoryDetails;
  },
};