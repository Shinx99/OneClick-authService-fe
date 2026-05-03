// src/services/adminCompany.service.js
import apiClient from '@/lib/apiClient/api.config.js';

export const adminCompanyService = {
  /**
   * GET /api/admin/company
   * Lấy danh sách công ty (phân trang, tìm kiếm, lọc)
   * @param {Object} params - { keyword, status, provinceCode, industry, sizeRange, page, size, sortBy, sortDir }
   * @returns PageResponse<AdminCompanyResponseDto>
   */
  getCompanies: async (params = {}) => {
    const response = await apiClient.get('/admin/company', { params });
    return response.data; // { success, data: PageResponse }
  },

  /**
   * PUT /api/admin/company/{companyId}/approve
   * Duyệt công ty — status chuyển thành "active"
   * Side effect: Tạo notification COMPANY_APPROVED cho owner
   * @param {string} companyId - UUID
   * @returns AdminCompanyResponseDto
   */
  approveCompany: async (companyId) => {
    const response = await apiClient.put(`/admin/company/${companyId}/approve`);
    return response.data;
  },

  /**
   * PUT /api/admin/company/{companyId}/reject
   * Từ chối công ty — status chuyển thành "rejected"
   * Side effect: Tạo notification COMPANY_REJECTED cho owner
   * @param {string} companyId - UUID
   * @returns AdminCompanyResponseDto
   */
  rejectCompany: async (companyId) => {
    const response = await apiClient.put(`/admin/company/${companyId}/reject`);
    return response.data;
  },
};
