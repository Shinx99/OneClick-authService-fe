import { apiClient } from "@/lib/apiClient/api.config";

const adminService = {
    async getCandidates({ page = 0, size = 10, status = "all", keyword = "" } = {}) {
        const params = { page, size };
        if (status && status !== "all") params.status = status;
        if (keyword) params.keyword = keyword;
        const { data } = await apiClient.get("/admin/users/candidates", { params });
        return data.data;
    },

    async getCandidateDetail(candidateId) {
        const { data } = await apiClient.get(`/admin/users/candidates/${candidateId}`);
        return data.data;
    },

    async updateCandidateStatus(candidateId, status) {
        const { data } = await apiClient.put(`/admin/users/candidates/${candidateId}/status?status=${status}`);
        return data;
    },

    async getEmployers({ page = 0, size = 10, status = "all", keyword = "" } = {}) {
        const params = { page, size };
        if (status && status !== "all") params.status = status;
        if (keyword) params.keyword = keyword;
        const { data } = await apiClient.get("/admin/users/employers", { params });
        return data.data;
    },

    async getEmployerDetail(employerId) {
        const { data } = await apiClient.get(`/admin/users/employers/${employerId}`);
        return data.data;
    },

    async updateEmployerStatus(employerId, status) {
        const { data } = await apiClient.put(`/admin/users/employers/${employerId}/status?status=${status}`);
        return data;
    },
};

export default adminService;