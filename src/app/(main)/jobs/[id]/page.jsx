"use client";
import React, { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import { FiAlertTriangle, FiRefreshCw, FiSearch } from "react-icons/fi";
import JobContent from "@/components/features/jobs/JobContent";
import SimilarJobs from "@/components/features/jobs/SimilarJobs";
import { useJobDetail } from "@/hooks/useJobDetail";

// ==========================================
// LOADING SKELETON
// ==========================================
const JobDetailSkeleton = () => (
  <div className="min-h-screen bg-background pb-20 pt-6 animate-pulse transition-colors duration-300">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 bg-card-border rounded w-20" />
        <div className="h-4 bg-card-border rounded w-16" />
        <div className="h-4 bg-card-border rounded w-32" />
      </div>

      {/* Header skeleton */}
      <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border mb-6">
        <div className="flex gap-6 mb-6">
          <div className="w-[88px] h-[88px] bg-card-border rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 bg-card-border rounded w-3/4" />
            <div className="h-4 bg-card-border rounded w-1/3" />
            <div className="flex gap-4">
              <div className="h-4 bg-card-border rounded w-24" />
              <div className="h-4 bg-card-border rounded w-20" />
              <div className="h-4 bg-card-border rounded w-20" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-card-border/50 rounded-2xl" />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-card-border rounded-2xl" />
          <div className="w-40 h-12 bg-card-border rounded-2xl" />
        </div>
      </div>

      {/* Content skeletons */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border mb-6">
          <div className="h-6 bg-card-border rounded w-48 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-card-border rounded w-full" />
            <div className="h-4 bg-card-border rounded w-full" />
            <div className="h-4 bg-card-border rounded w-5/6" />
            <div className="h-4 bg-card-border rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 404
// ==========================================
const JobNotFound = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-card-bg border border-card-border rounded-full flex items-center justify-center mx-auto mb-6">
        <FiSearch className="text-text-muted text-4xl" />
      </div>
      <h1 className="text-2xl font-extrabold text-text-main mb-3">
        Công việc không tồn tại
      </h1>
      <p className="text-text-muted mb-8 leading-relaxed">
        Công việc bạn đang tìm kiếm có thể đã bị xoá hoặc không còn khả dụng.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 bg-[#00c853] hover:bg-[#00b04a] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
      >
        Xem danh sách việc làm
      </Link>
    </div>
  </div>
);

// ==========================================
// LỖI
// ==========================================
const NetworkError = ({ message, onRetry }) => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiAlertTriangle className="text-red-400 text-4xl" />
      </div>
      <h1 className="text-2xl font-extrabold text-text-main mb-3">
        Lỗi kết nối
      </h1>
      <p className="text-text-muted mb-3 leading-relaxed">
        Không thể tải thông tin công việc. Vui lòng kiểm tra kết nối mạng và thử lại.
      </p>
      <p className="text-red-400 text-sm mb-8">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[#00c853] hover:bg-[#00b04a] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
        >
          <FiRefreshCw className="text-lg" />
          Thử lại
        </button>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-card-bg border border-card-border hover:bg-background text-text-main px-6 py-3 rounded-xl font-bold transition-all"
        >
          Về trang việc làm
        </Link>
      </div>
    </div>
  </div>
);

// ==========================================
// TRANG CHÍNH
// ==========================================
const JobDetailPage = ({ params }) => {
  const router = useRouter();
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.id;

  const { job, isLoading, error, errorStatus, refetch } = useJobDetail(jobId);

  useEffect(() => {
    if (errorStatus === 400) {
      router.replace("/jobs");
    }
  }, [errorStatus, router]);

  if (isLoading) return <JobDetailSkeleton />;
  if (errorStatus === 400) return <JobDetailSkeleton />;
  if (errorStatus === 404) return <JobNotFound />;
  if (errorStatus === 500) {
    return <NetworkError message="Máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút." onRetry={refetch} />;
  }
  if (error) return <NetworkError message={error} onRetry={refetch} />;
  if (!job) return null;

  return (
    <div className="min-h-screen bg-background pb-20 pt-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm font-medium text-text-muted gap-2 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Trang chủ
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <Link href="/jobs" className="hover:text-green-600 transition-colors">
            Việc làm
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="text-text-main font-semibold truncate max-w-[200px]">
            {job.title}
          </span>
        </div>

        {/* Nội dung chính — 1 cột full width */}
        <JobContent data={job} />

        {/* Việc làm tương tự */}
        <SimilarJobs jobId={jobId} />
      </div>
    </div>
  );
};

export default JobDetailPage;
