"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";
import { useJobs } from "@/hooks/useJobs";

const JobList = ({ filters = {} }) => {
  const { jobs, pagination, isLoading, error } = useJobs(filters);

  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Thỏa thuận";
    const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
    if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
    return min != null ? `>${fmt(min)}` : `<${fmt(max)}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-card-border">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#00c853] rounded-full"></div>
          <h2 className="text-[20px] font-medium text-text-main tracking-tight">
            Danh sách việc làm{" "}
            <span className="text-text-muted font-normal ml-1">
              ({pagination.totalElements})
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-card-border border-t-[#00c853] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 text-red-500 text-sm px-6 py-4 rounded-2xl border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && jobs.length === 0 && (
        <div className="bg-card-bg p-12 rounded-[2rem] text-center border border-dashed border-card-border">
          <p className="text-text-muted italic">
            Không tìm thấy việc làm nào phù hợp.
          </p>
        </div>
      )}

      {/* Main List */}
      {!isLoading && !error && (
        <div className="flex flex-col gap-5">
          {jobs.map((job) => (
            <Link
              href={`/jobs/${job.jobId}`}
              key={job.jobId}
              className="group bg-card-bg rounded-[24px] p-6 border-2 border-card-border hover:border-[#00c853] hover:shadow-2xl hover:shadow-neutral-900/5 transition-all duration-500 relative block"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* 1. Logo Section */}
                <div className="w-16 h-16 rounded-2xl border-2 border-card-border bg-background flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-inner relative">
                  {job.companyLogoUrl ? (
                    <Image
                      src={job.companyLogoUrl}
                      alt={job.companyName || "Company"}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-[#00c853] font-medium text-2xl uppercase italic leading-none">
                      {job.title?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* 2. Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#00c853]/10 text-[#00c853] uppercase tracking-widest border border-[#00c853]/20">
                      {job.level || "Mới đăng"}
                    </span>
                    {job.jobType && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase tracking-widest border border-blue-500/20">
                        {job.jobType}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[18px] font-medium text-text-main group-hover:text-[#00c853] transition-colors truncate mb-1.5">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-text-muted font-normal">
                    <span className="hover:text-[#00c853] cursor-pointer transition-colors">
                      {job.companyName || "OneClick AI Partner"}
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
                      Mức lương
                    </p>
                    <div className="flex items-center gap-1 text-[16px] font-medium text-[#00c853]">
                      <FiDollarSign size={16} />
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
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
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Container — Server-side */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16 py-8 border-t-2 border-card-border">
          <button
            onClick={() =>
              filters.onPageChange &&
              filters.onPageChange(Math.max((pagination.page || 0) - 1, 0))
            }
            disabled={pagination.page === 0}
            className="w-12 h-12 flex items-center justify-center border-2 border-card-border rounded-2xl text-text-muted hover:text-[#00c853] hover:border-[#00c853] disabled:opacity-20 transition-all active:scale-90"
          >
            <FiChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-2 text-[14px] font-medium">
            <span className="text-text-main px-3 py-1 bg-card-bg border-2 border-card-border rounded-lg">
              {(pagination.page || 0) + 1}
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted">{pagination.totalPages}</span>
          </div>

          <button
            onClick={() =>
              filters.onPageChange &&
              filters.onPageChange(
                Math.min((pagination.page || 0) + 1, pagination.totalPages - 1),
              )
            }
            disabled={pagination.last}
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
