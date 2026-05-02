import { apiClient } from "@/lib/apiClient/api.config";

const employerService = {
    async fetchProfile() {
        const { data } = await apiClient.get("/recruitment/employer/fetchData");
        return data.data;
    }
}

export default employerService;