import apiClient from "@/lib/apiClient/api.config";

export const jobService = {

  // -------------------------------------------------------
  // GET ALL JOBS (PUBLIC)
  // -------------------------------------------------------
  getAllJobs: async () => {
    const { data } = await apiClient.get("/recruitment/job/all");
    return data.data.content; // Unwrap ApiResponse → returns the array of jobs
  },

};
