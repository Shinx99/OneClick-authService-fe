"use client";
import React from "react";
import Link from "next/link";
// Import thêm các icon cần thiết
import {
  FaUser,
  FaLock,
  FaGoogle,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaIdCard,
} from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const RegisterForm = () => {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <h2 className="text-3xl font-black text-center mb-6 uppercase tracking-wide text-black">
        REGISTER
      </h2>

      <form className="mb-6">
        {/* 1. Họ và tên */}
        <Input
          icon={<FaIdCard />}
          placeholder="Full Name (Họ và tên)"
          name="fullName"
        />

        {/* 2. Tên đăng nhập (hoặc có thể bỏ nếu hệ thống chỉ dùng Email để login) */}
        <Input
          icon={<FaUser />}
          placeholder="User-name (Tên đăng nhập)"
          name="username"
        />

        {/* 3. Email */}
        {/* <Input
          icon={<FaEnvelope />}
          placeholder="Email address"
          type="email"
          name="email"
        /> */}

        {/* 4. Số điện thoại
        <Input
          icon={<FaPhone />}
          placeholder="Phone Number"
          type="tel"
          name="phone"
        /> */}

        {/* 5. Mật khẩu */}
        <Input
          icon={<FaLock />}
          placeholder="Password"
          type="password"
          name="password"
        />

        {/* 6. Xác nhận mật khẩu */}
        <Input
          icon={<FaLock />}
          placeholder="Confirm Password"
          type="password"
          name="confirmPassword"
        />

        {/* 7. Checkbox Điều khoản & Chính sách */}
        <div className="flex items-start gap-2 mt-2 mb-6 px-1">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black cursor-pointer"
            required
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-600 cursor-pointer leading-tight"
          >
            I agree to the{" "}
            <span className="text-[#0056b3] font-semibold hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#0056b3] font-semibold hover:underline">
              Privacy Policy
            </span>
            .
          </label>
        </div>

        {/* Nút Đăng ký */}
        <Button variant="primary" className="w-[180px] mx-auto block">
          Create Account
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] bg-gray-200 flex-1"></div>
        <span className="text-sm text-gray-500 font-bold px-2">
          Or register with
        </span>
        <div className="h-[1px] bg-gray-200 flex-1"></div>
      </div>

      {/* Nút đăng nhập mạng xã hội */}
      <div className="flex gap-4 mb-6">
        <Button variant="social" className="w-1/2 !py-2.5">
          <FaGoogle className="text-[#EA4335] text-xl" />{" "}
          <span className="text-xs font-bold">Google</span>
        </Button>
        <Button variant="social" className="w-1/2 !py-2.5">
          <FaFacebookF className="text-[#1877F2] text-xl" />{" "}
          <span className="text-xs font-bold">Facebook</span>
        </Button>
      </div>

      {/* Link quay lại trang Login */}
      <div className="text-center mt-2">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link
          href="/login"
          className="text-sm text-[#0056b3] font-bold hover:underline transition-all"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
