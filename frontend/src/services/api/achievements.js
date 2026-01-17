import apiClient from "./client";

export const achievementsApi = {
  // Get all achievements with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/achievements?${params}`);
    return response.data;
  },

  // Get a single achievement by ID
  getById: async (id) => {
    const response = await apiClient.get(`/api/achievements/${id}`);
    return response.data;
  },

  // Create a new achievement (Student only)
  create: async (data) => {
    const response = await apiClient.post("/api/achievements", data);
    return response.data;
  },

  // Update an existing achievement (Student only)
  update: async (id, data) => {
    const response = await apiClient.put(`/api/achievements/${id}`, data);
    return response.data;
  },

  // Delete an achievement (Student only)
  delete: async (id) => {
    const response = await apiClient.delete(`/api/achievements/${id}`);
    return response.data;
  },

  // Get achievements for a specific student
  getByStudent: async (studentId) => {
    const response = await apiClient.get(
      `/api/achievements/student/${studentId}`
    );
    return response.data;
  },

  // Get pending verifications (College only)
  getPending: async () => {
    const response = await apiClient.get("/api/achievements/pending");
    return response.data;
  },

  // Verify or reject an achievement (College only)
  verify: async (id, status, comments) => {
    const response = await apiClient.post(`/api/achievements/${id}/verify`, {
      status,
      comments,
    });
    return response.data;
  },
};

export default achievementsApi;
