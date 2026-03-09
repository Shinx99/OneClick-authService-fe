"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validators/auth";
import { FaUser, FaLock, FaFacebook, FaIdCard } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("🚀 Payload gửi lên API /api/auth/register:", data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ✅ Hiển thị Toast thành công
      toast.success("Dữ liệu hợp lệ! Chuẩn bị tạo tài khoản...");
    } catch (error) {
      console.error("Lỗi:", error);
      // ✅ Hiển thị Toast thất bại
      toast.error("Đăng ký thất bại, vui lòng kiểm tra lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        Đăng ký tài khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
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

        {/* Checkbox: Gọn lại mb-4 mt-2 */}
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

        {/* Nút Đăng ký */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-[180px] mx-auto bg-green-600 hover:bg-green-700 hover:shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
        </Button>

        {/* Divider: Thu lại my-4 */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            Hoặc đăng ký với
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        {/* Nút Social */}
        <div className="space-y-2.5">
          <Button variant="social" type="button">
            <FcGoogle className="text-[22px]" />
            <span className="text-sm font-semibold text-gray-700">Google</span>
          </Button>
          <Button variant="social" type="button">
            <FaFacebook className="text-[#1877F2] text-[22px]" />
            <span className="text-sm font-semibold text-gray-700">
              Facebook
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
