// Import cái apiClient xịn xò của bạn vào đây
import { apiClient } from "./api.config";

export const authService = {
  // Gửi dữ liệu Đăng nhập
  login: async (credentials) => {
    // ⚠️ LƯU Ý QUAN TRỌNG:
    // Vì baseURL của bạn đã có sẵn chữ '/api' ở cuối rồi
    // Nên ở đây ta chỉ cần gọi '/auth/login' thôi, tránh bị lỗi '/api/api/auth/login'
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  // Gửi dữ liệu Đăng ký
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
};
