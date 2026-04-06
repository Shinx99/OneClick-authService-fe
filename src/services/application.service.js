// services/application.service.js
import { apiClient } from "@/lib/apiClient/api.config"; // Trỏ đúng vào tên file config của bạn

export const applicationService = {
  // Gửi đơn ứng tuyển
  applyJob: async (jobId, resumeId) => {
    // Sử dụng đúng biến apiClient đã được cấu hình Interceptor
    return await apiClient.post("/applications", {
      jobId,
      resumeId,
    });
  },

  // Kiểm tra xem đã ứng tuyển job này chưa
  checkAppliedStatus: async (jobId) => {
    return await apiClient.get(`/applications/check/${jobId}`);
  },
};
