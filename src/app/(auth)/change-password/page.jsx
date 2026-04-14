import React from "react";
import ChangePasswordForm from "@/components/features/auth/ChangePasswordForm";

export const metadata = {
  title: "Đổi mật khẩu | OneClick",
  description: "Bảo mật tài khoản nhà tuyển dụng của bạn",
};

const ChangePasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden p-4 sm:p-8">
      {/* --- FORM ĐỔI MẬT KHẨU --- */}
      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-700">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
