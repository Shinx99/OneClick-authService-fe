// src/services/company.service.js
import api from '../lib/apiClient/api.config';

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

  getAllCompanies: async (params) => {
    const response = await api.get('recruitment/company/all', { params });
    return response.data;
  },

    getCompanyById: async (companyId) => {
    const response = await api.get(`/recruitment/company/${companyId}`);
    return response.data;
  },

  getCompanyFilters: async () => {
    try {
      const response = await api.get('recruitment/company/filters');
      return response.data;
    } catch (error) {
      console.error("Error fetching filters:", error);
      throw error;
    }
  },

  getJobsByCompanyId: async (companyId, params) => {
    try {
      const response = await api.get(`/recruitment/company/${companyId}/jobs`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      throw error;
    }
  },

  // -------------------------------------------------------
  // UPLOAD COMPANY LOGO (ROLE_recruiter)
  // PUT /api/recruitment/company/logo/upload
  // -------------------------------------------------------
  uploadCompanyLogo: async (file) => {
    const formData = new FormData();
    formData.append("logoImage", file);

    const response = await api.put("recruitment/company/logo/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, message, data: CompanyDTO }
  },

  // -------------------------------------------------------
  // UPLOAD COMPANY BACKGROUND (ROLE_recruiter)
  // PUT /api/recruitment/company/background/upload
  // -------------------------------------------------------
  uploadCompanyBackground: async (file) => {
    const formData = new FormData();
    formData.append("backgroundImage", file);

    const response = await api.put("recruitment/company/background/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, message, data: CompanyDTO }
  },
};