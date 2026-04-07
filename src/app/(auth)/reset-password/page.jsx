// src/app/(auth)/reset-password/page.jsx
"use client";
import React, { Suspense } from "react";
import ResetPasswordForm from "@/components/features/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Bắt buộc dùng Suspense vì ResetPasswordForm sử dụng useSearchParams() 
          để lấy token từ URL. Next.js yêu cầu điều này để render phía Client.
      */}
      <Suspense fallback={<div className="text-center font-bold">Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;