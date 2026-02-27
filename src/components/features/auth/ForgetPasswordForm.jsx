"use client";
import React from "react";
import Link from "next/link";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { MdOutlineLockReset } from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const ForgetPasswordForm = () => {
  return (
    <div className="w-full max-w-[400px] mx-auto p-8 bg-white rounded-[30px] shadow-2xl text-center">
      {/* Icon Header */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <MdOutlineLockReset className="w-10 h-10 text-green-600" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase">
        Quên Mật Khẩu?
      </h2>
      <p className="text-gray-500 text-sm mb-8 font-medium px-2">
        Vui lòng nhập email để nhận mã xác thực.
      </p>

      <form className="text-left">
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
          Email của bạn
        </label>
        <Input
          icon={<FaEnvelope />}
          type="email"
          placeholder="example@email.com"
          name="email"
          required
        />

        <div className="pt-2">
          {/* Nút bấm tự động lấy màu xanh lá từ cấu hình Button.jsx hôm trước */}
          <Button variant="primary" className="w-full mt-2">
            Gửi yêu cầu
          </Button>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#0056b3] font-bold hover:underline transition-all"
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
