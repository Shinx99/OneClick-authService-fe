"use client";
import React, { useEffect, useState } from "react";
import { FiShield, FiArrowRight, FiLock, FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/**
 * Trạng thái công ty của recruiter (đọc từ localStorage tạm thời,
 * sau này thay bằng GET /api/recruitment/employer/profile).
 *
 * - "none"     : chưa tạo company  → popup "Yêu cầu xác thực"
 * - "pending"  : đã tạo, chờ admin → popup "Đang chờ admin duyệt"
 * - "verified" : admin đã duyệt    → mở khoá dashboard
 */
const RestrictedWrapper = ({ children }) => {
  const router = useRouter();
  const [companyState, setCompanyState] = useState(null); // null = đang check

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasCompany = localStorage.getItem("hasCompany") === "1";
    const status = localStorage.getItem("companyStatus"); // "pending" | "verified" | ...
    if (!hasCompany) setCompanyState("none");
    else if (status === "verified") setCompanyState("verified");
    else setCompanyState("pending"); // mặc định pending khi chưa biết status thật
  }, []);

  const locked = companyState === "none" || companyState === "pending";

  return (
    <div className="relative w-full min-h-[65vh] rounded-[2rem] ">
      {/* --- NỘI DUNG (BACKGROUND) --- */}
      <div
        className={`transition-all duration-700 w-full h-full ${
          locked
            ? "opacity-30 grayscale-[40%] pointer-events-none select-none blur-[4px]"
            : "opacity-100 blur-0"
        }`}
      >
        {children}
      </div>

      {/* ============ POPUP: CHƯA CÓ COMPANY ============ */}
      {companyState === "none" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] rounded-[2rem] z-40"></div>

          <div className="relative z-50 bg-card-bg border-2 border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 bg-indigo-400/20 rounded-full animate-ping opacity-50"></div>
              <FiLock className="text-3xl text-indigo-500 relative z-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiShield size={14} /> Tính năng giới hạn
            </div>

            <h2 className="text-2xl font-medium text-text-main mb-3">
              Yêu cầu xác thực doanh nghiệp
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-8">
              Để đảm bảo chất lượng nền tảng, bạn cần khai báo thông tin pháp lý
              của doanh nghiệp trước khi có thể đăng tin tuyển dụng và tìm kiếm
              ứng viên.
            </p>

            <button
              onClick={() => router.push("/employer/setup")}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 text-[13px] uppercase tracking-widest"
            >
              Vui lòng xác thực ngay <FiArrowRight size={16} />
            </button>

            <button
              onClick={() =>
                toast("Vui lòng xác thực để sử dụng tính năng này !!!", {
                  icon: "🔒",
                })
              }
              className="w-full mt-3 py-3 bg-transparent text-text-muted hover:text-text-main rounded-xl font-medium transition-all text-[13px] uppercase tracking-widest"
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      )}

      {/* ============ POPUP: CHỜ ADMIN DUYỆT ============ */}
      {companyState === "pending" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] rounded-[2rem] z-40"></div>

          <div className="relative z-50 bg-card-bg border-2 border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            {/* Icon đồng hồ cát */}
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-100 dark:border-amber-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping opacity-50"></div>
              <FiClock className="text-3xl text-amber-500 relative z-10" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiClock size={14} /> Đang chờ duyệt
            </div>

            <h2 className="text-2xl font-medium text-text-main mb-3">
              Xác thực công ty thành công!
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-6">
              Hồ sơ công ty của bạn đã được gửi tới Admin OneClick. Chúng tôi sẽ
              xem xét và phản hồi trong vòng{" "}
              <strong className="text-text-main">24 giờ làm việc</strong>. Các
              tính năng sẽ tự động mở khoá ngay khi được duyệt.
            </p>

            <div className="w-full bg-background border-2 border-card-border rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#00c853] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-[12px] font-semibold text-text-main">
                  Gửi hồ sơ công ty
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <FiClock size={12} />
                </div>
                <span className="text-[12px] font-semibold text-text-main">
                  Admin OneClick đang xem xét...
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[12px] font-semibold text-text-muted">
                  Mở khoá tuyển dụng
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                toast("Hệ thống sẽ thông báo ngay khi admin duyệt xong!", {
                  icon: "⏳",
                });
              }}
              className="w-full py-3 bg-background border-2 border-card-border text-text-muted hover:text-text-main rounded-xl font-medium transition-all text-[13px] uppercase tracking-widest"
            >
              Tôi đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestrictedWrapper;
