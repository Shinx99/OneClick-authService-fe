"use client";
import React from "react";
import { useRouter } from "next/navigation";

const TITLES = {
  select: "Khởi tạo không gian",
  create: "Tạo công ty mới",
  join: "Gia nhập tổ chức",
  pending: "Chờ phê duyệt",
};

const DESCRIPTIONS = {
  select:
    "Chọn tạo mới nếu công ty bạn chưa có trên hệ thống, hoặc xin gia nhập nếu đồng nghiệp của bạn đã tạo trước đó.",
  create:
    "Điền đầy đủ thông tin pháp lý và hình ảnh nhận diện để hoàn tất hồ sơ công ty của bạn trên hệ thống.",
  join: "Yêu cầu của bạn sẽ được gửi tới Admin Hệ thống hoặc HR Tổng của công ty để phê duyệt tùy theo vai trò bạn chọn.",
  pending:
    "Hồ sơ đã gửi thành công. Admin OneClick sẽ xem xét và phản hồi trong vòng 24 giờ làm việc.",
};

export default function SetupSidebar({ flowMode, onBack }) {
  const router = useRouter();
  const handleBack = () => {
    // Sau khi đã tạo company xong (pending) → đi thẳng dashboard
    if (flowMode === "pending") {
      router.push("/employer/dashboard");
      return;
    }
    if (flowMode !== "select") onBack?.();
    else router.push("/employer/dashboard");
  };

  return (
    <div className="hidden md:flex w-full md:w-[30%] bg-background p-8 border-r-2 border-card-border flex-col">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg border-2 border-indigo-200 dark:border-indigo-500/30">
          OC
        </div>
        <span className="font-medium text-text-main text-lg tracking-tight">
          OneClick
        </span>
      </div>

      <div>
        <h3 className="font-medium text-text-main text-[16px] mb-2">
          {TITLES[flowMode]}
        </h3>
        <p className="text-[13px] text-text-muted font-normal leading-relaxed">
          {DESCRIPTIONS[flowMode]}
        </p>
      </div>

      <div className="mt-auto pt-8">
        <button
          onClick={handleBack}
          className="text-[12px] text-text-muted hover:text-text-main uppercase tracking-widest font-medium transition-colors"
        >
          ←{" "}
          {flowMode === "pending"
            ? "Về Dashboard"
            : flowMode !== "select"
              ? "Quay lại lựa chọn"
              : "Về Dashboard"}
        </button>
      </div>
    </div>
  );
}
