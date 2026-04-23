import { apiClient } from "@/lib/apiClient/api.config";

const educationService = {
    async getAll() {
        const { data } = await apiClient.get("/recruitment/candidate/education");
        return data.data;
    },

    async create(payload) {
        const { data } = await apiClient.post("/recruitment/candidate/education", payload);
        return data.data;
    },

    async update(educationId, payload) {
        const { data } = await apiClient.put(`/recruitment/candidate/education/${educationId}`, payload);
        return data.data;
    },

    async delete(educationId) {
        await apiClient.delete(`/recruitment/candidate/education/${educationId}`);
    },

    async uploadImage(educationId, file) {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await apiClient.post(
            `/recruitment/candidate/education/${educationId}/image`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return data.data;
    },

    async deleteImage(educationId) {
        await apiClient.delete(`/recruitment/candidate/education/${educationId}/image`);
    },

    async uploadTemporaryImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await apiClient.post(
        `/recruitment/candidate/education/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
}
};

export default educationService;