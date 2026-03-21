"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaMapMarkerAlt, FaSyncAlt } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const EmployerRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      genderIdentity: "Nam",
      phoneNumber: "",
      companyName: "",
      officeLocation: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Submit employer registration data:", data);
      toast.success("Đăng ký thành công! Vui lòng xác minh Email.");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/employer-register/verify");
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header / Logo */}

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Đăng ký Nhà tuyển dụng</h1>
        <p className="text-gray-500 text-sm">Điền thông tin chi tiết để thiết lập hồ sơ công ty của bạn.</p>
      </div>

      {/* Alert Box - Quy định */}
      <div className="bg-green-50/50 border border-green-200 rounded-xl p-5 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-green-700">Quy định</h3>
          <span className="text-gray-400 font-bold">-</span>
        </div>
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            Để đảm bảo chất lượng dịch vụ, One-Click <span className="text-red-500 font-semibold">không cho phép một người dùng tạo nhiều tài khoản khác nhau.</span>
          </p>
          <p>
            Nếu phát hiện vi phạm, One-Click sẽ ngừng cung cấp dịch vụ tới tất cả các tài khoản trùng lặp hoặc chặn toàn bộ truy cập tới hệ thống.
          </p>
          <p>
            Sau khi đăng ký tài khoản nhà tuyển dụng (NTD), NTD có thể được hỗ trợ hiển thị tin tuyển dụng cơ bản theo quy định của One-Click tại từng thời điểm.
          </p>
        </div>
        <div className="mt-4 flex gap-6 text-sm font-semibold text-green-600">
          <div className="flex items-center gap-1">📞 (024) 71079799</div>
          <div className="flex items-center gap-1">📞 0862 691929</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Họ và tên</span>
            <Input icon={<FaUser />} placeholder="Nguyễn Văn A" {...register("fullName")} />
            {errors.fullName && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.fullName.message}</p>}
          </div>

          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Địa chỉ Email</span>
            <Input icon={<FaEnvelope />} placeholder="nguyenvana@congty.com" {...register("email")} />
            {errors.email && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.email.message}</p>}
          </div>
        </div>

        {/* Row 2: Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Mật khẩu</span>
            <Input type="password" icon={<FaLock />} placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.password.message}</p>}
          </div>

          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Xác nhận Mật khẩu</span>
            <Input type="password" icon={<FaSyncAlt />} placeholder="••••••••" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Row 3: Gender & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <div className="relative mb-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-gray-500 mb-3 block uppercase tracking-wider">Giới tính</span>
            <div className="flex gap-4 px-1 pb-[10px] mt-2 h-full">
              {["Nam", "Nữ", "Khác"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={option}
                    {...register("genderIdentity")}
                    className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600 font-medium">{option}</span>
                </label>
              ))}
            </div>
            {errors.genderIdentity && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.genderIdentity.message}</p>}
          </div>

          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Số điện thoại</span>
            <Input icon={<FaPhone />} placeholder="+84 900 000 000" {...register("phoneNumber")} />
            {errors.phoneNumber && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        {/* Row 4: Company & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-6">
          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Tên công ty</span>
            <Input icon={<FaBuilding />} placeholder="Tập đoàn ABC" {...register("companyName")} />
            {errors.companyName && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.companyName.message}</p>}
          </div>

          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Địa chỉ văn phòng</span>
            <Input icon={<FaMapMarkerAlt />} placeholder="TP. Hồ Chí Minh" {...register("officeLocation")} />
            {errors.officeLocation && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.officeLocation.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full bg-[#00D06A] hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,208,106,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
          <span className="text-lg">→</span>
        </Button>
        
        {/* Footer text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Bằng cách nhấn hoàn tất, bạn đồng ý với <Link href="#" className="font-semibold text-[#00D06A] hover:underline">Điều khoản Dịch vụ</Link> và <Link href="#" className="font-semibold text-[#00D06A] hover:underline">Chính sách Bảo mật</Link> của chúng tôi.
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmployerRegisterForm;
