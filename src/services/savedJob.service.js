import apiClient from '@/lib/apiClient/api.config';

export const savedJobService = {
  saveJob: async (jobId) => {
    const response = await apiClient.post(`/recruitment/saved-job/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId) => {
    const response = await apiClient.delete(`/recruitment/saved-job/${jobId}`);
    return response.data;
  },

  checkSaved: async (jobId) => {
    try {
      const response = await apiClient.get(`/recruitment/saved-job/${jobId}/check`);
      return response.data;
    } catch (error) {
       if (error.response?.status === 401 || error.response?.status === 404) {
        return { success: true, data: { isSaved: false } };
      }
      return null;
    }
  },

  getSavedJobs: async () => {
    const response = await apiClient.get('/recruitment/saved-job');
    return response.data;
  }
};