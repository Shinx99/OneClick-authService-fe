"use client";
import React, { useState } from "react";
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

const JobForYou = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { jobs, pagination, isLoading, error } = useJobs({
    page: currentPage,
    size: 12, // Xin đúng 12 job từ Backend
  });

  // 1. Hàm format Lương
  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Thỏa thuận";
    const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
    if (min != null && max != null) return `${fmt(min)}-${fmt(max)}`;
    return min != null ? `>${fmt(min)}` : `<${fmt(max)}`;
  };

  // 2. Hàm format thời gian
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Mới cập nhật";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  // 3. Hàm xử lý trạng thái
  const getStatusConfig = (status) => {
    if (!status)
      return {
        label: "N/A",
        styles: "text-gray-500 bg-gray-500/5 border-gray-500/10",
      };

    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "OPEN":
      case "PUBLISHED":
        return {
          label: "Đang tuyển",
          styles: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
        };
      case "CLOSED":
      case "EXPIRED":
        return {
          label: "Đã đóng",
          styles: "text-red-500 bg-red-500/5 border-red-500/10",
        };
      case "PENDING":
        return {
          label: "Chờ duyệt",
          styles: "text-amber-500 bg-amber-500/5 border-amber-500/10",
        };
      default:
        return {
          label: status,
          styles: "text-blue-500 bg-blue-500/5 border-blue-500/10",
        };
    }
  };

  return (
    <section className="py-2 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER GỌN GÀNG --- */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#00c853] rounded-full"></div>
            <h2 className="text-xl font-medium text-text-main tracking-tight uppercase italic">
              Việc làm <span className="text-[#00c853]">gợi ý</span>
            </h2>
          </div>
          <Link
            href="/jobs"
            className="text-[12px] font-medium text-[#00c853] hover:underline uppercase tracking-wider"
          >
            Xem tất cả
          </Link>
        </div>

        {/* --- LOADING --- */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-card-bg rounded-2xl p-2 border-2 border-card-border h-[160px] animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-card-border rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-card-border rounded w-3/4" />
                    <div className="h-3 bg-card-border rounded w-1/2" />
                  </div>
                </div>
                <div className="mt-auto pt-8 flex gap-3">
                  <div className="h-4 bg-card-border rounded w-20" />
                  <div className="h-4 bg-card-border rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ERROR --- */}
        {!isLoading && error && (
          <div className="bg-red-50 dark:bg-red-900/10 text-red-500 text-sm px-6 py-4 rounded-2xl border border-red-200 dark:border-red-800 mb-8">
            {error}
          </div>
        )}

        {/* --- EMPTY --- */}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-16 px-4">
            <p className="text-text-muted text-lg font-medium italic">
              Chưa có việc làm nào.
            </p>
          </div>
        )}

        {/* --- GRID LAYOUT --- */}
        {!isLoading && !error && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {jobs.map((job) => (
                <Link
                  href={`/jobs/${job.jobId}`}
                  key={job.jobId}
                  className="group bg-card-bg rounded-2xl p-4 border-2 border-card-border hover:border-[#00c853] transition-all duration-300 hover:shadow-lg flex flex-col justify-between h-[160px]"
                >
                  <div className="flex gap-3">
                    {/* Logo nhỏ gọn (56px) */}
                    <div className="w-14 h-14 rounded-xl border-2 border-card-border bg-background flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-inner relative">
                      {job.companyLogoUrl ? (
                        <Image
                          src={job.companyLogoUrl}
                          alt={job.companyName || "Company"}
                          fill
                          className="object-contain"
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
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="text-text-muted hover:text-red-500 transition-all active:scale-90"
                      >
                        <FiHeart size={16} />
                      </button>
                    </div>

                    {/* Badge trạng thái nhỏ */}
                    <div className="flex items-center justify-between pt-2 border-t border-card-border/50">
                      <span className="text-[10px] text-text-muted font-normal uppercase tracking-tighter opacity-50">
                        {formatTimeAgo(job.createdAt)}
                      </span>
                      <span
                        className={`text-[9px] font-medium px-2 py-0.5 rounded-md border uppercase ${getStatusConfig(job.status).styles}`}
                      >
                        {getStatusConfig(job.status).label}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- PHÂN TRANG SERVER-SIDE --- */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 ">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className="w-10 h-10 flex items-center justify-center border-2 border-card-border rounded-xl text-text-muted hover:text-[#00c853] hover:border-[#00c853] disabled:opacity-20 transition-all"
                >
                  <FiChevronLeft size={20} />
                </button>

                <div className="text-[13px] font-medium text-text-muted">
                  <span className="text-text-main cursor-pointer">
                    {currentPage + 1}
                  </span>{" "}
                  / {pagination.totalPages}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages - 1),
                    )
                  }
                  disabled={pagination.last}
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
