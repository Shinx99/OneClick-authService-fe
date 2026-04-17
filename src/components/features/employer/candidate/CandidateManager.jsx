"use client";
import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CandidateTable from "@/components/features/employer/candidate/CandidateTable";
import CandidateStats from "@/components/features/employer/candidate/CandidateStats";
import CandidateBoard from "@/components/features/employer/candidate/CandidateBoard";
import { MdViewList, MdViewColumn } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";

// MOCK DATA TẬP TRUNG TẠI ĐÂY
const INITIAL_CANDIDATES = [
  {
    id: "C1",
    jobId: "job-01",
    name: "Trần Thị B",
    role: "Senior Frontend",
    exp: "3 năm",
    status: "APPLIED",
    time: "2 giờ trước",
    match: 85,
  },
  {
    id: "C2",
    jobId: "job-01",
    name: "Lê Văn C",
    role: "Senior Frontend",
    exp: "Fresher",
    status: "APPLIED",
    time: "5 giờ trước",
    match: 60,
  },
  {
    id: "C3",
    jobId: "job-02",
    name: "Phạm D",
    role: "Backend Developer",
    exp: "4 năm",
    status: "REVIEWING",
    time: "1 ngày trước",
    match: 92,
  },
  {
    id: "C4",
    jobId: "job-02",
    name: "Nguyễn E",
    role: "Backend Developer",
    exp: "5 năm",
    status: "INTERVIEW",
    time: "2 ngày trước",
    match: 88,
  },
  {
    id: "C5",
    jobId: "job-01",
    name: "Hoàng F",
    role: "Senior Frontend",
    exp: "1 năm",
    status: "REJECTED",
    time: "3 ngày trước",
    match: 40,
  },
  {
    id: "C6",
    jobId: "job-01",
    name: "Vũ Thị G",
    role: "Senior Frontend",
    exp: "4 năm",
    status: "HIRED",
    time: "1 tuần trước",
    match: 95,
  },
];

const CandidateManager = () => {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [viewMode, setViewMode] = useState("board");
  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);

  // Auto-filter dựa theo Job đang chọn
  const filteredCandidates = useMemo(() => {
    if (selectedJob === "all") return candidates;
    return candidates.filter((c) => c.jobId === selectedJob);
  }, [selectedJob, candidates]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full overflow-hidden animate-in fade-in duration-500 space-y-4">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0 px-2 pt-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Quy trình tuyển dụng và quản lý ứng viên
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Đánh giá, phân loại và kết nối với nhân tài
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus-within:border-emerald-500 transition-colors">
            <FaBriefcase className="text-emerald-500 shrink-0" />
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="bg-transparent text-[14px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none w-full sm:w-[250px]"
            >
              <option value="all">Tất cả tin tuyển dụng</option>
              <option value="job-01">Senior Frontend Engineer (ReactJS)</option>
              <option value="job-02">Backend Developer (Java/Spring)</option>
              <option value="job-03">UI/UX Designer</option>
            </select>
          </div>

          <div className="w-full sm:w-auto flex items-center bg-white dark:bg-slate-800 border rounded-xl p-1 shadow-sm shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap ${
                viewMode === "table"
                  ? "bg-emerald-50 text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <MdViewList className="w-5 h-5 shrink-0" />
              Danh sách
            </button>

            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold whitespace-nowrap ${
                viewMode === "board"
                  ? "bg-emerald-50 text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <MdViewColumn className="w-5 h-5 shrink-0" />
              Quy trình tuyển dụng
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="shrink-0 px-2">
        <CandidateStats candidates={filteredCandidates} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-2 flex flex-col mx-2 mb-2">
        {viewMode === "table" ? (
          <CandidateTable
            candidates={filteredCandidates}
            setCandidates={setCandidates}
          />
        ) : (
          <CandidateBoard
            candidates={filteredCandidates}
            setCandidates={setCandidates}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateManager;
