"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validators/auth";
import { FaUser, FaLock } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google"; // ✅ Chỉ giữ GoogleLogin

const LoginForm = () => {
  const { login, isLoading, error, clearError, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data) => {
    login(data.username, data.password);
  };

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
        <div className="mb-6 relative">
          <Input
            icon={<FaUser />}
            placeholder="Email"
            autoComplete="username"
            {...register("username", { onChange: handleUserInteraction })}
          />
          {errors.username && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px]">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-6 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            {...register("password", { onChange: handleUserInteraction })}
          />
          {errors.password && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px]">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href="/forget-password"
            className="text-sm font-semibold text-[#0056b3] hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          onClick={handleUserInteraction}
          disabled={isLoading}
          className="mb-4 w-[160px] mx-auto bg-green-600 hover:bg-green-700 disabled:opacity-70"
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="h-[1px] bg-gray-200 dark:bg-gray-600 flex-1"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-bold px-2">
            Hoặc đăng nhập với
          </span>
          <div className="h-[1px] bg-gray-200 dark:bg-gray-600 flex-1"></div>
        </div>

        {/* Lồng button vào button - KHÔNG TỐT, nhưng nếu bạn muốn: */}
        <Button
          variant="primary"
          type="button"
          // Thay bg-transparent thành bg-white và thêm rounded-full
          className="mb-4 w-[160px] mx-auto p-0 overflow-hidden bg-white hover:bg-gray-50 border-0 rounded-full"
        >
          <GoogleLogin
            onSuccess={(credentialResponse) => loginWithGoogle(credentialResponse)}
            onError={() => console.error("Google error")}
            useOneTap={false}
            size="medium"
            text="signin_with"
            shape="pill"
            width="160"
            theme="filled_blue"
          />
        </Button>



      </form>
    </div>
  );
};

export default LoginForm;
