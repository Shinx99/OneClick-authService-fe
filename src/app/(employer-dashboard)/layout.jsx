"use client";

import React, {useEffect} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/common/employer-dashboard/Sidebar";
import TopNav from "@/components/common/employer-dashboard/TopNav";
import FloatingChatButton from "@/components/ui/FloatingChatButton";

export default function EmployerDashboardLayout({ children }) {
  const {isRecruiter, isLoading} = useAuth();
  const router = useRouter();

  const hasAccess = isRecruiter || isLoading; // Cho phép truy cập nếu đang tải hoặc là recruiter

  useEffect(() => {
    if (!hasAccess && !isLoading) {
      toast.error("Vui lòng đăng nhập để truy cập trang này.");
      router.push("/login");
    }
  }, [hasAccess, isLoading, router]);

  // Hiển thị loading khi đang kiểm tra
  if (isLoading || !hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width) */}
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        {/* Top Navigation */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {children}
          <FloatingChatButton />
        </main>
      </div>
    </div>
  );
}
