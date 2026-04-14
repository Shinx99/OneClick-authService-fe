"use client";
import { useState, useEffect } from "react";
import { jobService } from "@/services/job.service";

/**
 * Custom hook to fetch and manage a single job detail.
 * Handles loading, error (with HTTP status code), and data states.
 *
 * @param {string} jobId - UUID of the job to fetch
 * @returns {{ job: Object|null, isLoading: boolean, error: string|null, errorStatus: number|null, refetch: Function }}
 */
export function useJobDetail(jobId) {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  const fetchJob = async () => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);
    setErrorStatus(null);

    try {
      const data = await jobService.getJobById(jobId);
      setJob(data);
    } catch (err) {
      const status = err.response?.status || null;
      const message =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải thông tin công việc.";

      setError(message);
      setErrorStatus(status);
      console.error("useJobDetail error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return { job, isLoading, error, errorStatus, refetch: fetchJob };
}
