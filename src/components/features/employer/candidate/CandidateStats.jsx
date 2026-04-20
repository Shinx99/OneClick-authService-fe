"use client";
import React from "react";
import {
  FaInbox,
  FaRegEye,
  FaRegCalendarCheck,
  FaRegHandshake,
  FaUserTimes,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const CandidateStats = ({ candidates }) => {
  // --- TÍNH TOÁN DỮ LIỆU THỰC TẾ ---
  const total = candidates.length;
  const appliedCount = candidates.filter((c) => c.status === "APPLIED").length;
  const interviewingCount = candidates.filter(
    (c) => c.status === "INTERVIEW",
  ).length;
  const hiredCount = candidates.filter((c) => c.status === "HIRED").length;
  const rejectedCount = candidates.filter(
    (c) => c.status === "REJECTED",
  ).length;

  // --- MOCK DATA: CHỈ BÁO XU HƯỚNG ---
  const stats = [
    {
      label: "Tổng CV",
      value: total,
      icon: FaInbox,
      bg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      trend: { value: 12, isPositive: true, text: "so với tháng trước" },
    },
    {
      label: "CV Mới",
      value: appliedCount,
      icon: FaRegEye,
      bg: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      trend: { value: 5, isPositive: true, text: "so với tuần trước" },
    },
    {
      label: "Phỏng vấn",
      value: interviewingCount,
      icon: FaRegCalendarCheck,
      bg: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      trend: { value: 2, isPositive: false, text: "so với tuần trước" },
    },
    {
      label: "Đã tuyển",
      value: hiredCount,
      icon: FaRegHandshake,
      bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      trend: {
        value: total > 0 ? Math.round((hiredCount / total) * 100) : 0,
        isPositive: true,
        text: "tỷ lệ chuyển đổi",
      },
    },
    {
      label: "Từ chối",
      value: rejectedCount,
      icon: FaUserTimes,
      bg: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
      trend: {
        value: total > 0 ? Math.round((rejectedCount / total) * 100) : 0,
        isPositive: false,
        text: "tỷ lệ loại bỏ",
      },
    },
  ];

  return (
    // FIX UI: Lưới chia 5 cột chuẩn xác
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend.isPositive ? FaArrowUp : FaArrowDown;
        const trendColor = stat.trend.isPositive
          ? "text-emerald-500"
          : "text-rose-500";
        const trendBg = stat.trend.isPositive
          ? "bg-emerald-50 dark:bg-emerald-500/10"
          : "bg-rose-50 dark:bg-rose-500/10";

        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group cursor-default relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-[12px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {stat.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
              <div
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${trendBg} ${trendColor} text-[10px] font-bold`}
              >
                <TrendIcon size={8} />
                <span>{stat.trend.value}%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {stat.trend.text}
              </span>
            </div>

            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-5 blur-2xl group-hover:opacity-10 transition-opacity ${stat.bg.split(" ")[0]}`}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default CandidateStats;
