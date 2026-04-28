// File: src/components/features/jobs/SavedJobsContent.jsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiDollarSign,
  FiTrash2,
  FiClock,
  FiHeart,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { savedJobService } from "@/services/savedJob.service";
import { useAuth } from "@/context/AuthContext";
import FormatSalary from "@/utils/FortmatSalary";
import { FormatTime } from "@/utils/FormatTime";

const SavedJobsContent = () => {
  const { isAuthenticated } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. GỌI API LẤY DANH SÁCH
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await savedJobService.getSavedJobs({ page: 0, size: 100 });
        if (res?.success) {
          setSavedJobs(res.data.content || []);
        } else {
          throw new Error("Không thể tải danh sách");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy danh sách việc làm đã lưu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated]);

  // 2. HÀM BỎ LƯU (XÓA NGAY KHỎI UI)
  const handleUnsave = async (e, jobId) => {
    e.preventDefault();

    const previousJobs = [...savedJobs];
    setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
    toast.success("Đã bỏ lưu công việc!");

    try {
      await savedJobService.unsaveJob(jobId);
    } catch (err) {
      setSavedJobs(previousJobs);
      toast.error("Không thể bỏ lưu, vui lòng thử lại!");
    }
  };

  // --- RENDERING ---
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-text-main mb-4">
          Bạn chưa đăng nhập
        </h2>
        <p className="text-text-muted mb-8">
          Vui lòng đăng nhập để xem danh sách việc làm đã lưu.
        </p>
        <Link
          href="/login"
          className="bg-[#00c853] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00b04a] transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-card-border">
          <div className="w-1.5 h-8 bg-[#00c853] rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main">
            Việc làm <span className="text-[#00c853]">Đã Lưu</span>
          </h1>
          {!isLoading && (
            <span className="ml-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
              {savedJobs.length}
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[120px] bg-card-bg rounded-2xl border-2 border-card-border animate-pulse p-4 flex gap-4"
              >
                <div className="w-16 h-16 bg-card-border rounded-xl"></div>
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-4 bg-card-border w-3/4 rounded"></div>
                  <div className="h-3 bg-card-border w-1/4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-200 text-center">
            {error}
          </div>
        )}

        {/* Trống */}
        {!isLoading && !error && savedJobs.length === 0 && (
          <div className="text-center py-20 bg-card-bg rounded-[24px] border-2 border-card-border border-dashed">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">
              Chưa có công việc nào
            </h3>
            <p className="text-text-muted mb-6">
              Bạn chưa lưu công việc nào. Hãy khám phá và lưu lại những cơ hội
              phù hợp nhé!
            </p>
            <Link
              href="/jobs"
              className="bg-[#00c853] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00b04a] transition-colors inline-block"
            >
              Tìm việc ngay
            </Link>
          </div>
        )}

        {/* Danh sách */}
        {!isLoading && savedJobs.length > 0 && (
          <div className="grid gap-4">
            {savedJobs.map((job) => (
              <Link
                href={`/jobs/${job.jobId}`}
                key={job.jobId}
                className="group flex flex-col sm:flex-row gap-4 bg-card-bg rounded-[20px] p-5 border-2 border-card-border hover:border-[#00c853] transition-all duration-300 hover:shadow-md relative"
              >
                {/* Nút Bỏ lưu */}
                <button
                  onClick={(e) => handleUnsave(e, job.jobId)}
                  className="absolute top-4 right-4 p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors z-10 cursor-pointer"
                  title="Bỏ lưu công việc này"
                >
                  <FiTrash2 size={20} />
                </button>

                <div className="w-16 h-16 rounded-xl border-2 border-card-border bg-white flex items-center justify-center shrink-0 overflow-hidden relative">
                  {job.companyLogoUrl ? (
                    <Image
                      src={job.companyLogoUrl}
                      alt={job.companyName}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-[#00c853] font-bold text-xl">
                      {job.title?.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="text-[16px] font-bold text-text-main group-hover:text-[#00c853] transition-colors truncate mb-1">
                    {job.title}
                  </h3>
                  <p className="text-[14px] text-text-muted font-medium mb-3">
                    {job.companyName}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1 text-[12px] text-[#00c853] font-medium">
                      <FiDollarSign size={14} />
                      {FormatSalary(job.salaryMin, job.salaryMax)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
                      <FiMapPin size={14} />
                      <span className="truncate max-w-[150px]">
                        {job.province}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-text-muted ml-auto sm:ml-0">
                      <FiClock size={12} />
                      {FormatTime(job.savedAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsContent;
