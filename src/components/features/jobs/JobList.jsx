"use client";
import React, { useState } from "react";
import {
  FiMapPin,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiSearch,
} from "react-icons/fi";
import { useJobs } from "@/hooks/useJobs";

const JobList = () => {
  const { jobs, isLoading, error } = useJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Logic phân trang
  const totalPages = Math.ceil((jobs?.length || 0) / jobsPerPage);
  const currentJobs =
    jobs?.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage) ||
    [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-card-border">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#00c853] rounded-full"></div>
          <h2 className="text-[20px] font-medium text-text-main tracking-tight">
            Danh sách việc làm{" "}
            <span className="text-text-muted font-normal ml-1">
              ({jobs?.length || 0})
            </span>
          </h2>
        </div>

        <div className="text-[13px] text-text-muted font-normal bg-card-bg px-4 py-1.5 rounded-full border-2 border-card-border">
          Sắp xếp theo:{" "}
          <span className="text-[#00c853] cursor-pointer hover:underline">
            Mới nhất
          </span>
        </div>
      </div>

      {/* Main List */}
      <div className="flex flex-col gap-5">
        {currentJobs.map((job) => (
          <div
            key={job.jobId}
            className="group bg-card-bg rounded-[24px] p-6 border-2 border-card-border hover:border-[#00c853] hover:shadow-2xl hover:shadow-neutral-900/5 transition-all duration-500 relative"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* 1. Logo Section */}
              <div className="w-16 h-16 rounded-2xl border-2 border-card-border bg-background flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-inner">
                <span className="text-[#00c853] font-medium text-2xl uppercase italic leading-none">
                  {job.title?.charAt(0)}
                </span>
              </div>

              {/* 2. Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#00c853]/10 text-[#00c853] uppercase tracking-widest border border-[#00c853]/20">
                    Mới đăng
                  </span>
                </div>
                <h3 className="text-[18px] font-medium text-text-main group-hover:text-[#00c853] transition-colors truncate mb-1.5">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-text-muted font-normal">
                  <span className="hover:text-[#00c853] cursor-pointer transition-colors">
                    {job.company || "OneClick AI Partner"}
                  </span>
                  <span className="w-1 h-1 bg-card-border rounded-full hidden sm:block"></span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-[#00c853]" size={14} />{" "}
                    {job.province}
                  </span>
                </div>
              </div>

              {/* 3. Meta Data & Action */}
              <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l-2 border-card-border lg:pl-8">
                <div className="min-w-[120px]">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 opacity-70 italic font-normal">
                    Mức lương tối đa
                  </p>
                  <div className="flex items-center gap-1 text-[16px] font-medium text-[#00c853]">
                    <FiDollarSign size={16} />
                    <span>{job.salaryMax}</span>
                  </div>
                </div>

                <div className="hidden xl:block min-w-[100px]">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 opacity-70 italic font-normal">
                    Hình thức
                  </p>
                  <span className="text-[12px] font-normal text-text-main">
                    {job.jobType}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-2xl border-2 border-card-border text-text-muted hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all active:scale-90">
                    <FiHeart size={18} />
                  </button>
                  <button className="hidden sm:flex items-center gap-2 bg-[#00c853] text-white px-5 py-2.5 rounded-2xl text-[14px] font-medium hover:bg-[#00b04a] transition-all shadow-lg shadow-green-500/20 active:scale-95">
                    Ứng tuyển
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16 py-8 border-t-2 border-card-border">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 flex items-center justify-center border-2 border-card-border rounded-2xl text-text-muted hover:text-[#00c853] hover:border-[#00c853] disabled:opacity-20 transition-all active:scale-90"
          >
            <FiChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-2 text-[14px] font-medium">
            <span className="text-text-main px-3 py-1 bg-card-bg border-2 border-card-border rounded-lg">
              {currentPage}
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted">{totalPages}</span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-12 h-12 flex items-center justify-center border-2 border-card-border rounded-2xl text-text-muted hover:text-[#00c853] hover:border-[#00c853] disabled:opacity-20 transition-all active:scale-90"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
