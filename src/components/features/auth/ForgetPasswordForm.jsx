"use client";

import React from "react";
import Link from "next/link";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa"; // npm i react-icons
import { MdOutlineLockReset } from "react-icons/md";
import Button from "@/components/ui/Button";

const ForgetPasswordForm = () => {
  return (
    <div className="w-full max-w-[400px] mx-auto p-8 bg-white rounded-[40px] shadow-sm border border-gray-50 text-center">
      {/* Icon Header - Vòng tròn reset mật khẩu xanh lá */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <MdOutlineLockReset className="w-10 h-10 text-green-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Quên Mật Khẩu?</h2>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed px-2">
        Vui lòng nhập email để nhận mã xác thực.
      </p>

      <form className="space-y-6 text-left">
        {/* Trường Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full bg-white border border-blue-200 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Nút gửi yêu cầu */}
        <div className="pt-2">
          <Button className="w-full bg-[#288a24] hover:bg-[#1e6b1b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
            Gửi yêu cầu
          </Button>
        </div>

        {/* Quay lại đăng nhập */}
        <div className="text-center pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-sky-400 font-semibold hover:underline transition-all"
          >
            <FaArrowLeft className="text-xs" />
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
