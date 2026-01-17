import apiClient from "./client";

export const studentsApi = {
  getProfile: async () => {
    const response = await apiClient.get("/api/students/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put("/api/students/profile", data);
    return response.data;
  },

  getPublicProfile: async (id) => {
    const response = await apiClient.get(`/api/students/${id}`);
    return response.data;
  },

  getSkills: async () => {
    const response = await apiClient.get("/api/students/profile");
    return response.data.data?.skills || [];
  },

  addSkill: async (skillId) => {
    const response = await apiClient.post("/api/students/profile", {
      skills: [skillId],
    });
    return response.data;
  },

  getProjects: async () => {
    const response = await apiClient.get("/api/projects");
    return response.data;
  },

  getAchievements: async () => {
    const response = await apiClient.get("/api/achievements");
    return response.data;
  },

  getApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(
      `/api/students/applications?${params}`
    );
    return response.data;
  },

  getMatches: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(
      `/api/matching/opportunities?${params}`
    );
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get("/api/students/dashboard");
    return response.data;
  },

  addSkill: async (skillId) => {
    // 🔴 OLD: const response = await apiClient.post('/api/students/profile', ...
    // 🟢 NEW: Point to the /skills endpoint we just created
    const response = await apiClient.post("/api/students/skills", {
      skills: [skillId],
    });
    return response.data;
  },
};
