"use client";
import React, { useState } from "react";

import {
  FiMapPin,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";
import { useJobs } from "@/hooks/useJobs";

const JobForYou = () => {
  const { jobs, isLoading, error } = useJobs({ page: 0, size: 6 });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const totalPages = Math.ceil((jobs?.length || 0) / jobsPerPage);
  const currentJobs =
    jobs?.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage) ||
    [];

  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Thỏa thuận";
    const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
    if (min != null && max != null) return `${fmt(min)}-${fmt(max)}`;
    return min != null ? `>${fmt(min)}` : `<${fmt(max)}`;
  };

  return (
    <section className="py-12 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER GỌN GÀNG --- */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#00c853] rounded-full"></div>
            <h2 className="text-xl font-medium text-text-main tracking-tight uppercase italic">
              Việc làm <span className="text-[#00c853]">gợi ý</span>
            </h2>
          </div>
          <button className="text-[12px] font-medium text-[#00c853] hover:underline uppercase tracking-wider">
            Xem tất cả
          </button>
        </div>

        {/* --- GRID LAYOUT --- */}
        {!isLoading && !error && currentJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {currentJobs.map((job) => (
                <div
                  key={job.jobId}
                  className="group bg-card-bg rounded-2xl p-4 border-2 border-card-border hover:border-[#00c853] transition-all duration-300 hover:shadow-lg flex flex-col justify-between h-[160px]"
                >
                  <div className="flex gap-3">
                    {/* Logo nhỏ gọn (56px) */}
                    <div className="w-14 h-14 rounded-xl border-2 border-card-border bg-background flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-inner relative">
                      {job.companyLogoUrl ? (
                        <img
                          src={job.companyLogoUrl}
                          alt={job.companyName || "Company"}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-[#00c853] font-medium text-xl uppercase italic">
                          {job.title?.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Thông tin chính */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3
                        className="text-[14px] font-medium text-text-main group-hover:text-[#00c853] transition-colors leading-snug line-clamp-2 mb-1"
                        title={job.title}
                      >
                        {job.title}
                      </h3>
                      <p className="text-[12px] text-text-muted font-normal truncate opacity-80 uppercase tracking-tight">
                        {job.companyName || "OneClick Partner"}
                      </p>
                    </div>
                  </div>

                  {/* Thông tin Meta & Action trên 1 dòng */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[12px] text-[#00c853] font-medium">
                          <FiDollarSign size={13} />
                          <span>
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-text-muted font-normal">
                          <FiMapPin size={13} className="opacity-60" />
                          <span className="truncate max-w-[80px]">
                            {job.province}
                          </span>
                        </div>
                      </div>
                      <button className="text-text-muted hover:text-red-500 transition-all active:scale-90">
                        <FiHeart size={16} />
                      </button>
                    </div>

                    {/* Badge trạng thái nhỏ */}
                    <div className="flex items-center justify-between pt-2 border-t border-card-border/50">
                      <span className="text-[10px] text-text-muted font-normal uppercase tracking-tighter opacity-50">
                        2 ngày trước
                      </span>
                      <span className="text-[9px] font-medium text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10 uppercase">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PHÂN TRANG GỌN --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border-2 border-card-border rounded-xl text-text-muted hover:text-[#00c853] hover:border-[#00c853] disabled:opacity-20 transition-all"
                >
                  <FiChevronLeft size={20} />
                </button>

                <div className="text-[13px] font-medium text-text-muted">
                  <span className="text-text-main">{currentPage}</span> /{" "}
                  {totalPages}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border-2 border-card-border rounded-xl text-text-muted hover:text-[#00c853] hover:border-[#00c853] disabled:opacity-20 transition-all"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default JobForYou;
