"use client";
import React from "react";
import { FaPlus, FaSearch, FaArrowRight, FaBuilding, FaUsers } from "react-icons/fa";

const OPTIONS = [
  {
    mode: "create",
    icon: <FaBuilding size={22} />,
    title: "Tạo công ty mới",
    desc: "Đăng ký mới hồ sơ doanh nghiệp bằng Giấy phép ĐKKD. Phù hợp nếu công ty chưa có trên hệ thống.",
    badge: "Tạo mới",
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500",
    hoverShadow: "hover:shadow-emerald-500/10",
    badgeBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600",
  },
  {
    mode: "join",
    icon: <FaUsers size={22} />,
    title: "Gia nhập công ty",
    desc: "Tìm kiếm và gửi yêu cầu gia nhập công ty đã có sẵn trên hệ thống. Owner sẽ phê duyệt cho bạn.",
    badge: "Gia nhập",
    gradient: "from-teal-500 to-cyan-500",
    iconBg: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-500/20",
    hoverBorder: "hover:border-teal-500",
    hoverShadow: "hover:shadow-teal-500/10",
    badgeBg: "bg-teal-50 dark:bg-teal-500/10 text-teal-600",
  },
];

export default function SelectFlowScreen({ onSelect }) {
  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col justify-center h-full">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-4">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Bắt đầu
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-text-main mb-2">
          Xác thực doanh nghiệp
        </h2>
        <p className="text-[14px] text-text-muted font-normal leading-relaxed">
          Bạn muốn tạo một công ty mới hay gia nhập vào một công ty đã có sẵn trên hệ thống?
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-5">
        {OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            onClick={() => onSelect(opt.mode)}
            className={`flex items-start gap-5 p-6 bg-background border-2 border-card-border ${opt.hoverBorder} rounded-2xl transition-all text-left group hover:shadow-xl ${opt.hoverShadow} relative overflow-hidden`}
          >
            {/* Subtle gradient accent on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${opt.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity`}></div>

            <div
              className={`w-14 h-14 ${opt.iconBg} rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform relative z-10`}
            >
              {opt.icon}
            </div>

            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h4 className="text-[16px] font-semibold text-text-main group-hover:text-emerald-600 transition-colors">
                  {opt.title}
                </h4>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${opt.badgeBg}`}>
                  {opt.badge}
                </span>
              </div>
              <p className="text-[13px] text-text-muted font-normal leading-relaxed">
                {opt.desc}
              </p>
            </div>

            <FaArrowRight
              className="text-text-muted group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 mt-4 shrink-0 relative z-10"
            />
          </button>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
        <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-emerald-500 text-sm">💡</span>
        </div>
        <p className="text-[12px] text-text-muted leading-relaxed">
          Chưa chắc chắn? Bạn có thể <strong className="text-text-main">tìm kiếm tên công ty</strong> trong mục "Gia nhập" để kiểm tra xem công ty đã tồn tại trên hệ thống chưa.
        </p>
      </div>
    </div>
  );
}
