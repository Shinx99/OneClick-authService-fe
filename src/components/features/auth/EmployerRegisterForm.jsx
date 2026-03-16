"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
// Nếu có Zod Schema cho NTD thì bạn import vào đây, tạm thời mình dùng basic
import { FiBriefcase, FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const EmployerRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Setup React Hook Form (Tương tự RegisterForm của ứng viên)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("🚀 Payload Đăng ký NTD:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Đăng ký tài khoản Doanh nghiệp thành công!");
    } catch (error) {
      toast.error("Đăng ký thất bại, vui lòng kiểm tra lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Đồng bộ chiều rộng (max-w-[380px]) giống hệt form ứng viên để khi trượt vào AuthLayout không bị lệch
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        Đăng ký Doanh nghiệp
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Nhập Tên Công Ty */}
        <div className="mb-4 relative">
          <Input
            icon={<FiBriefcase />}
            placeholder="Tên công ty (VD: TechNova)"
            {...register("companyName", {
              required: "Vui lòng nhập tên công ty",
            })}
          />
          {errors.companyName && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* Nhập Người liên hệ & SĐT (Nằm trên 1 hàng) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <Input
              icon={<FiUser />}
              placeholder="Người liên hệ"
              {...register("contactName", { required: "Bắt buộc" })}
            />
          </div>
          <div className="relative">
            <Input
              icon={<FiPhone />}
              placeholder="Số điện thoại"
              type="tel"
              {...register("phone", { required: "Bắt buộc" })}
            />
          </div>
        </div>

        {/* Nhập Email làm việc */}
        <div className="mb-4 relative">
          <Input
            icon={<FiMail />}
            placeholder="Email công việc (hr@congty.com)"
            type="email"
            {...register("email", { required: "Vui lòng nhập email" })}
          />
        </div>

        {/* Nhập Mật khẩu */}
        <div className="mb-4 relative">
          <Input
            icon={<FiLock />}
            placeholder="Mật khẩu"
            type="password"
            {...register("password", { required: "Vui lòng nhập mật khẩu" })}
          />
        </div>

        {/* Checkbox điều khoản (Đổi sang màu Blue) */}
        <div className="mb-6 mt-2 px-1 relative">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="employer-terms"
              {...register("terms", { required: "Vui lòng đồng ý điều khoản" })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all mt-[2px]"
            />
            <label
              htmlFor="employer-terms"
              className="text-xs text-gray-600 cursor-pointer leading-tight"
            >
              Tôi xác nhận là đại diện hợp pháp và đồng ý với{" "}
              <span className="text-blue-600 font-semibold hover:underline">
                Điều khoản dịch vụ
              </span>{" "}
              của OneClick.
            </label>
          </div>
        </div>

        {/* Button Submit (Màu Xanh Dương) */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-[200px] mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang xử lý..." : "Tạo tài khoản NTD"}
        </Button>
      </form>
    </div>
  );
};

export default EmployerRegisterForm;
