"use client";
import React from "react";
import Link from "next/link";
import { MdOutlineVisibility, MdOutlineBarChart } from "react-icons/md";

const WelcomeBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 p-8 text-white shadow-lg">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -right-4 w-28 h-28 bg-white/5 rounded-full" />
      <div className="absolute top-4 right-20 w-16 h-16 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Chào mừng trở lại</h2>
        <p className="text-emerald-100 text-base max-w-lg mb-6 leading-relaxed">
          Quy trình tuyển dụng của bạn đang diễn ra tốt đẹp. Hôm nay bạn có 12
          ứng viên mới cần xem xét trên các tin tuyển dụng đang hoạt động.
        </p>
        <div className="flex gap-3">
          <Link
            href="/employer/candidate"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-sm"
          >
            <MdOutlineVisibility className="w-5 h-5" />
            Xem ứng viên
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white text-sm font-semibold rounded-lg hover:bg-white/25 transition-all duration-200 border border-white/20"
          >
            <MdOutlineBarChart className="w-5 h-5" />
            Xem thống kê
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
