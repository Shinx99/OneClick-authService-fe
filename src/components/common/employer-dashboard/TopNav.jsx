"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MdOutlineSearch,
  MdAdd,
  MdOutlineNotifications,
  MdKeyboardArrowDown,
} from "react-icons/md";

const TopNav = () => {
  const { user } = useAuth();

  const displayName = user?.name || user?.email?.split("@")[0] || "Người dùng";
  const displayEmail = user?.email || "Chưa có email";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    // THÊM gap-6 lg:gap-10 ở đây để tách biệt 3 khu vực (Trái, Giữa, Phải)
    <header className="h-20 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-6 lg:gap-10 px-6 lg:px-10 sticky top-0 z-40 transition-colors">
      {/* Left: Spacer (Ẩn trên mobile/tablet để nhường chỗ) */}
      <div className="hidden lg:block flex-1"></div>

      {/* Center: Modern Search Bar */}
      {/* Sửa lại justify-start lg:justify-center để trên màn nhỏ nó không ép sang phải */}
      <div className="flex-1 flex justify-start lg:justify-center w-full min-w-0">
        <div className="relative w-full max-w-lg group">
          <MdOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm ứng viên, tin tuyển dụng..."
            className="w-full pl-11 pr-16 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-[#0f172a] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[14px] font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-all"
          />
          {/* Nút ⌘K */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center">
            <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-[11px] font-sans font-bold text-slate-400 shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      {/* Đổi flex-1 thành shrink-0 để cụm nút này luôn giữ nguyên kích thước, không bị bóp méo */}
      <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-5">
        {/* Glow Button: Đăng tin mới */}
        <Link
          href="/employer/job-posting/create"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 whitespace-nowrap"
        >
          <MdAdd className="w-5 h-5" />
          Đăng tin mới
        </Link>

        {/* Notification Bell */}
        <button className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-all">
          <MdOutlineNotifications className="w-6 h-6" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 ring-2 ring-white dark:ring-[#0f172a] rounded-full animate-pulse" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* User Profile Area */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-3 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 transition-colors truncate max-w-[140px]">
              {displayName}
            </p>
            <p className="text-[11px] font-medium text-slate-400 truncate max-w-[140px]">
              {displayEmail}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-[14px] font-bold shadow-md ring-2 ring-white dark:ring-[#0f172a] uppercase">
              {avatarLetter}
            </div>
            <MdKeyboardArrowDown className="text-slate-400 group-hover:text-emerald-500 transition-colors w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
