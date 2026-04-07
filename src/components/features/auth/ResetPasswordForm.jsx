// src/components/features/auth/ResetPasswordForm.jsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { ResetPasswordSchema } from "@/lib/validators/auth";
import { FaLock } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Lấy token từ ?token=xxxx trong email
  
  const { executeResetPassword, isLoading } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  const onSubmit = async (data) => {
    if (!token) {
      alert("Token không hợp lệ hoặc đã hết hạn!");
      return;
    }
    // Gọi hàm resetPassword đã viết trong AuthContext
    await executeResetPassword(token, data.password);
  };

  return (
    <div className="w-full max-w-[400px] p-8 bg-white dark:bg-[#1e293b] rounded-[30px] shadow-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
          <RiLockPasswordLine className="w-10 h-10 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-800 dark:text-gray-100 mb-2 uppercase">Thiết lập mật khẩu</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">Nhập mật khẩu mới cho tài khoản của bạn.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">Mật khẩu mới</label>
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">Xác nhận mật khẩu</label>
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" variant="primary" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;