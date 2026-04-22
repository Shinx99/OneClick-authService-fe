"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaClock, FaArrowRight } from "react-icons/fa";

/**
 * Màn hiển thị sau khi user xác thực / tạo công ty thành công.
 * Báo "đang chờ admin duyệt" và cho CTA về dashboard.
 */
export default function PendingApprovalScreen({ companyName }) {
  const router = useRouter();

  return (
    <div className="p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-full text-center">
      {/* Icon tick lớn */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
        <div className="relative w-24 h-24 bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/30 rounded-full flex items-center justify-center shadow-inner">
          <FaCheckCircle className="text-5xl text-[#00c853]" />
        </div>
      </div>

      {/* Badge pending */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-widest mb-4">
        <FaClock size={12} /> Đang chờ duyệt
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-text-main mb-3">
        Xác thực công ty thành công!
      </h2>

      {companyName && (
        <p className="text-[15px] text-text-main font-medium mb-2">
          {companyName}
        </p>
      )}

      <p className="text-[14px] text-text-muted leading-relaxed max-w-md mb-8">
        Hồ sơ công ty của bạn đã được gửi tới Admin OneClick. Chúng tôi sẽ xem
        xét và phản hồi trong vòng{" "}
        <strong className="text-text-main">24 giờ làm việc</strong>. Bạn sẽ nhận
        được thông báo ngay khi công ty được duyệt.
      </p>

      {/* Timeline */}
      <div className="w-full max-w-md bg-background border-2 border-card-border rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#00c853] text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-text-main">
              Gửi hồ sơ công ty
            </p>
            <p className="text-[11px] text-text-muted">Hoàn tất</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center text-sm">
            <FaClock size={14} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-text-main">
              Admin OneClick duyệt
            </p>
            <p className="text-[11px] text-text-muted">Đang xử lý...</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-sm font-bold">
            3
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-text-muted">
              Bắt đầu tuyển dụng
            </p>
            <p className="text-[11px] text-text-muted">
              Mở khoá sau khi duyệt
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/employer/dashboard")}
        className="px-10 py-4 bg-indigo-600 text-white text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
      >
        Về Dashboard <FaArrowRight size={12} />
      </button>
    </div>
  );
}
