import { apiClient } from "@/lib/apiClient/api.config";

const employerService = {

    async fetchProfile() {
        const { data } = await apiClient.get("/recruitment/employer/fetchData");
        return data.data;
    },

    async fetchTeam() {
        const { data } = await apiClient.get("/recruitment/employer/team");
        return data.data;
    },

    async removeMember(employerId) {
        const { data } = await apiClient.delete(`/recruitment/employer/members/${employerId}`);
        return data; // { success, message }
    },

}

export default employerService;