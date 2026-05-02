"use client";
import { useState, useEffect, useCallback } from "react";
import { jobService } from "@/services/job.service";

export function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serialize filters thành string để so sánh stable
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Parse lại từ key để đảm bảo đúng giá trị tại thời điểm effect chạy
        const currentFilters = JSON.parse(filtersKey);
        const data = await jobService.getAllJobs(currentFilters);
        setJobs(data?.content || []);
        setPagination({
          page: data?.pageNumber ?? 0,
          size: data?.pageSize ?? 6,
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
    };

    fetchJobs();
  }, [filtersKey]); // ← string so sánh bằng value, không phải reference

  return { jobs, pagination, isLoading, error };
}