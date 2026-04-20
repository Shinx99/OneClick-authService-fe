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
    email: "tranb.dev@gmail.com",
    role: "Senior Frontend",
    exp: "3 năm",
    status: "APPLIED",
    time: "2 giờ trước",
    match: 85,
    date: "20/04/2026",
  },
  {
    id: "C2",
    jobId: "job-01",
    name: "Lê Văn C",
    email: "levanc99@gmail.com",
    role: "Senior Frontend",
    exp: "Fresher",
    status: "APPLIED",
    time: "5 giờ trước",
    match: 60,
    date: "19/04/2026",
  },
  {
    id: "C3",
    jobId: "job-02",
    name: "Phạm D",
    email: "phamd.backend@gmail.com",
    role: "Backend Developer",
    exp: "4 năm",
    status: "REVIEWING",
    time: "1 ngày trước",
    match: 92,
    date: "18/04/2026",
  },
  {
    id: "C4",
    jobId: "job-02",
    name: "Nguyễn E",
    email: "nguyene.it@gmail.com",
    role: "Backend Developer",
    exp: "5 năm",
    status: "INTERVIEW",
    time: "2 ngày trước",
    match: 88,
    date: "15/04/2026",
  },
  {
    id: "C5",
    jobId: "job-01",
    name: "Hoàng F",
    email: "hoangf.dev@gmail.com",
    role: "Senior Frontend",
    exp: "1 năm",
    status: "REJECTED",
    time: "3 ngày trước",
    match: 40,
    date: "10/04/2026",
  },
  {
    id: "C6",
    jobId: "job-01",
    name: "Vũ Thị G",
    email: "vuthi.g@gmail.com",
    role: "Senior Frontend",
    exp: "4 năm",
    status: "HIRED",
    time: "1 tuần trước",
    match: 95,
    date: "05/04/2026",
  },

  // thêm mới
  {
    id: "C7",
    jobId: "job-02",
    name: "Đỗ H",
    email: "doh@gmail.com",
    role: "Backend Developer",
    exp: "2 năm",
    status: "APPLIED",
    time: "3 giờ trước",
    match: 70,
    date: "20/04/2026",
  },
  {
    id: "C8",
    jobId: "job-03",
    name: "Bùi I",
    email: "buii@gmail.com",
    role: "Fullstack",
    exp: "3 năm",
    status: "REVIEWING",
    time: "6 giờ trước",
    match: 82,
    date: "19/04/2026",
  },
  {
    id: "C9",
    jobId: "job-03",
    name: "Ngô K",
    email: "ngok@gmail.com",
    role: "Fullstack",
    exp: "1 năm",
    status: "APPLIED",
    time: "8 giờ trước",
    match: 65,
    date: "19/04/2026",
  },
  {
    id: "C10",
    jobId: "job-02",
    name: "Phan L",
    email: "phanl@gmail.com",
    role: "Backend Developer",
    exp: "6 năm",
    status: "INTERVIEW",
    time: "1 ngày trước",
    match: 90,
    date: "18/04/2026",
  },
  {
    id: "C11",
    jobId: "job-01",
    name: "Trịnh M",
    email: "trinhm@gmail.com",
    role: "Senior Frontend",
    exp: "2 năm",
    status: "REVIEWING",
    time: "2 ngày trước",
    match: 75,
    date: "17/04/2026",
  },
  {
    id: "C12",
    jobId: "job-03",
    name: "Lý N",
    email: "lyn@gmail.com",
    role: "Fullstack",
    exp: "5 năm",
    status: "HIRED",
    time: "3 ngày trước",
    match: 93,
    date: "16/04/2026",
  },
  {
    id: "C13",
    jobId: "job-02",
    name: "Hồ O",
    email: "hoo@gmail.com",
    role: "Backend Developer",
    exp: "3 năm",
    status: "REJECTED",
    time: "4 ngày trước",
    match: 55,
    date: "15/04/2026",
  },
  {
    id: "C14",
    jobId: "job-01",
    name: "Tạ P",
    email: "tap@gmail.com",
    role: "Senior Frontend",
    exp: "4 năm",
    status: "INTERVIEW",
    time: "5 ngày trước",
    match: 87,
    date: "14/04/2026",
  },
  {
    id: "C15",
    jobId: "job-03",
    name: "Đặng Q",
    email: "dangq@gmail.com",
    role: "Fullstack",
    exp: "2 năm",
    status: "APPLIED",
    time: "6 ngày trước",
    match: 68,
    date: "13/04/2026",
  },
  {
    id: "C16",
    jobId: "job-02",
    name: "Võ R",
    email: "vor@gmail.com",
    role: "Backend Developer",
    exp: "7 năm",
    status: "HIRED",
    time: "1 tuần trước",
    match: 96,
    date: "12/04/2026",
  },
  {
    id: "C17",
    jobId: "job-01",
    name: "Phùng S",
    email: "phungs@gmail.com",
    role: "Senior Frontend",
    exp: "3 năm",
    status: "REVIEWING",
    time: "1 tuần trước",
    match: 80,
    date: "11/04/2026",
  },
  {
    id: "C18",
    jobId: "job-03",
    name: "Mai T",
    email: "mait@gmail.com",
    role: "Fullstack",
    exp: "1 năm",
    status: "APPLIED",
    time: "1 tuần trước",
    match: 62,
    date: "10/04/2026",
  },
  {
    id: "C19",
    jobId: "job-02",
    name: "Đinh U",
    email: "dinhu@gmail.com",
    role: "Backend Developer",
    exp: "4 năm",
    status: "INTERVIEW",
    time: "1 tuần trước",
    match: 89,
    date: "09/04/2026",
  },
  {
    id: "C20",
    jobId: "job-01",
    name: "Kiều V",
    email: "kieuv@gmail.com",
    role: "Senior Frontend",
    exp: "5 năm",
    status: "HIRED",
    time: "2 tuần trước",
    match: 94,
    date: "08/04/2026",
  },
];

const CandidateManager = () => {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [viewMode, setViewMode] = useState("table"); // Tạm đổi mặc định sang table để test
  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);

  const filteredCandidates = useMemo(() => {
    if (selectedJob === "all") return candidates;
    return candidates.filter((c) => c.jobId === selectedJob);
  }, [selectedJob, candidates]);

  return (
    // FIX 1: Dùng class động cho thẻ bọc ngoài cùng
    <div
      className={`flex flex-col w-full animate-in fade-in duration-500 space-y-4 ${
        viewMode === "board"
          ? "h-[calc(100vh-8rem)] overflow-hidden" // Kanban thì khóa chiều cao
          : "min-h-[calc(100vh-8rem)]" // Table thì thả rông chiều cao
      }`}
    >
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

          {/* <div className="w-full sm:w-auto flex items-center bg-white dark:bg-slate-800 border rounded-xl p-1 shadow-sm shrink-0">
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
          </div> */}
        </div>
      </div>

      {/* STATS */}
      <div className="shrink-0 px-2">
        <CandidateStats candidates={filteredCandidates} />
      </div>

      {/* MAIN CONTENT AREA */}
      {/* FIX 2: Dùng class động cho thẻ chứa nội dung */}
      {/* <div
        className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-2 flex flex-col mx-2 mb-2 ${
          viewMode === "board" ? "flex-1 min-h-0 overflow-hidden" : ""
        }`}
      >
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
      </div> */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-2 flex flex-col mx-2 mb-2">
        <CandidateTable
          candidates={filteredCandidates}
          setCandidates={setCandidates}
        />
      </div>
    </div>
  );
};

export default CandidateManager;
