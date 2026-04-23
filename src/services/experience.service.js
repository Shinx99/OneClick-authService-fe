import { apiClient } from "@/lib/apiClient/api.config";

const experienceService = {
    // Lấy danh sách công ty để autocomplete
    async searchCompanies(keyword) {
        if (!keyword || keyword.trim().length < 2) return [];
        const { data } = await apiClient.get(`/recruitment/companies/search?keyword=${encodeURIComponent(keyword)}`);
        return data.data || [];
    },

};

export default experienceService;