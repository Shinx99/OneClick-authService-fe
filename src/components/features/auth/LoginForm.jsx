"use client"; // Client Component vì có nhập liệu
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import useRouter để chuyển trang
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validators/auth"; // Import bộ luật Zod
import { authService } from "@/services/auth.service"; // Import trạm gọi API
import { FaUser, FaLock, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // 2. Khởi tạo router

  // Khởi tạo form với Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // Hàm xử lý gửi dữ liệu (Chỉ chạy khi pass qua luật Zod)
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 3. Gọi API thật tới Backend
      const result = await authService.login({
        username: data.username,
        password: data.password,
      });

      console.log("🚀 Quà Backend trả về:", result);

      // Tùy thuộc vào JSON của Backend trả về, biến chứa khóa có thể tên là token hoặc accessToken
      const token = result.token || result.accessToken;

      if (token) {
        // 4. Lưu chìa khóa vào két sắt của trình duyệt
        localStorage.setItem("token", token);

        toast.success("Đăng nhập thành công!");

        // 5. Đá người dùng về trang chủ
        router.push("/");
      } else {
        toast.error("Đăng nhập thành công nhưng không lấy được Token!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      // Lấy câu thông báo lỗi từ Backend trả về (nếu có)
      const errorMessage =
        error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!";

      // Báo lỗi bằng Toast đỏ
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Đăng nhập tài khoản
      </h2>

      {/* Bọc form bằng handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- Input Email --- */}
        <div className="mb-6 relative">
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

        {/* --- Input Mật khẩu --- */}
        <div className="mb-6 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* --- Hàng Remember Me và Forget Password --- */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              {...register("remember")}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer transition-all"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800 transition-colors mt-[2px]"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <Link
            href="/forget-password"
            className="text-sm font-semibold text-[#0056b3] hover:underline transition-all"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* --- Nút Submit --- */}
        <Button
          type="submit"
          variant="primary"
          className="mb-4 w-[160px] mx-auto bg-green-600 hover:bg-green-700 hover:shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            Hoặc đăng nhập với
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        {/* Buttons Social */}
        <div className="space-y-3">
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

export default LoginForm;
