"use client";
import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const AdminHeader = ({ title = "Quản lý hệ thống" }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Tiêu đề trang (Sẽ thay đổi tùy trang bạn đứng) */}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>

      {/* Khu vực Search và Action */}
      <div className="flex items-center gap-6">
        {/* Thanh tìm kiếm chuẩn trong ảnh */}
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00c853] transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#00c853] focus:bg-white rounded-2xl text-sm w-72 transition-all outline-none font-medium"
          />
        </div>

        {/* Nút thông báo */}
        <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:text-[#00c853] hover:bg-green-50 transition-all relative">
          <FaBell size={18} />
          {/* Chấm đỏ thông báo */}
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
