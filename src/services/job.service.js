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
  
  getTopViewedJobs: async () => {
    const { data } = await apiClient.get("/recruitment/job/top-6-viewed");
    return data.data; 
  },

  // -------------------------------------------------------
  // GET JOB DETAIL BY ID (PUBLIC)
  // -------------------------------------------------------
  getJobById: async (jobId) => {
    const { data } = await apiClient.get(`/recruitment/job/${jobId}`);
    return data.data; // Unwrap ApiResponse → returns the job object
  },

  // -------------------------------------------------------
  // GET RELATED JOBS BY JOB ID (PUBLIC)
  // -------------------------------------------------------
  getRelatedJobs: async (jobId) => {
    const { data } = await apiClient.get(`/recruitment/job/${jobId}/related`);
    return data.data; // Returns array of related jobs directly
  },

  // -------------------------------------------------------
  // CREATE JOB (ROLE_recruiter)
  // -------------------------------------------------------
  createJob: async (body) => {
    const { data } = await apiClient.post("/recruitment/job/create", body);
    return data; // { timestamp, status, success, message, data: { jobId, ... } }
  },

  // -------------------------------------------------------
  // UPDATE JOB (ROLE_recruiter) — only send changed fields
  // -------------------------------------------------------
  updateJob: async (jobId, body) => {
    const { data } = await apiClient.put(`/recruitment/job/${jobId}`, body);
    return data;
  },

  // -------------------------------------------------------
  // DELETE JOB — soft delete (ROLE_recruiter)
  // -------------------------------------------------------
  deleteJob: async (jobId) => {
    const { data } = await apiClient.delete(`/recruitment/job/${jobId}`);
    return data;
  },

  // -------------------------------------------------------
  // UPLOAD JOB IMAGE (ROLE_recruiter) — multipart/form-data
  // -------------------------------------------------------
  uploadJobImage: async (jobId, file) => {
    const formData = new FormData();
    formData.append("jobImage", file);
    const { data } = await apiClient.put(
      `/recruitment/job/${jobId}/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

};
