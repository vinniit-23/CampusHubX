import apiClient from "./client";

export const skillsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/skills?${params}`);
    return response.data;
  },

  // 🛠️ ADD THIS METHOD
  create: async (data) => {
    const response = await apiClient.post("/api/skills", data);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/skills/${id}`);
    return response.data;
  },

  getByCategory: async () => {
    const response = await apiClient.get("/api/skills/categories");
    return response.data;
  },
};
