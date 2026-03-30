"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validators/auth";
import { FaUser, FaLock, FaIdCard, FaPhone } from "react-icons/fa";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";

const RegisterForm = () => {
  const { register: executeRegister, isLoading } = useAuth();

  const {
    register, // Hàm này của useForm dùng để gắn vào thẻ input
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
      isEmployer: false,
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.username, // Form đặt là username, nhưng gửi lên DB là email
      password: data.password,
      roles: [data.isEmployer ? "recruiter" : "candidate"],
    };

    // 2. Gửi đi (Hàm này đã có sẵn toast và tự chuyển trang bên trong AuthContext)
    await executeRegister(payload);
  };

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        Đăng ký tài khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- HỌ VÀ TÊN --- */}
        <div className="mb-5 relative">
          <Input
            icon={<FaIdCard />}
            placeholder="Họ và tên"
            autoComplete="name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.fullName.message}
            </p>
          )}
        </div>
        {/* --- SỐ ĐIÊN THOẠI --- */}
        <div className="mb-5 relative">
          <Input
            icon={<FaPhone />}
            type="tel"
            placeholder="Số điện thoại"
            autoComplete="tel"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* --- EMAIL --- */}
        <div className="mb-5 relative">
          <Input
            icon={<FaUser />}
            placeholder="Email"
            autoComplete="username"
            {...register("username")}
          />
          {errors.username && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* --- MẬT KHẨU --- */}
        <div className="mb-5 relative">
          <Input
            icon={<FaLock />}
            placeholder="Mật khẩu"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* --- XÁC NHẬN MẬT KHẨU --- */}
        <div className="mb-4 relative">
          <Input
            icon={<FaLock />}
            placeholder="Xác nhận mật khẩu"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* --- ĐIỀU KHOẢN --- */}
        <div className="mb-4 mt-2 px-1 relative">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              {...register("terms")}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer transition-all mt-[2px]"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-600 cursor-pointer leading-tight"
            >
              Tôi đã đọc và đồng ý với{" "}
              <span className="text-[#0056b3] font-semibold hover:underline">
                Điều khoản
              </span>{" "}
              và{" "}
              <span className="text-[#0056b3] font-semibold hover:underline">
                Bảo mật
              </span>
              .
            </label>
          </div>
          {errors.terms && (
            <p className="absolute top-full left-1 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.terms.message}
            </p>
          )}
        </div>

        {/* --- CHECKBOX NHÀ TUYỂN DỤNG --- */}
        <div className="mb-6 px-1 relative">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="isEmployer"
              {...register("isEmployer")}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer transition-all mt-[2px]"
            />
            <label
              htmlFor="isEmployer"
              className="text-sm font-medium text-slate-700 cursor-pointer leading-tight"
            >
              Tôi là nhà tuyển dụng
            </label>
          </div>
        </div>

        {/* --- NÚT ĐĂNG KÝ (Bị khóa nếu isLoading = true) --- */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-[180px] mx-auto bg-green-600 hover:bg-green-700 hover:shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
        </Button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            OneClick
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>


      </form>
    </div>
  );
};

export default RegisterForm;
