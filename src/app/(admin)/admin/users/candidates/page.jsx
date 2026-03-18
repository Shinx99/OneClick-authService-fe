import React from "react";
import UserListTable from "@/components/features/admin/users/UserListTable";

export default async function CandidatesPage() {
  // Giả lập dữ liệu từ Spring Boot
  const candidates = [
    {
      id: "C001",
      name: "Nguyễn Văn A",
      email: "a.nguyen@gmail.com",
      status: "Active",
      joinDate: "12/03/2026",
    },
    {
      id: "C002",
      name: "Trần Thị B",
      email: "b.tran@gmail.com",
      status: "Banned",
      joinDate: "10/03/2026",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Ứng viên</h1>
        <div className="text-sm text-gray-400 font-medium">
          Tổng cộng: {candidates.length} người dùng
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <UserListTable data={candidates} type="candidate" />
      </div>
    </div>
  );
}
