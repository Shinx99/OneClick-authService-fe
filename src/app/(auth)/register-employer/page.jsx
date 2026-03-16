import React from "react";
import Link from "next/link";
import EmployerRegisterForm from "@/components/features/auth/EmployerRegisterForm";

export default function EmployerRegisterPage() {
  return (
    // Nền xám nhạt (bg-slate-50) để làm nổi bật form màu trắng
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Nút Về trang chủ ở góc */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
      >
        <span>&larr;</span> Về trang chủ
      </Link>

      {/* Logo ở trên đỉnh Form */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link
          href="/"
          className="inline-block hover:scale-105 transition-transform"
        >
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            One<span className="text-[#00c853]">Click</span>{" "}
            <span className="text-blue-600">Employer</span>
          </span>
        </Link>
      </div>

      {/* Chèn Form Đăng ký NTD vào đây */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <EmployerRegisterForm />
      </div>
    </div>
  );
}
