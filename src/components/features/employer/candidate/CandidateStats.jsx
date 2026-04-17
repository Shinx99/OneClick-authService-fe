"use client";
import React from "react";
import {
  FaInbox,
  FaRegEye,
  FaRegCalendarCheck,
  FaRegHandshake,
} from "react-icons/fa";

const CandidateStats = ({ candidates }) => {
  // Tự động tính toán số liệu dựa trên mảng CV thực tế
  const total = candidates.length;
  const appliedCount = candidates.filter((c) => c.status === "APPLIED").length;
  const interviewingCount = candidates.filter(
    (c) => c.status === "INTERVIEW",
  ).length;
  const hiredCount = candidates.filter((c) =>
    ["OFFERED", "HIRED"].includes(c.status),
  ).length;

  const stats = [
    {
      label: "Tổng CV tiếp nhận",
      value: total,
      icon: FaInbox,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "CV mới (Chưa xem)",
      value: appliedCount,
      icon: FaRegEye,
      bg: "bg-rose-50 text-rose-600",
    },
    {
      label: "Đang phỏng vấn",
      value: interviewingCount,
      icon: FaRegCalendarCheck,
      bg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Đã tuyển dụng",
      value: hiredCount,
      icon: FaRegHandshake,
      bg: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-700 p-5 flex items-center gap-5 hover:shadow-md transition-all group"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} group-hover:scale-110 transition-transform`}
            >
              <Icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CandidateStats;
