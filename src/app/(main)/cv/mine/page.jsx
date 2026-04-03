// src/app/(main)/cv/mine/page.jsx
import React from "react";
import CVManagementContent from "@/components/features/cv/CVManagementContent";

export const metadata = {
  title: "Quản lý CV | OneClick",
  description: "Tải lên, cập nhật và thiết lập hồ sơ mặc định của bạn.",
};

export default function MyCVPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#121212] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header trang (Tùy chọn: có thể để ở page.jsx hoặc nhét luôn vào Component) */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Quản lý CV của tôi
          </h1>
          <p className="text-slate-500 mt-2">
            Tải lên, cập nhật và thiết lập CV mặc định để tăng cơ hội trúng
            tuyển.
          </p>
        </div>

        {/* Gọi Component xử lý chính từ thư mục features */}
        <CVManagementContent />
      </div>
    </div>
  );
}
