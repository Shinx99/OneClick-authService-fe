"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import CandidateTable from "@/components/features/employer/candidate/CandidateTable";
import CandidateStats from "@/components/features/employer/candidate/CandidateStats";
import { FaBriefcase, FaBell, FaEye, FaCalendarAlt } from "react-icons/fa";
import { applicationService } from "@/services/application.service";
import { resumeService } from "@/services/resume.service";
import toast from "react-hot-toast";

const STATUS_MAP = {
  pending: { label: "Đang xử lý", color: "yellow", order: 1 },
  reviewed: { label: "Đã xem CV", color: "blue", order: 2 },
  interview: { label: "Phỏng vấn", color: "purple", order: 3 },
  accepted: { label: "Được nhận", color: "green", order: 4 },
  rejected: { label: "Từ chối", color: "red", order: 5 },
};

const CandidateManager = () => {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [candidates, setCandidates] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [hasNewApplications, setHasNewApplications] = useState(false);
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const intervalRef = useRef(null);
  const prevCandidatesLengthRef = useRef(0);

  const loadJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await applicationService.getMyJobs();
      console.log("📊 Full API response:", response);
      setJobs(response || []);
    } catch (error) {
      console.error("Load jobs error:", error);
      toast.error("Không thể tải danh sách công việc");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Lọc job active
  const activeJobs = useMemo(() => {
    let result = jobs.filter((job) => job.status === "active");
    if (searchKeyword.trim()) {
      result = result.filter((job) =>
        job.title?.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }
    return result;
  }, [jobs, searchKeyword]);

  // Load dữ liệu lần đầu (có loading)
  const initialLoadCandidates = async (jobId) => {
    if (!jobId || jobId === "all") return;

    setIsInitialLoading(true);
    try {
      const data = await applicationService.getJobApplications(jobId, {
        page: 0,
        size: 100,
        sortBy: "appliedAt",
        sortDir: "DESC",
      });

      const transformedCandidates = (data?.content || []).map((app) => ({
        applicationId: app.applicationId,
        jobId: app.jobId,
        candidateId: app.candidateId,
        name: app.candidateName,
        email: app.candidateEmail,
        phone: app.candidatePhone,
        status: app.status,
        statusDisplay: STATUS_MAP[app.status]?.label || app.status,
        appliedAt: app.appliedAt,
        matchScore: app.matchScore,
        hasInterviewScheduled: app.hasInterviewScheduled,
        resumeUrl: app.resumeUrl,
        jobTitle: app.jobTitle,
        experience: app.candidateExperienceYear,
      }));

      setCandidates(transformedCandidates);
      prevCandidatesLengthRef.current = transformedCandidates.length;
    } catch (error) {
      console.error("Load candidates error:", error);
      toast.error("Không thể tải danh sách ứng viên");
      setCandidates([]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Polling - KHÔNG có loading state, chỉ cập nhật data mới
  const pollCandidates = async (jobId) => {
    if (!jobId || jobId === "all") return;

    try {
      const data = await applicationService.getJobApplications(jobId, {
        page: 0,
        size: 100,
        sortBy: "appliedAt",
        sortDir: "DESC",
      });

      const transformedCandidates = (data?.content || []).map((app) => ({
        applicationId: app.applicationId,
        jobId: app.jobId,
        candidateId: app.candidateId,
        name: app.candidateName,
        email: app.candidateEmail,
        phone: app.candidatePhone,
        status: app.status,
        statusDisplay: STATUS_MAP[app.status]?.label || app.status,
        appliedAt: app.appliedAt,
        matchScore: app.matchScore,
        hasInterviewScheduled: app.hasInterviewScheduled,
        resumeUrl: app.resumeUrl,
        jobTitle: app.jobTitle,
        experience: app.candidateExperienceYear,
      }));

      if (transformedCandidates.length > prevCandidatesLengthRef.current) {
        const newCount =
          transformedCandidates.length - prevCandidatesLengthRef.current;
        setNewApplicationsCount(newCount);
        setHasNewApplications(true);
        toast.success(`Có ${newCount} ứng viên mới!`);
      }

      setCandidates(transformedCandidates);
      prevCandidatesLengthRef.current = transformedCandidates.length;
    } catch (error) {
      console.error("Poll candidates error:", error);
    }
  };

  const refreshCandidates = async () => {
    if (selectedJob && selectedJob !== "all") {
      setHasNewApplications(false);
      await initialLoadCandidates(selectedJob);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus, note = "") => {
    setUpdatingStatus(applicationId);
    try {
      await applicationService.updateApplicationStatus(applicationId, {
        status: newStatus,
        note: note,
      });

      toast.success(
        `Đã cập nhật trạng thái thành "${STATUS_MAP[newStatus]?.label || newStatus}"`,
      );
      await initialLoadCandidates(selectedJob);
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleScheduleInterview = async (applicationId, scheduleData) => {
    try {
      await applicationService.scheduleInterview(applicationId, scheduleData);
      toast.success("Đã gửi lịch phỏng vấn thành công");
      await initialLoadCandidates(selectedJob);
    } catch (error) {
      console.error("Schedule interview error:", error);
      toast.error("Không thể lên lịch phỏng vấn");
    }
  };

  const handleViewResume = async (resumeUrl, candidateName, candidate) => {
    if (!resumeUrl) {
      toast.error("Không tìm thấy CV của ứng viên");
      return;
    }

    let fileName;
    if (resumeUrl.startsWith("s3://")) {
      fileName = resumeUrl.split("/").pop();
    } else {
      try {
        const decodedUrl = decodeURIComponent(resumeUrl);
        fileName = decodedUrl.split("/").pop();
      } catch (e) {
        fileName = resumeUrl.split("/").pop();
      }
    }

    if (!fileName) {
      toast.error("Không thể lấy tên file CV");
      return;
    }

    fileName = decodeURIComponent(fileName);

    try {
      toast.loading("Đang tải CV...", { id: "viewResume" });

      const { blob } = await resumeService.previewCandidateResume(
        candidate.candidateId,
        fileName,
      );
      const blobUrl = URL.createObjectURL(blob);

      setViewingCandidate({
        name: candidateName,
        email: candidate.email,
        phone: candidate.phone,
        matchScore: candidate.matchScore,
        applicationId: candidate.applicationId,
        status: candidate.status,
        cvBlobUrl: blobUrl,
      });

      toast.dismiss("viewResume");
      toast.success("Đã tải CV thành công!");
    } catch (error) {
      console.error("View resume error:", error);
      toast.error("Không thể tải CV của ứng viên");
      toast.dismiss("viewResume");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJob && selectedJob !== "all") {
      initialLoadCandidates(selectedJob);

      intervalRef.current = setInterval(() => {
        pollCandidates(selectedJob);
      }, 30000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setCandidates([]);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [selectedJob]);

  const filteredCandidates = useMemo(() => {
    if (selectedJob === "all") return [];
    return candidates;
  }, [selectedJob, candidates]);

  if (isLoadingJobs) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-text-muted mt-4">
            Đang tải danh sách công việc...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0 px-2 pt-2">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-[#e0e0e0]">
            Quản lý ứng viên
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Xem và cập nhật trạng thái hồ sơ ứng viên
          </p>
        </div>

        {hasNewApplications && (
          <button
            onClick={refreshCandidates}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl text-sm font-bold animate-pulse border border-green-200"
          >
            <FaBell className="text-green-500" />
            {newApplicationsCount} ứng viên mới
          </button>
        )}
      </div>

      {/* Filter bar - Combobox + Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 px-2">
        {/* Combobox chọn công việc */}
        <div className="w-full sm:w-auto flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex-1">
          <FaBriefcase className="text-emerald-500 shrink-0" />
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="bg-transparent text-[14px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer w-full"
          >
            <option value="all">-- Tất cả công việc --</option>
            {activeJobs.length === 0 ? (
              <option value="" disabled>
                Chưa có công việc đang tuyển
              </option>
            ) : (
              activeJobs.map((job) => (
                <option key={job.jobId || job.id} value={job.jobId || job.id}>
                  {job.title || job.jobTitle || "Không có tiêu đề"}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Ô tìm kiếm */}
        {selectedJob === "all" && (
          <div className="w-full sm:w-72 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm công việc..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Candidate Stats */}
      {selectedJob !== "all" && (
        <div className="shrink-0 px-2">
          <CandidateStats candidates={filteredCandidates} />
        </div>
      )}

      {/* Hiển thị khi chưa có job nào */}
      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 text-center mx-2">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <FaBriefcase className="text-3xl text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            Chưa có công việc nào
          </h3>
          <p className="text-slate-500 mb-6">
            Bạn chưa đăng tin tuyển dụng nào. Hãy tạo công việc đầu tiên để bắt
            đầu nhận hồ sơ ứng viên.
          </p>
          <button
            onClick={() =>
              (window.location.href = "/employer/job-posting/create")
            }
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
          >
            + Đăng tin tuyển dụng
          </button>
        </div>
      ) : selectedJob === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {activeJobs.map((job) => (
            <div
              key={job.jobId || job.id}
              onClick={() => setSelectedJob(job.jobId || job.id)}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer"
            >
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                {job.title || "Không có tiêu đề"}
              </h3>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-emerald-500" size={14} />
                  <span>{job.applicationCount || 0} ứng viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="text-blue-500" size={14} />
                  <span>{job.viewCount || 0} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" size={14} />
                  <span>
                    Đăng:{" "}
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Đang tuyển
                </span>
              </div>
            </div>
          ))}

          {activeJobs.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-text-muted">
                {searchKeyword
                  ? `Không tìm thấy công việc "${searchKeyword}"`
                  : "Chưa có công việc đang tuyển nào"}
              </p>
            </div>
          )}
        </div>
      ) : isInitialLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-text-muted mt-4">
              Đang tải danh sách ứng viên...
            </p>
          </div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 text-center mx-2">
          <p className="text-text-muted">
            Chưa có ứng viên nào ứng tuyển cho công việc này
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-2 flex flex-col mx-2 mb-2">
          <CandidateTable
            candidates={filteredCandidates}
            onUpdateStatus={handleUpdateStatus}
            onScheduleInterview={handleScheduleInterview}
            onViewResume={handleViewResume}
            updatingStatus={updatingStatus}
            viewingCandidate={viewingCandidate}
            setViewingCandidate={setViewingCandidate}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateManager;
