import { apiClient, getAccessToken } from "@/lib/apiClient/api.config";

export const applicationService = {
  /**
   * 1. Ứng tuyển công việc
   * POST /api/jobs/apply
   */
  applyJob: async (data) => {
    try {
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
   * 4. Hủy ứng tuyển
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
  },

  // ========== RECRUITER APIs ==========

  /**
   * 5. Lấy danh sách jobs của employer hiện tại
   * GET /api/employer/jobs
   */
  getMyJobs: async (params = { page: 0, size: 100 }) => {
    try {
      const response = await apiClient.get('/employer/jobs', { params });
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch employer jobs');
      }
      
      return apiResponse.data || [];
    } catch (error) {
      console.error("Get my jobs error:", error);
      return [];
    }
  },

  /**
   * 6. Lấy danh sách ứng viên của 1 job (cho employer) - Có phân trang và lọc
   * GET /api/employer/jobs/{jobId}/applications?page=0&size=20&status=pending&keyword=&sortBy=appliedAt&sortDir=DESC
   */
  getJobApplications: async (jobId, filters = {}) => {
    try {
      const params = {
        page: filters.page || 0,
        size: filters.size || 20,
        status: filters.status || '',
        keyword: filters.keyword || '',
        sortBy: filters.sortBy || 'appliedAt',
        sortDir: filters.sortDir || 'DESC'
      };
      
      const response = await apiClient.get(`/employer/jobs/${jobId}/applications`, { params });
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
   * 7. Lấy thống kê số lượng ứng viên theo trạng thái
   * GET /api/employer/jobs/{jobId}/applications/stats
   */
  getApplicationStats: async (jobId) => {
    try {
      const response = await apiClient.get(`/employer/jobs/${jobId}/applications/stats`);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch application stats');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error("Get application stats error:", error);
      throw error;
    }
  },

  /**
   * 8. Lấy chi tiết đơn ứng tuyển
   * GET /api/employer/applications/{applicationId}
   */
  getApplicationDetail: async (applicationId) => {
    try {
      const response = await apiClient.get(`/employer/applications/${applicationId}`);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch application detail');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error("Get application detail error:", error);
      throw error;
    }
  },

  /**
   * 9. Cập nhật trạng thái đơn ứng tuyển (cho employer)
   * PATCH /api/employer/applications/{applicationId}/status
   * Body: { status, note, interviewSchedule? }
   */
  updateApplicationStatus: async (applicationId, data) => {
    try {
      const response = await apiClient.patch(`/employer/applications/${applicationId}/status`, {
        status: data.status,
        note: data.note || '',
        interviewSchedule: data.interviewSchedule || null
      });
      
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
   * 10. Lấy lịch sử thay đổi trạng thái của đơn ứng tuyển
   * GET /api/employer/applications/{applicationId}/history
   */
  getApplicationHistory: async (applicationId) => {
    try {
      const response = await apiClient.get(`/employer/applications/${applicationId}/history`);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch application history');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error("Get application history error:", error);
      throw error;
    }
  },

  /**
   * 11. Lên lịch phỏng vấn
   * POST /api/employer/applications/{applicationId}/schedule-interview
   * Body: { scheduledTime, durationMinutes, meetingLink, meetingPassword, location, interviewType, interviewerName, interviewerEmail, notes }
   */
  scheduleInterview: async (applicationId, data) => {
    try {
      const response = await apiClient.post(`/employer/applications/${applicationId}/schedule-interview`, {
        scheduledTime: data.scheduledTime,
        durationMinutes: data.durationMinutes || 60,
        meetingLink: data.meetingLink,
        meetingPassword: data.meetingPassword,
        location: data.location,
        interviewType: data.interviewType || 'TECHNICAL',
        interviewerName: data.interviewerName,
        interviewerEmail: data.interviewerEmail,
        notes: data.notes
      });
      
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Schedule interview failed');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error("Schedule interview error:", error);
      throw error;
    }
  },

  /**
   * 12. Hủy lịch phỏng vấn
   * DELETE /api/employer/schedule-interview/{scheduleId}?reason={reason}
   */
  cancelInterview: async (scheduleId, reason = '') => {
    try {
      let url = `/employer/schedule-interview/${scheduleId}`;
      if (reason) {
        url += `?reason=${encodeURIComponent(reason)}`;
      }
      
      const response = await apiClient.delete(url);
      const apiResponse = response.data;
      
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Cancel interview failed');
      }
      
      return apiResponse;
    } catch (error) {
      console.error("Cancel interview error:", error);
      throw error;
    }
  }
};