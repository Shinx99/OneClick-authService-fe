"use client";
import React from "react";
import Link from "next/link";
import { MdOutlineSearch, MdAdd, MdOutlineNotifications } from "react-icons/md";

const TopNav = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-30">
      {/* Left: Spacer to balance the right side actions */}
      <div className="hidden lg:flex flex-1"></div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        <div className="relative w-full max-w-md">
          <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm việc làm hoặc ứng viên..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex-1 flex items-center justify-end gap-4">
        {/* Post New Job Button */}
        <Link
          href="/employer/job-posting/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
        >
          <MdAdd className="w-5 h-5" />
          <span className="hidden sm:inline">Đăng tin mới</span>
        </Link>

        {/* Notification */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <MdOutlineNotifications className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">Trác</p>
            <p className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">
              Premium/Pro
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
            T
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
