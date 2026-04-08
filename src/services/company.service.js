// src/services/company.service.js
import api from '../lib/apiClient/api.config';

// Chú ý: Phải có từ khóa 'export' ngay trước 'const companyService'
export const companyService = {
  // Lấy Top 6 công ty hàng đầu
  getTop6Companies: async () => {
    try {
      const response = await api.get('recruitment/company/top-6');
      return response.data; // Trả về ApiResponse từ Backend { success, data, message }
    } catch (error) {
      console.error("Error fetching top companies:", error);
      throw error;
    }
  },

  // Bạn có thể thêm các hàm khác ở đây
  getAllCompanies: async (params) => {
    const response = await api.get('recruitment/company/all', { params });
    return response.data;
  }
};