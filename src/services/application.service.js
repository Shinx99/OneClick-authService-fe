import { apiClient, getAccessToken } from "@/lib/apiClient/api.config";

export const applicationService = {
  /**
   * 1. Ứng tuyển công việc
   * POST /api/jobs/apply
   */
  applyJob: async (data) => {
    try {
      // Dùng apiClient đã có interceptor xử lý token
      const response = await apiClient.post('/jobs/apply', {
        jobId: data.jobId,
        resumeId: data.resumeId,
        note: data.note || ''
      });
      
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Apply job failed');
      }
      
      return apiResponse;
    } catch (error) {
      console.error("Apply job error:", error);
      throw error;
    }
  },

  /**
   * 2. Lấy danh sách công việc đã ứng tuyển của candidate hiện tại
   * GET /api/applications/my-applications
   */
  getMyApplications: async (params = { page: 0, size: 10 }) => {
    try {
      const response = await apiClient.get('/applications/my-applications', { params });
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch applications');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },

  /**
   * 3. Kiểm tra đã ứng tuyển công việc chưa
   * GET /api/jobs/{jobId}/check-applied
   */
  checkApplied: async (jobId) => {
    try {
      const response = await apiClient.get(`/jobs/${jobId}/check-applied`);
      const apiResponse = response.data;
      
      return apiResponse?.data || false;
    } catch (error) {
      console.error("Check applied error:", error);
      return false;
    }
  },

  /**
   * 4. Lấy danh sách ứng viên của 1 job (cho employer)
   * GET /api/employer/jobs/{jobId}/applications
   */
  getJobApplications: async (jobId) => {
    try {
      const response = await apiClient.get(`/employer/jobs/${jobId}/applications`);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch job applications');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error("Get job applications error:", error);
      throw error;
    }
  },

  /**
   * 5. Cập nhật trạng thái đơn ứng tuyển (cho employer)
   * PATCH /api/employer/applications/{jobId}/{candidateId}/status?status={status}&note={note}
   */
  updateApplicationStatus: async (jobId, candidateId, status, note) => {
    try {
      let url = `/employer/applications/${jobId}/${candidateId}/status?status=${encodeURIComponent(status)}`;
      if (note) {
        url += `&note=${encodeURIComponent(note)}`;
      }
      
      const response = await apiClient.patch(url);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Update status failed');
      }
      
      return apiResponse;
    } catch (error) {
      console.error("Update application status error:", error);
      throw error;
    }
  },

  /**
   * 6. Hủy ứng tuyển
   * DELETE /api/applications/{jobId}
   */
  cancelApplication: async (jobId) => {
    try {
      const response = await apiClient.delete(`/applications/${jobId}`);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Cancel application failed');
      }
      
      return apiResponse;
    } catch (error) {
      console.error("Cancel application error:", error);
      throw error;
    }
  }
};