import apiClient from "@/lib/apiClient/api.config";

export const jobService = {

  // -------------------------------------------------------
  // GET ALL JOBS (PUBLIC) — with filter / pagination params
  // -------------------------------------------------------
  getAllJobs: async (params = {}) => {
    // Strip out undefined/null/empty-string values so they are not sent as query params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );

    const { data } = await apiClient.get("/recruitment/job/all", {
      params: cleanParams,
    });

    // Return the full paginated wrapper { content, page, size, totalElements, totalPages, last }
    return data.data;
  },

};
