"use client"; // Chuyển sang client để xử lý lọc tại chỗ
import React, { useState, useMemo } from "react";
import UserListTable from "@/components/features/admin/users/UserListTable";
import UserFilter from "@/components/features/admin/users/UserFilter";

export default function EmployersPage() {
  // 1. Dữ liệu gốc (Sau này fetch từ API)
  const initialEmployers = [
    {
      id: "E001",
      name: "FPT Software",
      email: "hr@fpt.com",
      status: "ACTIVE",
      company: "FPT Group",
    },
    {
      id: "E002",
      name: "VNG Corp",
      email: "recruitment@vng.com.vn",
      status: "PENDING",
      company: "VNG",
    },
    {
      id: "E003",
      name: "aaaa Corp",
      email: "recruitment@vng.com.vn",
      status: "BANNED",
      company: "VNGff",
    },
  ];

  const [filterStatus, setFilterStatus] = useState("all");

  // 2. Logic lọc dữ liệu
  const filteredData = useMemo(() => {
    if (filterStatus === "all") return initialEmployers;
    return initialEmployers.filter((user) => user.status === filterStatus);
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">
            Quản lý Nhà tuyển dụng
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Tổng cộng: {filteredData.length} doanh nghiệp
          </p>
        </div>

        {/* BỘ LỌC TRẠNG THÁI */}
        <UserFilter
          currentStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        {filteredData.length > 0 ? (
          <UserListTable data={filteredData} type="employer" />
        ) : (
          <div className="py-20 text-center text-gray-400 font-medium italic">
            Không tìm thấy kết quả phù hợp...
          </div>
        )}
      </div>
    </div>
  );
}
