import apiClient from './client';

export const achievementsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/achievements?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/achievements/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/achievements', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/achievements/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/achievements/${id}`);
    return response.data;
  },

  getByStudent: async (studentId) => {
    const response = await apiClient.get(`/api/achievements/student/${studentId}`);
    return response.data;
  },

  getPending: async () => {
    const response = await apiClient.get('/api/achievements/pending');
    return response.data;
  },

  verify: async (id, status, comments) => {
    const response = await apiClient.post(`/api/achievements/${id}/verify`, {
      status,
      comments,
    });
    return response.data;
  },
};
