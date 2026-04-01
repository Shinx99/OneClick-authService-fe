"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/lib/validators/auth";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { MdOutlineLockReset } from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const ForgetPasswordForm = () => {
  // 1. Lấy hàm và trạng thái từ Context
  const { sendForgotPasswordEmail, isLoading } = useAuth();

  // 2. Khởi tạo Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // 3. Hàm xử lý khi nhấn nút gửi
  const onSubmit = async (data) => {
    // data.email sẽ được gửi về Backend
    await sendForgotPasswordEmail(data.email);
  };

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
        Vui lòng nhập email để nhận mã xác thực qua thư điện tử.
      </p>

      {/* 4. Thêm handleSubmit vào form */}
      <form onSubmit={handleSubmit(onSubmit)} className="text-left">
        <div className="relative mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            Email của bạn
          </label>
          <Input
            icon={<FaEnvelope />}
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            {...register("email")} // 5. Đăng ký field với hook form
          />
          {/* Hiển thị lỗi validation */}
          {errors.email && (
            <p className="absolute top-full left-1 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          {/* 6. Thêm trạng thái disabled và loading */}
          <Button 
            type="submit"
            variant="primary" 
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
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
