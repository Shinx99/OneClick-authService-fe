"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { SetupPopupProvider } from "@/context/SetupPopupContext";
import Sidebar from "@/components/common/employer-dashboard/Sidebar";
import TopNav from "@/components/common/employer-dashboard/TopNav";
import FloatingChatButton from "@/components/ui/FloatingChatButton";

function EmployerDashboardContent({ children }) {
  const { isRecruiter, isLoading } = useAuth();
  const router = useRouter();

  const hasAccess = isRecruiter || isLoading;

  useEffect(() => {
    if (!hasAccess && !isLoading) {
      toast.error("Vui lòng đăng nhập để truy cập trang này.");
      router.push("/login");
    }
  }, [hasAccess, isLoading, router]);

  if (isLoading || !hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return (
    // 1. Gỡ bỏ class "flex" ở div ngoài cùng
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar (Đang set fixed left-0 w-64) */}
      <Sidebar />

      {/* 2. Dùng pl-64 (Padding-left 256px) để chứa vừa vặn không bị đẩy ra ngoài màn hình */}
      <div className="flex flex-col min-h-screen pl-64 w-full">
        {/* Top Navigation */}
        <TopNav />

        {/* 3. Thêm "flex flex-col min-h-0" để truyền chiều cao xuống cho bảng Kanban, giúp nó tự cuộn bên trong */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 flex flex-col min-h-0">
          {children}
          <FloatingChatButton />
        </main>
      </div>
    </div>
  );
}

export default function EmployerDashboardLayout({ children }) {
  return (
    <SetupPopupProvider>
      <EmployerDashboardContent>{children}</EmployerDashboardContent>
    </SetupPopupProvider>
  );
}
