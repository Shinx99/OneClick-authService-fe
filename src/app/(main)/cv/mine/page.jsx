"use client";

// src/app/(main)/cv/mine/page.jsx
import React, { useState } from "react";
import CVManagementContent from "@/components/features/cv/CVManagementContent";
import CVManagement from "@/components/features/cv/CVManagement";

// export const metadata = {
//   title: "Quản lý CV | OneClick",
//   description: "Tải lên, cập nhật và thiết lập hồ sơ mặc định của bạn.",
// };

export default function MyCVPage() {

  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-background py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header trang (Tùy chọn: có thể để ở page.jsx hoặc nhét luôn vào Component) */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-text-main tracking-tight">
            Quản lý CV của tôi
          </h1>
          <p className="text-text-muted mt-2">
            Tải lên, cập nhật và thiết lập CV mặc định để tăng cơ hội trúng
            tuyển.
          </p>
        </div>

        {/* Gọi Component xử lý chính từ thư mục features */}
        <CVManagementContent onRefresh={() => setRefreshKey(k => k + 1)} />

        <div className="mt-5">
          < CVManagement key={refreshKey} />
        </div>

      </div>
    </div>
  );
}
