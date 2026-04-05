"use client";
import React from "react";
import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useJobs } from "@/hooks/useJobs";

const JobForYou = () => {
  const { jobs, isLoading, error } = useJobs();

  // --- Helper: Format salary range ---
  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Thỏa thuận";
    const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
    if (min != null && max != null) return `$${fmt(min)} - $${fmt(max)}`;
    if (min != null) return `Từ $${fmt(min)}`;
    return `Tới $${fmt(max)}`;
  };

  return (
    <section className="py-0">
      <div className="max-w-8xl mx-auto px-">
        {/* Tiêu đề phần */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-4">
            Việc làm dành cho bạn
          </h2>
          <button className="text-green-600 font-semibold hover:underline cursor-pointer">
            Xem tất cả
          </button>
        </div>

        {/* --- LOADING STATE --- */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {!isLoading && error && (
          <div className="text-center py-16 px-4">
            <p className="text-red-500 font-semibold text-lg mb-2">
              Đã xảy ra lỗi
            </p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* --- EMPTY STATE --- */}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-16 px-4">
            <p className="text-gray-400 text-lg font-semibold">
              Chưa có việc làm nào.
            </p>
          </div>
        )}

        {/* --- JOB LIST --- */}
        {!isLoading && !error && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 cursor-pointer">
              {jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative flex flex-col justify-between hover:shadow-md transition-all group h-full"
                >
                  <div className="flex gap-4">
                    {/* Placeholder logo */}
                    <div className="w-16 h-16 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-1">
                      <span className="text-green-600 font-bold text-xl">
                        {job.title?.charAt(0) || "J"}
                      </span>
                    </div>

                    {/* Thông tin chính */}
                    <div className="flex-1 min-w-0">
                      {job.status === "ACTIVE" && (
                        <span className="inline-block bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-1.5">
                          ● ĐANG TUYỂN
                        </span>
                      )}
                      <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 truncate mt-1 uppercase">
                        {job.level} • {job.jobType}
                      </p>
                    </div>
                  </div>

                  {/* Chân thẻ: Lương & Địa điểm */}
                  <div className="mt-5 flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded font-semibold">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded font-semibold">
                        {job.province || "Việt Nam"}
                      </span>
                    </div>

                    <button className="text-green-500 cursor-pointer p-1 hover:bg-green-50 rounded-full transition-colors">
                      <FaRegHeart size={18} className="text-green-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang tĩnh */}
            <div className="flex justify-center items-center gap-4">
              <button className="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all cursor-pointer">
                <FaChevronLeft size={12} />
              </button>
              <div className="text-sm font-medium text-gray-500">
                <span className="text-green-600 font-bold underline">1</span> /
                {" "}{Math.ceil(jobs.length / 6) || 1} trang
              </div>
              <button className="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all cursor-pointer">
                <FaChevronRight size={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default JobForYou;
