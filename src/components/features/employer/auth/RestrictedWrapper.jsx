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
    // Bỏ min-h và rounded đi để Wrapper tự động ôm trọn children
    <div className="relative w-full h-full flex flex-col">
      {/* --- DEV TOOL MÔ PHỎNG (Xóa khi có BE) --- */}
      <div className="absolute top-0 right-0 z-40 flex gap-2 p-2 bg-card-bg border border-card-border rounded-xl shadow-sm">
        <button
          onClick={() => setAccountStatus("unverified")}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
            accountStatus === "unverified"
              ? "bg-[#00c853] text-white"
              : "text-text-muted hover:bg-background"
          }`}
        >
          Bị Khóa
        </button>
        <button
          onClick={() => setAccountStatus("verified")}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
            accountStatus === "verified"
              ? "bg-indigo-500 text-white"
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

      {/* --- POP-UP OVERLAY (ĐÃ FIX LỖI ĐỔ BÓNG GIỚI HẠN) --- */}
      {accountStatus !== "verified" && (
        // FIX 1: Đổi absolute thành fixed.
        // Dùng left-0 trên mobile, và left-64 trên PC để né đúng cái Sidebar 256px ra.
        <div className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-[100] flex items-center justify-center animate-in fade-in duration-500">
          {/* FIX 2: Bỏ rounded-[2rem] đi. Lớp mờ này giờ sẽ trải phẳng phiu ra sát 4 mép màn hình bên phải */}
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm z-40 transition-colors duration-300"></div>

          {/* Hộp thoại Pop-up */}
          <div className="relative z-50 bg-card-bg border border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            {/* Icon Khóa */}
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 bg-indigo-400/20 rounded-full animate-ping opacity-50"></div>
              <FiLock className="text-3xl text-indigo-500 relative z-10" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiShield size={14} /> Tính năng giới hạn
            </div>

            {/* Nội dung */}
            <h2 className="text-2xl font-medium text-text-main mb-3">
              Yêu cầu xác thực doanh nghiệp
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-8">
              Để đảm bảo chất lượng nền tảng, bạn cần khai báo thông tin pháp lý
              của doanh nghiệp trước khi có thể đăng tin tuyển dụng và tìm kiếm
              ứng viên.
            </p>

            {/* Nút Call to action */}
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
