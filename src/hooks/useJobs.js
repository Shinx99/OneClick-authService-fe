"use client";
import { useState, useEffect } from "react";
import { jobService } from "@/services/job.service";

/**
 * Custom hook to fetch and manage the list of all jobs.
 * Handles loading, error, and data states.
 *
 * @returns {{ jobs: Array, isLoading: boolean, error: string|null, refetch: Function }}
 */
export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getAllJobs();
      setJobs(data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải danh sách việc làm.";
      setError(message);
      console.error("useJobs error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, isLoading, error, refetch: fetchJobs };
}
