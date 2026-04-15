"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // 1. BỔ SUNG IMPORT NÀY
import { companyService } from "@/services/company.service";

const CompanyJobs = ({ companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API khi có companyId
  useEffect(() => {
    if (!companyId) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await companyService.getJobsByCompanyId(companyId, {
          page: 0,
          size: 5,
        });

        if (res?.success && res?.data?.content) {
          setJobs(res.data.content);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách việc làm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max) return `$${min} - $${max}`;
    if (min) return `Từ $${min}`;
    return `Đến $${max}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Gần đây";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-card-bg p-6 rounded-3xl border border-card-border transition-all shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-text-main">Vị trí đang tuyển</h3>
        {jobs.length > 0 && !loading && (
          <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-[#00c853] px-2 py-0.5 rounded-full font-bold uppercase">
            {jobs.length} vị trí
          </span>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-400">
            Đang tải danh sách...
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Link
              href={`/jobs/${job.jobId}`}
              key={job.jobId}
              className="block p-4 rounded-2xl border border-card-border hover:border-[#00c853] transition-all cursor-pointer group"
            >
              <h4 className="font-bold text-sm text-text-main group-hover:text-[#00c853] transition-colors line-clamp-1">
                {job.title}
              </h4>
              <div className="flex justify-between items-center mt-3 font-medium">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="text-[#00c853] font-bold">
                    💰 {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <span>📍 {job.province}</span>
                </div>

                <span className="text-[11px] text-gray-400">
                  🕒 {formatDate(job.createdAt)}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-400 italic">
              Hiện chưa có vị trí nào đang tuyển.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyJobs;
