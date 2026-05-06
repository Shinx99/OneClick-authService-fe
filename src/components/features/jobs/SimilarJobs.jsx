"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiChevronRight,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { jobService } from "@/services/job.service";
import { useAuth } from "@/context/AuthContext";

// ── Helpers ──────────────────────────────────────────────
const formatVND = (value) => {
  if (value == null) return null;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatSalary = (min, max) => {
  // Nếu cả 2 đều null hoặc 0 -> Thỏa thuận
  if (!min && !max) return "Thỏa thuận";

  const fmt = (val) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1).replace(".0", "")}K`;
    }
    return `$${val}`;
  };

  // Trả về các trường hợp
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
  if (min != null && max == null) return `Từ ${fmt(min)}`;
  if (min == null && max != null) return `Đến ${fmt(max)}`;
  return "Thỏa thuận";
};

const JOB_TYPE_LABELS = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  remote: "Từ xa",
  freelance: "Freelance",
  contract: "Hợp đồng",
  hybrid: "Hybrid",
  internship: "Thực tập",
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diffDays = Math.floor(
    (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "1 ngày trước";
  if (diffDays < 30) return `${diffDays} ngày trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
};

// Fallback avatar
const FALLBACK_LOGO =
  "https://ui-avatars.com/api/?name=C&background=E8F5E9&color=2E7D32&size=128";

// ── Component ────────────────────────────────────────────
const SimilarJobs = ({ jobId }) => {
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isRecruiter } = useAuth();

  useEffect(() => {
    if (!jobId) return;

    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const result = await jobService.getRelatedJobs(jobId);
        setRelatedJobs(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Failed to load related jobs:", err);
        setRelatedJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [jobId]);

  if (isRecruiter) return null; // Guard sớm, gọn hơn
  if (!isLoading && relatedJobs.length === 0) return null;

  return (
    <>

      <section className="mt-10">
        {/* ── Section Header ── */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-extrabold text-text-main flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FiTrendingUp className="text-emerald-500 text-lg" />
            </div>
            <div>
              <span>Việc làm liên quan</span>
              {!isLoading && relatedJobs.length > 0 && (
                <p className="text-[12px] font-medium text-text-muted mt-0.5">
                  {relatedJobs.length} vị trí tương tự đang tuyển
                </p>
              )}
            </div>
          </h2>
        </div>

        {/* ── Loading Skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card-bg rounded-2xl p-5 border-2 border-card-border animate-pulse"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-card-border rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-card-border rounded w-3/4" />
                    <div className="h-3 bg-card-border rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 bg-card-border rounded-lg w-24" />
                  <div className="h-7 bg-card-border rounded-lg w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Job Cards — scrollable grid ── */}
        {!isLoading && relatedJobs.length > 0 && (
          <div
            className="overflow-y-auto pr-1 scrollbar-thin"
            style={{ maxHeight: "600px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedJobs.map((job) => (
                <Link
                  href={`/jobs/${job.jobId}`}
                  key={job.jobId}
                  className="group bg-card-bg rounded-2xl p-5 border-2 border-card-border
                           hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5
                           transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top — Logo + Title + Company */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl border-2 border-card-border bg-background flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                      <img
                        src={job.companyLogoUrl || FALLBACK_LOGO}
                        alt={job.companyName || "Company"}
                        className="w-full h-full object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-text-main group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug mb-1">
                        {job.title}
                      </h3>
                      <p className="text-[13px] text-text-muted font-medium truncate">
                        {job.companyName || "OneClick Partner"}
                      </p>
                    </div>
                    <FiChevronRight
                      className="text-text-muted group-hover:text-emerald-500 transition-colors shrink-0 mt-1 opacity-0 group-hover:opacity-100"
                      size={18}
                    />
                  </div>

                  {/* Bottom — Tags: Salary, Location, Type, Time */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Salary */}
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/15">
                      <HiOutlineCurrencyDollar size={14} />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>

                    {/* Location */}
                    {job.province && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-500/15">
                        <FiMapPin size={12} />
                        {job.province}
                      </span>
                    )}

                    {/* Job type */}
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1.5 rounded-lg border border-orange-500/15">
                      <FiBriefcase size={12} />
                      {JOB_TYPE_LABELS[job.jobType?.toLowerCase()] ||
                        job.jobType ||
                        "N/A"}
                    </span>

                    {/* Time ago */}
                    {job.createdAt && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted">
                        <FiClock size={12} className="opacity-60" />
                        {formatTimeAgo(job.createdAt)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

    </>
  );
};

export default SimilarJobs;
