import { apiClient } from "@/lib/apiClient/api.config";

export const applicationService = {

  // 1. Ứng tuyển công việc
  applyJob: async (data) => {
    try {
      const response = await apiClient.post('/jobs/apply', {
        jobId: data.jobId,
        resumeId: data.resumeId,
        note: data.note || ''
      });
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Apply job failed');
      return apiResponse;
    } catch (error) {
      console.error("Apply job error:", error);
      throw error;
    }
  },

  // 2. Lấy danh sách công việc đã ứng tuyển
  getMyApplications: async (params = { page: 0, size: 10 }) => {
    try {
      const response = await apiClient.get('/applications/my-applications', { params });
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Failed to fetch applications');
      return apiResponse.data;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },

  // 3. Kiểm tra đã ứng tuyển chưa
  checkApplied: async (jobId) => {
    try {
      const response = await apiClient.get(`/jobs/${jobId}/check-applied`);
      return response.data?.data || false;
    } catch (error) {
      console.error("Check applied error:", error);
      return false;
    }
  },

  // 4. Hủy ứng tuyển
  cancelApplication: async (jobId) => {
    try {
      const response = await apiClient.delete(`/applications/${jobId}`);
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Cancel application failed');
      return apiResponse;
    } catch (error) {
      console.error("Cancel application error:", error);
      throw error;
    }
  },

  // ========== RECRUITER APIs ==========

  // 5. Lấy danh sách jobs của employer
  getMyJobs: async (params = { page: 0, size: 100 }) => {
    try {
      const response = await apiClient.get('/employer/jobs', { params });
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Failed to fetch employer jobs');
      return apiResponse.data || [];
    } catch (error) {
      console.error("Get my jobs error:", error);
      return [];
    }
  },

  // 6. Lấy danh sách ứng viên của 1 job
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
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Failed to fetch job applications');
      return apiResponse.data;
    } catch (error) {
      console.error("Get job applications error:", error);
      throw error;
    }
  },

  // 7. Lấy thống kê ứng viên theo trạng thái
  getApplicationStats: async (jobId) => {
    try {
      const response = await apiClient.get(`/employer/jobs/${jobId}/applications/stats`);
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Failed to fetch application stats');
      return apiResponse.data;
    } catch (error) {
      console.error("Get application stats error:", error);
      throw error;
    }
  },

  // 8. Lấy chi tiết đơn ứng tuyển
  getApplicationDetail: async (applicationId) => {
    try {
      const response = await apiClient.get(`/employer/applications/${applicationId}`);
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Failed to fetch application detail');
      return apiResponse.data;
    } catch (error) {
      console.error("Get application detail error:", error);
      throw error;
    }
  },

  // 9. Cập nhật trạng thái đơn ứng tuyển
  updateApplicationStatus: async (applicationId, data) => {
    try {
      const response = await apiClient.patch(`/employer/applications/${applicationId}/status`, {
        status: data.status,
        note: data.note || '',
        interviewSchedule: data.interviewSchedule || null
      });
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Update status failed');
      return apiResponse;
    } catch (error) {
      console.error("Update application status error:", error);
      throw error;
    }
  },

  // 10. Lấy lịch sử thay đổi trạng thái
  getApplicationHistory: async (applicationId) => {
    try {
      const response = await apiClient.get(`/employer/applications/${applicationId}/history`);
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Failed to fetch application history');
      return apiResponse.data;
    } catch (error) {
      console.error("Get application history error:", error);
      throw error;
    }
  },

  // 11. Lên lịch phỏng vấn
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
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Schedule interview failed');
      return apiResponse.data;
    } catch (error) {
      console.error("Schedule interview error:", error);
      throw error;
    }
  },

  // 12. Hủy lịch phỏng vấn
  cancelInterview: async (scheduleId, reason = '') => {
    try {
      const url = reason
        ? `/employer/schedule-interview/${scheduleId}?reason=${encodeURIComponent(reason)}`
        : `/employer/schedule-interview/${scheduleId}`;
      const response = await apiClient.delete(url);
      const apiResponse = response.data;
      if (!apiResponse?.success) throw new Error(apiResponse?.message || 'Cancel interview failed');
      return apiResponse;
    } catch (error) {
      console.error("Cancel interview error:", error);
      throw error;
    }
  },
};