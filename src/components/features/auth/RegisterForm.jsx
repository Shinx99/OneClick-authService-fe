"use client";
import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validators/auth";
import { FaUser, FaLock, FaIdCard, FaPhone, FaUserTie } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

// --- 1. COMPONENT TOGGLE SWITCH 3D HIỆN ĐẠI ---
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="relative shrink-0 cursor-pointer select-none active:scale-90 transition-all duration-500"
      style={{
        width: "52px",
        height: "28px",
        background: checked ? "#00c853" : "#e2e8f0",
        borderRadius: "30px",
        boxShadow: checked
          ? "0 4px 12px rgba(0, 200, 83, 0.2), inset 0 2px 4px rgba(0,0,0,0.1)"
          : "inset 0 2px 4px rgba(0,0,0,0.05)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "27px" : "3px",
          width: "22px",
          height: "22px",
          background: "#ffffff",
          borderRadius: "50%",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className={`w-1 h-1 rounded-full ${checked ? "bg-[#00c853]" : "bg-gray-300"}`}
        />
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const { register: executeRegister, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
      isEmployer: false,
    },
  });

  // FIX LỖI ESLINT: Sử dụng useWatch thay cho watch() để tối ưu bộ nhớ và tránh lỗi Compiler
  const watchIsEmployer = useWatch({
    control,
    name: "isEmployer",
    defaultValue: false,
  });

  const onSubmit = async (data) => {
    const payload = {
      phone: data.phone,
      email: data.username,
      password: data.password,
      roles: [data.isEmployer ? "recruiter" : "candidate"],
    };
    await executeRegister(payload);
  };

  return (
    <div className="w-full max-w-[380px] mx-auto p-4">
      {/* TIÊU ĐỀ: Thống nhất font-bold và tracking-tight mềm mại như Login */}
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-gray-100 tracking-tight leading-none">
        Đăng ký tài khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- CÁC INPUT --- */}
        <div className="space-y-5 mb-6">

          <div className="relative">
            <Input
              icon={<FaUser className="text-slate-400" />}
              placeholder="Email"
              {...register("username")}
            />
            {errors.username && (
              <p className="absolute top-full left-2 text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              icon={<FaPhone className="text-slate-400" />}
              type="tel"
              placeholder="Số điện thoại"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="absolute top-full left-2 text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              icon={<FaLock className="text-slate-400" />}
              placeholder="Mật khẩu"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="absolute top-full left-2 text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              icon={<FaLock className="text-slate-400" />}
              placeholder="Xác nhận mật khẩu"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="absolute top-full left-2 text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* --- KHỐI TOGGLE NHÀ TUYỂN DỤNG CHUẨN SaaS --- */}
        <div
          className={`mb-6 p-4 rounded-[1.5rem] border transition-all duration-500 flex items-center justify-between
            ${watchIsEmployer
              ? "bg-green-50 border-green-100 shadow-[0_10px_25px_-12px_rgba(0,200,83,0.3)]"
              : "bg-gray-50 dark:bg-[#1e293b] border-gray-100 dark:border-gray-600 shadow-none"
            }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 shadow-sm
              ${watchIsEmployer ? "bg-[#00c853] text-white rotate-[360deg]" : "bg-white dark:bg-[#334155] text-gray-400"}`}
            >
              <FaUserTie size={16} />
            </div>
            <div>
              <label
                className={`text-sm font-bold transition-colors ${watchIsEmployer ? "text-green-700 dark:text-green-400" : "text-slate-700 dark:text-gray-200"}`}
              >
                Tôi là nhà tuyển dụng
              </label>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 leading-none">
                {watchIsEmployer
                  ? "Chế độ doanh nghiệp"
                  : "Đăng ký làm ứng viên"}
              </p>
            </div>
          </div>

          <Controller
            name="isEmployer"
            control={control}
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* --- ĐIỀU KHOẢN --- */}
        <div className="mb-8 px-1 relative">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              {...register("terms")}
              className="w-4 h-4 text-[#00c853] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#00c853] cursor-pointer mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight select-none"
            >
              Tôi đồng ý với{" "}
              <span className="text-[#00c853] font-bold hover:underline cursor-pointer">
                Điều khoản
              </span>{" "}
              &{" "}
              <span className="text-[#00c853] font-bold hover:underline cursor-pointer">
                Bảo mật
              </span>
            </label>
          </div>
          {errors.terms && (
            <p className="absolute top-full left-1 text-red-500 text-[9px] font-bold uppercase mt-1">
              {errors.terms.message}
            </p>
          )}
        </div>

        {/* --- NÚT ĐĂNG KÝ --- */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-[180px] h-[48px] bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 uppercase tracking-widest font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
