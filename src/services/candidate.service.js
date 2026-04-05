import { apiClient } from "@/lib/apiClient/api.config";

const candidateService = {
    async fetchProfile() {
        const { data } = await apiClient.get("/recruitment/candidate/profile/fetchData");
        return data.data;
    },

    async updateProfile(payload) {
        const { data } = await apiClient.put("/recruitment/candidate/profile/update", payload);
        return data.data;
    },

    async updateAvatar(file) {
        const formData = new FormData();
        formData.append("avatarImage", file);
        const { data } = await apiClient.put("/recruitment/candidate/profile/avatar/update", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return data.data;
    },

    async updateBackground(file) {
        const formData = new FormData();
        formData.append("backgroundImage", file);
        const { data } = await apiClient.put("/recruitment/candidate/profile/background/update", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return data.data;
    }
};

export default candidateService;