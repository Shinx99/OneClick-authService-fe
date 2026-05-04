"use client";
import { useState, useEffect } from "react";
import { jobService } from "@/services/job.service";
export const useTopViewedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await jobService.getTopViewedJobs();
        
        setJobs(data || []);
      } catch (err) {
        console.error("Lỗi khi tải Top Jobs:", err);
        setError("Không thể tải danh sách việc làm HOT");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopJobs();
  }, []); 

  return { jobs, isLoading, error };
};