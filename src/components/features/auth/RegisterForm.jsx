"use client";
import React from "react";
import { FaUser, FaLock, FaFacebook, FaIdCard } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const RegisterForm = () => {
  return (
    <div className="w-full max-w-[380px] mx-auto">
      {/* 1. Kéo Tiêu đề gần lại form: Giảm từ mb-10 -> mb-6 */}
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        Đăng ký tài khoản
      </h2>

      <form>
        {/* Các Input tự động có sẵn margin chuẩn từ component */}
        <Input icon={<FaIdCard />} placeholder="Full Name" name="fullName" />
        <Input icon={<FaUser />} placeholder="Username" name="username" />
        <Input
          icon={<FaLock />}
          placeholder="Mật khẩu"
          type="password"
          name="password"
        />
        <Input
          icon={<FaLock />}
          placeholder="Xác nhận mật khẩu"
          type="password"
          name="confirmPassword"
        />

        {/* 2. Ép Checkbox sát vào Input trên và Nút dưới: Giảm từ mt-2/mb-6 -> mt-0/mb-5 */}
        <div className="flex items-start gap-2 mt-0 mb-5 px-1">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer transition-all"
            required
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-600 cursor-pointer leading-tight mt-[1px]"
          >
            Tôi đã đọc và đồng ý với{" "}
            <span className="text-[#0056b3] font-semibold hover:underline">
              Điều khoản dịch vụ
            </span>{" "}
            và{" "}
            <span className="text-[#0056b3] font-semibold hover:underline">
              Chính sách bảo mật
            </span>
            .
          </label>
        </div>

        {/* 3. Nút đăng ký: Bỏ margin thừa, giữ khối gọn gàng */}
        <Button
          variant="primary"
          className="w-[180px] mx-auto bg-green-600 hover:bg-green-700 hover:shadow-green-600/30"
        >
          Đăng ký tài khoản
        </Button>

        {/* 4. Thanh chia cắt (Divider): Dùng my-5 (cách đều trên dưới 20px) thay vì lộn xộn mt-4/mb-6 */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            Hoặc đăng ký với
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        {/* 5. Ép nhẹ 2 nút Social gần nhau hơn một xíu: Dùng space-y-2.5 (10px) thay vì 3 (12px) */}
        <div className="space-y-2.5">
          <Button variant="social">
            <FcGoogle className="text-[22px]" />
            <span className="text-sm font-semibold text-gray-700">Google</span>
          </Button>

          <Button variant="social">
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
