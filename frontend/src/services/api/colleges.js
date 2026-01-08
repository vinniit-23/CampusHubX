import apiClient from './client';

export const collegesApi = {
  getAll: async () => {
    const response = await apiClient.get('/api/colleges');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/colleges/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/api/colleges/profile', data);
    return response.data;
  },

  getStudents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/colleges/:id/students?${params}`);
    return response.data;
  },

  getPendingVerifications: async () => {
    const response = await apiClient.get('/api/colleges/verifications');
    return response.data;
  },
};
