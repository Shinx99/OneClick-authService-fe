"use client";
import React, { useState } from "react";
import { FiShield, FiArrowRight, FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const RestrictedWrapper = ({ children }) => {
  const router = useRouter();

  // Fake State (Thay bằng dữ liệu từ AuthContext/API sau này)
  const [accountStatus, setAccountStatus] = useState("unverified");

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* --- DEV TOOL MÔ PHỎNG (Xóa khi có BE) --- */}
      {/* FIX: Chuyển thành fixed, đặt ở bottom-6, và né Sidebar ra bằng md:left-[17rem] */}
      <div className="fixed bottom-6 left-6 md:left-[17rem] z-[999] flex gap-2 p-2 bg-card-bg border border-card-border rounded-xl shadow-lg backdrop-blur-md bg-opacity-90 transition-all">
        <button
          onClick={() => setAccountStatus("unverified")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            accountStatus === "unverified"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" // Đổi màu Bị khóa sang đỏ cho dễ nhận diện
              : "text-text-muted hover:bg-background"
          }`}
        >
          Bị Khóa
        </button>
        <button
          onClick={() => setAccountStatus("verified")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            accountStatus === "verified"
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : "text-text-muted hover:bg-background"
          }`}
        >
          Mở Khóa
        </button>
      </div>

      {/* --- NỘI DUNG BỊ MỜ (BACKGROUND) --- */}
      <div
        className={`transition-all duration-700 w-full flex-1 ${
          accountStatus !== "verified"
            ? "opacity-30 grayscale-[40%] pointer-events-none select-none blur-[4px]"
            : "opacity-100 blur-0"
        }`}
      >
        {children}
      </div>

      {/* --- POP-UP OVERLAY (CHỈ HIỆN KHI BỊ KHÓA) --- */}
      {accountStatus !== "verified" && (
        <div className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-[100] flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm z-40 transition-colors duration-300"></div>

          <div className="relative z-50 bg-card-bg border border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
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
    </div>
  );
};

export default RestrictedWrapper;
