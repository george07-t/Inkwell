import api from './api';

export const articleService = {
  getArticles: async (page = 1, pageSize = 10) => {
    const response = await api.get(`/articles/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  getArticle: async (idOrSlug) => {
    const response = await api.get(`/articles/${idOrSlug}/`);
    return response.data;
  },

  getMyArticles: async () => {
    const response = await api.get('/articles/my_articles/');
    return response.data;
  },

  createArticle: async (articleData) => {
    const response = await api.post('/articles/', articleData);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const response = await api.put(`/articles/${id}/`, articleData);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}/`);
    return response.data;
  },
};