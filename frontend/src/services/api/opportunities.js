import apiClient from './client';

export const opportunitiesApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/opportunities?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/opportunities/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/opportunities', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/opportunities/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/opportunities/${id}`);
    return response.data;
  },

  toggleStatus: async (id, isActive) => {
    const response = await apiClient.patch(`/api/opportunities/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  getByRecruiter: async (recruiterId) => {
    const response = await apiClient.get(`/api/opportunities/recruiter/${recruiterId}`);
    return response.data;
  },
};
