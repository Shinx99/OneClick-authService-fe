"use client";
import React from "react";
import { useRouter } from "next/navigation";

const TITLES = {
  select: "Khởi tạo không gian",
  create: "Tạo công ty mới",
  join: "Gia nhập tổ chức",
  pending: "Chờ phê duyệt",
};

const DESCRIPTIONS = {
  select:
    "Chọn tạo mới nếu công ty bạn chưa có trên hệ thống, hoặc xin gia nhập nếu đồng nghiệp của bạn đã tạo trước đó.",
  create:
    "Điền đầy đủ thông tin pháp lý và hình ảnh nhận diện để hoàn tất hồ sơ công ty của bạn trên hệ thống.",
  join: "Tìm kiếm công ty bạn muốn gia nhập và gửi yêu cầu. Owner của công ty sẽ xem xét và phê duyệt yêu cầu của bạn.",
  pending:
    "Hồ sơ đã gửi thành công. Hệ thống sẽ xem xét và phản hồi trong thời gian sớm nhất.",
};

export default function SetupSidebar({ flowMode, onBack }) {
  const router = useRouter();
  const handleBack = () => {
    // Sau khi đã tạo company xong (pending) → đi thẳng dashboard
    if (flowMode === "pending") {
      router.push("/employer/job-posting");
      return;
    }
    if (flowMode !== "select") onBack?.();
    else router.push("/employer/job-posting");
  };

  return (
    <div className="hidden md:flex w-full md:w-[30%] bg-gradient-to-b from-[#0a2e1a] to-[#0f172a] p-8 border-r-2 border-emerald-900/30 flex-col relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl"></div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 relative z-10">
        <div className="w-11 h-11 bg-[#e8f5e9] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
          <svg
            className="w-7 h-7 text-[#00c853]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-white text-lg tracking-tight">
            One-Click
          </span>
          <p className="text-[10px] text-emerald-400/70 font-medium uppercase tracking-widest">
            For Employers
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            {flowMode === "select"
              ? "Bước 1 / 3"
              : flowMode === "create" || flowMode === "join"
                ? "Bước 2 / 3"
                : "Hoàn tất"}
          </span>
        </div>

        <h3 className="font-semibold text-white text-[17px] mb-3 leading-snug">
          {TITLES[flowMode]}
        </h3>
        <p className="text-[13px] text-slate-400 font-normal leading-relaxed">
          {DESCRIPTIONS[flowMode]}
        </p>
      </div>

      {/* Bottom back link */}
      <div className="mt-auto pt-8 relative z-10">
        <button
          onClick={handleBack}
          className="text-[12px] text-slate-500 hover:text-emerald-400 uppercase tracking-widest font-medium transition-colors flex items-center gap-2"
        >
          <span className="text-lg">←</span>
          {flowMode === "pending"
            ? "Quay lại"
            : flowMode !== "select"
              ? "Quay lại lựa chọn"
              : "Quay lại"}
        </button>
      </div>
    </div>
  );
}
