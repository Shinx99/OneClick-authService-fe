import React from "react";
import StatsGrid from "@/components/features/admin/dashboard/StatsGrid";
import GrowthChart from "@/components/features/admin/dashboard/GrowthChart";
import RecentActivities from "@/components/features/admin/dashboard/RecentActivities";

export default async function AdminDashboard() {
  // SAU NÀY KẾT NỐI API TẠI ĐÂY:
  const mockData = {
    stats: [
      {
        id: 1,
        label: "Tổng Ứng viên",
        value: "12,540",
        trend: "+12%",
        color: "green",
      },
      {
        id: 2,
        label: "Tổng Công ty",
        value: "850",
        trend: "+4%",
        color: "blue",
      },
      {
        id: 3,
        label: "Doanh thu",
        value: "45,000,000đ",
        trend: "+22%",
        color: "orange",
      },
      {
        id: 4,
        label: "Tin tuyển dụng mới",
        value: "120",
        trend: "+18",
        color: "purple",
      },
    ],
    activities: [
      {
        id: 1,
        type: "user",
        title: "Người dùng mới đăng ký",
        desc: "Nguyễn Văn An vừa tạo tài khoản",
        time: "2 phút trước",
      },
      {
        id: 2,
        type: "job",
        title: "Tin tuyển dụng được duyệt",
        desc: "Vingroup: Tuyển chuyên viên AI",
        time: "15 phút trước",
      },
      {
        id: 3,
        type: "payment",
        title: "Giao dịch thành công",
        desc: "Gói 'Premium Plus' đã thanh toán",
        time: "1 giờ trước",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Bảng điều khiển tổng quan
        </h1>
        <p className="text-sm text-gray-400 font-medium">
          Chào mừng trở lại, quản trị viên!
        </p>
      </div>

      {/* 4 Cards thống kê */}
      <StatsGrid stats={mockData.stats} />

      <div className="grid grid-cols-12 gap-8">
        {/* Biểu đồ bên trái (8 cột) */}
        <div className="col-span-8">
          <GrowthChart />
        </div>

        {/* Hoạt động bên phải (4 cột) */}
        <div className="col-span-4">
          <RecentActivities activities={mockData.activities} />
        </div>
      </div>
    </div>
  );
}
