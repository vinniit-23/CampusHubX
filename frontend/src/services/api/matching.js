import apiClient from './client';

export const matchingApi = {
  getMatchedOpportunities: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/matching/opportunities?${params}`);
    return response.data;
  },

  getMatchedStudents: async (opportunityId, filters = {}) => {
    const params = new URLSearchParams({ ...filters, opportunityId });
    const response = await apiClient.get(`/api/matching/students?${params}`);
    return response.data;
  },

  getMatchDetails: async (studentId, opportunityId) => {
    const response = await apiClient.get(
      `/api/matching/details?studentId=${studentId}&opportunityId=${opportunityId}`
    );
    return response.data;
  },
};
