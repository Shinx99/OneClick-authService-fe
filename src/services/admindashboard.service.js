import apiClient from '@/lib/apiClient/api.config.js';

export const dashboardService = {
  getAdminCounts: async (month = null) => {
    const params = month ? { month } : {};
    const response = await apiClient.get('/admin/dashboard/counts', { params });
    // Vì ApiResponse wrapper có trường 'data' chứa dữ liệu thực tế
    return response.data.data; // { totalCandidates, totalCompanies, totalJobs }
  },

  // dashboard.service.js
  getGrowthData: async (months = 6) => {
    const response = await apiClient.get('/admin/dashboard/growth', {
        params: { months }
    });
    return response.data.data; // { growthData: [...] }
  },

  getRecentActivitiesGrouped: async () => {
    const response = await apiClient.get('/admin/dashboard/activities/grouped');
    return response.data.data;
  }
};