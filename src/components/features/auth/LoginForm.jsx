"use client"; // Client Component vì có nhập liệu
import React from "react";
import Link from "next/link";
import { FaUser, FaLock, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const LoginForm = () => {
  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Đăng nhập tài khoản
      </h2>

      <form>
        <Input icon={<FaUser />} placeholder="Email" name="username" />
        <Input
          icon={<FaLock />}
          type="password"
          placeholder="Mật khẩu"
          name="password"
        />

        {/* --- CẬP NHẬT: Hàng Remember Me và Forget Password --- */}
        <div className="flex items-center justify-between mb-6 -mt-2 px-1">
          {/* Checkbox Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer transition-all"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          {/* Link Forget Password */}
          <Link
            href="/forget-password"
            className="text-sm font-semibold text-[#0056b3] hover:underline transition-all"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          variant="primary"
          className="mb-4 w-[160px] mx-auto bg-green-600 hover:bg-green-700 hover:shadow-green-600/30"
        >
          Đăng nhập
        </Button>
        {/* <div className="text-center mb-8">
          <Link
            href="/register"
            className="text-sm text-[#0056b3] font-medium hover:underline"
          >
            Create account
          </Link>
        </div> */}
        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            Hoặc đăng nhập với
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        <div className="space-y-3">
          <Button variant="social">
            {/* FcGoogle tự động có nhiều màu chuẩn, không cần class màu nữa */}
            <FcGoogle className="text-[22px]" />
            <span className="text-sm font-semibold text-gray-700">Google</span>
          </Button>

          <Button variant="social">
            {/* Dùng FaFacebook (logo tròn) thay vì FaFacebookF, màu xanh Blue chuẩn */}
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
