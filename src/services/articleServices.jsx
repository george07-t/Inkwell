import api from './api';
import { authService } from './authService';

export const articleService = {
  // Public articles (no auth required)
  getPublicArticles: async (page = 1, pageSize = 10) => {
    const response = await api.get(`/articles/public_articles/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  getPublicArticle: async (idOrSlug) => {
    const response = await api.get(`/articles/public_articles/${idOrSlug}/`);
    return response.data;
  },

  // User articles (auth required)
  getUserArticles: async (userId, page = 1, pageSize = 10) => {
    const response = await api.get(`/articles/user_articles/${userId}/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  getUserArticle: async (userId, idOrSlug) => {
    const response = await api.get(`/articles/user_articles/${userId}/${idOrSlug}/`);
    return response.data;
  },

  // Article CRUD operations
  createArticle: async (articleData) => {
    const response = await api.post('/articles/create/', articleData);
    return response.data;
  },

  updateArticle: async (userId, id, articleData) => {
    const response = await api.patch(`/articles/user_articles/${userId}/${id}/`, articleData);
    return response.data;
  },

  deleteArticle: async (userId, id) => {
    const response = await api.delete(`/articles/user_articles/${userId}/${id}/`);
    return response.data;
  },

  // Convenience methods for current user
  getMyArticles: async () => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return await articleService.getUserArticles(user.id);
  },

  getMyArticle: async (idOrSlug) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return await articleService.getUserArticle(user.id, idOrSlug);
  },

  updateMyArticle: async (id, articleData) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return await articleService.updateArticle(user.id, id, articleData);
  },

  deleteMyArticle: async (id) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return await articleService.deleteArticle(user.id, id);
  },

  // Legacy methods for backward compatibility
  getArticles: async (page = 1, pageSize = 10) => {
    return await articleService.getPublicArticles(page, pageSize);
  },

  getArticle: async (idOrSlug) => {
    // Try to get from user's articles first (if authenticated), then public
    const user = authService.getCurrentUser();
    if (user) {
      try {
        return await articleService.getUserArticle(user.id, idOrSlug);
      } catch (error) {
        if (error.response?.status === 404) {
          // If not found in user's articles, try public
          return await articleService.getPublicArticle(idOrSlug);
        }
        throw error;
      }
    } else {
      return await articleService.getPublicArticle(idOrSlug);
    }
  },
};