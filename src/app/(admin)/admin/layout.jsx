"use client";

import React, {useEffect} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/features/admin/shared/Sidebar";
import AdminHeader from "@/components/features/admin/shared/AdminHeader";

export default function AdminLayout({ children }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin && !isLoading) {
      toast.error("Vui lòng đăng nhập để truy cập trang này.");
      router.push("/login");
    }
  }, [isAdmin, isLoading, router]);

  // Hiển thị loading khi đang kiểm tra hoặc không có quyền
  if (isLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f6]">
        <div className="text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      {/* Sidebar bên trái - rộng 256px (w-64) */}
      <div className="w-64 fixed inset-y-0 left-0 z-50 bg-white">
        <Sidebar />
      </div>

      {/* Khu vực nội dung bên phải */}
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
