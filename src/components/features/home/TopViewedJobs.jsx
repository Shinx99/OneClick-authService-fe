"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiDollarSign, FiEye, FiTrendingUp } from "react-icons/fi";
import { useTopViewedJobs } from "@/hooks/useTopViewedJobs";
import FormatSalary from "@/utils/FortmatSalary";
import getStatusConfig from "@/utils/StatusJob";
import SaveJobButton from "@/components/features/jobs/SaveJobButton";

const TopViewedJobs = () => {
  const { jobs, isLoading, error } = useTopViewedJobs();

  return (
    <section className="py-2 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#00c853] rounded-full"></div>
            <h2 className="text-xl font-medium text-text-main tracking-tight uppercase italic flex items-center gap-2">
              Top 6 việc làm{" "}
              <span className="text-[#00c853]">nhiều lượt quan tâm nhất</span>
              <FiTrendingUp className="text-[#00c853]" size={20} />
            </h2>
          </div>
          <Link
            href="/jobs?sortBy=viewCount"
            className="text-[12px] font-medium text-[#00c853] hover:underline uppercase tracking-wider"
          >
            Xem tất cả
          </Link>
        </div>

        {/* --- LOADING --- */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card-bg rounded-2xl p-4 border-2 border-card-border h-[200px] animate-pulse"
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-14 h-14 bg-card-border rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-card-border rounded w-3/4" />
                    <div className="h-3 bg-card-border rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="h-3 bg-card-border rounded w-2/3" />
                  <div className="h-3 bg-card-border rounded w-1/2" />
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
              Chưa có việc làm hot.
            </p>
          </div>
        )}

        {/* --- GRID LAYOUT 3 cột (Top 6 = 3 cột × 2 hàng) --- */}
        {!isLoading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {jobs.slice(0, 6).map((job) => (
              <Link
                href={`/jobs/${job.jobId}`}
                prefetch={false}
                key={job.jobId}
                className="group relative bg-card-bg rounded-2xl p-4 border-2 border-card-border hover:border-[#00c853] transition-all duration-300 hover:shadow-lg flex flex-col gap-3 min-h-[160px] overflow-hidden"
              >
                {/* Logo + Tiêu đề */}
                <div className="flex gap-3 mb-2">
                  <div className="w-14 h-14 rounded-xl border-2 border-card-border bg-background flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#00c853] transition-all overflow-hidden shadow-inner relative">
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
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3
                      className="text-[14px] font-medium text-text-main group-hover:text-[#00c853] transition-colors leading-snug line-clamp-2 mb-1"
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <p className="text-[11px] text-text-muted font-normal truncate opacity-80 uppercase tracking-tight">
                      {job.companyName || "OneClick Partner"}
                    </p>
                  </div>
                </div>

                {/* Phần dưới: Thông tin chi tiết */}
                <div className="mt-auto">
                  {/* Lương + Địa điểm */}
                  <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-1 text-[12px] text-[#00c853] font-medium">
                      <FiDollarSign size={13} />
                      <span className="truncate max-w-[100px]">
                        {FormatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                    <div className="flex items-center text-[12px] text-text-muted font-normal">
                      <FiMapPin size={11} className="opacity-60" />
                      <span className="truncate max-w-[90px]">
                        {job.province}
                      </span>
                      <div className=" items-right  text-[12px] text-text-muted font-normal absolute right-3">
                        <SaveJobButton jobId={job.jobId} />
                      </div>
                    </div>
                  </div>

                  {/* View count - điểm nhấn của HOT JOB */}
                  <div className="flex items-center justify-between pt-2 border-t border-card-border/50">
                    <div className="flex items-center gap-1 text-[11px] text-text-muted">
                      <FiEye size={12} className="text-[#00c853]" />
                      <span className="font-medium text-text-main">
                        {job.viewCount?.toLocaleString() || 0}
                      </span>
                      <span className="opacity-60">lượt xem</span>
                      <span
                        className={`text-[9px] font-medium px-2 py-0.5 rounded-md border uppercase ${getStatusConfig(job.status).styles} right-2  absolute opacity-90`}
                      >
                        {getStatusConfig(job.status).label}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopViewedJobs;
