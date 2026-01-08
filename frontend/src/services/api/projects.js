import apiClient from './client';

export const projectsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/projects?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/projects', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/projects/${id}`);
    return response.data;
  },

  getByStudent: async (studentId) => {
    const response = await apiClient.get(`/api/projects/student/${studentId}`);
    return response.data;
  },
};
