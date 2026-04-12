"use client";
import { useState, useEffect, useCallback } from "react";
import { jobService } from "@/services/job.service";

/**
 * Custom hook to fetch jobs with filter & server-side pagination.
 *
 * @param {Object} filters - { keyword, province, level, jobType, salaryMin, salaryMax, experienceMax, page, size, sortBy, sortDir }
 * @returns {{ jobs, pagination, isLoading, error, refetch }}
 */
export function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getAllJobs(filters);
      setJobs(data?.content || []);
      setPagination({
        page: data?.page ?? 0,
        size: data?.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
        last: data?.last ?? true,
      });
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
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, pagination, isLoading, error, refetch: fetchJobs };
}
