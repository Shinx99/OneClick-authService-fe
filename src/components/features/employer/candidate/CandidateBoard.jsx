"use client";
import React from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import toast from "react-hot-toast";

const BOARD_COLUMNS = [
  {
    id: "APPLIED",
    title: "Mới ứng tuyển",
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    id: "REVIEWING",
    title: "Đang xem xét",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: "INTERVIEW",
    title: "Phỏng vấn",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    id: "OFFERED",
    title: "Đề nghị Offer",
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    id: "HIRED",
    title: "Đã tuyển",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: "REJECTED",
    title: "Từ chối",
    color: "bg-rose-50 text-rose-600 border-rose-200",
  },
];

const CandidateBoard = ({ candidates, setCandidates }) => {
  const handleDragStart = (e, candidateId) => {
    e.dataTransfer.setData("candidateId", candidateId);
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("candidateId");
    const candidate = candidates.find((c) => c.id === candidateId);

    if (candidate && candidate.status !== targetStatus) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, status: targetStatus } : c,
        ),
      );
      toast.success(
        `Đã chuyển ${candidate.name} sang ${BOARD_COLUMNS.find((col) => col.id === targetStatus).title}`,
      );
    }
  };

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar pt-2 px-2">
      {/* SỬA TẠI ĐÂY: Thay `min-w-max` thành `w-full`, thêm `min-w-[1100px]` để chống vỡ thẻ trên màn siêu nhỏ */}
      <div className="flex gap-3 h-full w-full min-w-[1100px] pb-4">
        {BOARD_COLUMNS.map((column) => {
          const columnCandidates = candidates.filter(
            (c) => c.status === column.id,
          );
          return (
            <div
              key={column.id}
              /* SỬA TẠI ĐÂY: Dùng `flex-1` để chia đều không gian thay vì cố định width */
              className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-700/50"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Header Cột */}
              <div className="px-3 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg border truncate ${column.color}`}
                  >
                    {column.title}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm shrink-0">
                    {columnCandidates.length}
                  </span>
                </div>
              </div>

              {/* Danh sách Thẻ (Cards) */}
              <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-2">
                {columnCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-white dark:bg-[#1e293b] p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                  >
                    {/* Header Thẻ */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-sm">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13px] font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                          {candidate.name}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate">
                          {candidate.role}
                        </p>
                      </div>
                    </div>

                    {/* Thao tác & Phù hợp */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex gap-1.5">
                        <button
                          className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 transition-all"
                          title="Gửi Email"
                        >
                          <FaEnvelope size={10} />
                        </button>
                        <button
                          className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 transition-all"
                          title="Gọi điện"
                        >
                          <FaPhone size={10} />
                        </button>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md text-center ${candidate.match >= 80 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        Match {candidate.match}%
                      </span>
                    </div>
                  </div>
                ))}

                {/* Vùng thả trống */}
                {columnCandidates.length === 0 && (
                  <div className="h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[11px] font-bold text-slate-400">
                    Thả hồ sơ...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateBoard;
