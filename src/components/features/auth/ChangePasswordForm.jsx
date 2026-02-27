"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ChangePasswordForm() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-[40px] shadow-sm border border-gray-50 text-center">
      {/* Icon Header */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Đặt lại mật khẩu mới
      </h2>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn bên dưới.
      </p>

      <form className="space-y-6 text-left">
        {/* Mật khẩu hiện tại */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <span className="text-green-600">🔑</span> Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 pr-12 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("current")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.current ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <span className="text-green-600">🔒</span> Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 pr-12 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.new ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <span className="text-green-600">✅</span> Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 pr-12 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Nút bấm */}
        <div className="pt-4">
          <Button className="w-full bg-[#288a24] hover:bg-[#1e6b1b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all">
            Cập nhật mật khẩu
          </Button>
          <button
            type="button"
            className="w-full mt-6 text-sky-400 text-sm font-medium hover:underline"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
