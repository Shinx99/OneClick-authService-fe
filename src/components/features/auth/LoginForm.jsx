"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validators/auth";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  // Lấy các hàm từ AuthContext [cite: 30]
  const { login, isLoading, error, clearError, loginWithGoogle } = useAuth();

  // Khởi tạo logic Google Login (Custom Hook để không bị vỡ UI)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (res) => loginWithGoogle(res),
    onError: () => console.error("Google login failed"),
  });

  // Form setup giữ nguyên như cũ [cite: 19]
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Submit logic
  const onSubmit = (data) => {
    login(data.username, data.password);
  };

  // Hàm xóa lỗi an toàn để tránh lỗi "clearError is not a function"
  const handleUserInteraction = () => {
    if (error && typeof clearError === "function") {
      clearError();
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-gray-100">
        Đăng nhập tài khoản
      </h2>

      {/* HIỂN THỊ ERROR (Giữ nguyên style cũ) */}
      {error && (
        <div className="mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex justify-between items-start gap-3">
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button
                onClick={() => typeof clearError === "function" && clearError()}
                className="text-red-400 hover:text-red-600"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username Input - Giữ nguyên thiết kế cũ */}
        <div className="mb-6 relative">
          <Input
            icon={<FaUser />}
            placeholder="Email"
            autoComplete="username"
            {...register("username", {
              onChange: handleUserInteraction,
            })}
          />
          {errors.username && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px]">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Input - Giữ nguyên thiết kế cũ */}
        <div className="mb-6 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            {...register("password", {
              onChange: handleUserInteraction,
            })}
          />
          {errors.password && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Link Quên mật khẩu */}
        <div className="flex justify-end mb-6">
          <Link
            href="/forget-password"
            className="text-sm font-semibold text-[#0056b3] hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Nút Submit chính - Giữ nguyên style cũ */}
        <Button
          type="submit"
          variant="primary"
          onClick={handleUserInteraction}
          disabled={isLoading}
          className="mb-4 w-[160px] mx-auto bg-green-600 hover:bg-green-700 disabled:opacity-70"
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        {/* Divider (Dấu gạch ngang) - Giữ nguyên style cũ */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="h-[1px] bg-gray-200 dark:bg-gray-600 flex-1"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-bold px-2">
            Hoặc đăng nhập với
          </span>
          <div className="h-[1px] bg-gray-200 dark:bg-gray-600 flex-1"></div>
        </div>

        {/* Nút Google - Thiết kế thủ công để khớp với style cũ của bạn */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="w-full h-[48px] flex items-center justify-center gap-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 rounded-full font-bold text-sm text-slate-700 dark:text-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-[#334155] hover:shadow-md active:scale-95 shadow-sm"
        >
          <FcGoogle size={20} />
          <span>Google</span>
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
