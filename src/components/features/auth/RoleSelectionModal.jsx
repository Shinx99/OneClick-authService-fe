"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiBriefcase, FiArrowRight } from "react-icons/fi";

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={`bg-gradient-to-br from-white to-slate-50/70 dark:from-[#1e293b] dark:to-[#0f172a] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700 backdrop-blur-sm relative transition-all duration-500 ${isShaking
            ? "animate-shake ring-4 ring-[#00c853]/40 shadow-3xl"
            : "hover:shadow-3xl hover:-translate-y-2 animate-slideUp"
            }`}
        >
          {/* Gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00c853] via-emerald-400 to-[#00c853] shadow-sm"></div>

          <div className="p-10 text-center relative z-10">
            {/* Floating icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl animate-float hover:animate-none group-hover:scale-110 transition-all duration-300 border-4 border-white/50">
              <FiBriefcase className="text-4xl text-[#00c853] drop-shadow-lg" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 dark:from-gray-100 dark:via-gray-200 dark:to-slate-300 bg-clip-text text-transparent mb-4 leading-tight">
              Nhà Tuyển Dụng
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-2 font-semibold leading-relaxed">
              Tạo tài khoản công ty
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed max-w-md mx-auto">
              Đăng tin tuyển dụng nhanh chóng và tìm kiếm nhân tài chất lượng cao
              cho doanh nghiệp của bạn.
            </p>

            {/* CTA Button */}
            <Link
              href="/help-center"
              onClick={onClose}
              className="group relative w-full max-w-sm mx-auto block bg-gradient-to-r from-[#00c853] to-emerald-500 text-white font-black py-5 px-8 rounded-2xl hover:from-[#00b04a] hover:to-emerald-400 focus:outline-none focus:ring-4 focus:ring-[#00c853]/50 shadow-2xl hover:shadow-3xl active:scale-[0.97] active:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                Bắt đầu ngay
                <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100/50 dark:border-gray-700 flex items-center justify-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Đã có tài khoản?</span>
              <Link
                href="/login"
                className="text-[#00c853] hover:text-[#00b04a] underline decoration-2 underline-offset-4 font-bold text-sm transition-colors hover:no-underline"
                onClick={onClose}
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelectionModal;