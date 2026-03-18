import React from "react";
import Sidebar from "@/components/features/admin/shared/Sidebar";
import AdminHeader from "@/components/features/admin/shared/AdminHeader";

export default function AdminLayout({ children }) {
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
