"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// Tạm thời tạo schema nội bộ nếu muốn, hoặc import từ lib/validators/auth
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

const EmployerLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    // TODO: Gọi API login
    console.log("Login data:", data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-[520px] mx-auto py-8">
      {/* Logo */}
      <div className="mb-10">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group w-fit">
          <div className="w-9 h-9 bg-[#e8f5e9] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              className="w-6 h-6 text-[#00c853]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
            One-Click
          </span>
        </Link>
      </div>

      {/* Headings */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#00c853] mb-3 leading-tight">
        Chào mừng quý đối tác đến với One-Click Nhà tuyển dụng
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Khám phá nhân tài, tuyển dụng thần tốc với nền tảng tích hợp AI
      </p>

      {/* Google Login */}
      <Button variant="social" className="mb-6 rounded-xl border-gray-200">
        <FcGoogle className="text-xl" />
        <span className="font-semibold text-gray-700">Sign in with Google</span>
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] bg-gray-200 flex-1"></div>
        <span className="text-xs text-gray-400 font-medium">Hoặc tiếp tục với</span>
        <div className="h-[1px] bg-gray-200 flex-1"></div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-5 relative">
          <Input
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            }
            placeholder="Nhập email của bạn"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-[11px] font-semibold mt-1 ml-1 absolute -bottom-4">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-8 relative">
          <div className="flex justify-end mb-1 mr-1">
            <Link href="#" className="text-xs font-bold text-[#00c853] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            }
            type="password"
            placeholder="Nhập mật khẩu"
            {...register("password")}
            rightElement={
              <button type="button" className="text-gray-400 hover:text-gray-600 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            }
          />
          {errors.password && (
            <p className="text-red-500 text-[11px] font-semibold mt-1 ml-1 absolute -bottom-4">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="rounded-xl w-full"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-xs text-gray-500 font-medium mt-8">
        Chưa có tài khoản?{" "}
        <Link href="#" className="text-[#00c853] font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default EmployerLoginForm;
