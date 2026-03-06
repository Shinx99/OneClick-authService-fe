"use client";
import React, { useState } from "react";
import AvatarUpload from "./AvatarUpload";

const PersonalInfoForm = () => {
  // Mock State: Sau này sẽ lấy từ API qua useEffect
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    position: "Software Engineer",
    email: "nguyen.vana@example.com",
    phone: "+84 90 123 4567",
    bio: "Passionate software engineer with 5+ years of experience...",
    location: "Ho Chi Minh City, Vietnam",
  });

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm transition-all">
      {/* Header của Form */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Thông tin cá nhân
          </h2>
          <p className="text-sm text-gray-500">
            Quản lý thông tin cá nhân và chi tiết hồ sơ công khai.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-full transition-all cursor-pointer">
            Hủy bỏ
          </button>
          {/* bg-[#00c853]: Màu chủ đạo One-Click */}
          <button className="px-6 py-2 bg-[#00c853] text-white font-bold rounded-xl hover:bg-[#00a846] transition-all shadow-md active:scale-95 cursor-pointer">
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Phần Upload Avatar */}
      <AvatarUpload />

      {/* Grid 2 cột: grid-cols-1 (mobile) md:grid-cols-2 (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Họ và tên */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Họ và tên
          </label>
          <input
            type="text"
            defaultValue={formData.fullName}
            className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none"
          />
        </div>

        {/* Chức danh */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Chức danh
          </label>
          <input
            type="text"
            defaultValue={formData.position}
            className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Địa chỉ Email
          </label>
          <input
            type="email"
            defaultValue={formData.email}
            className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none"
          />
        </div>

        {/* Số điện thoại */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Số điện thoại
          </label>
          <input
            type="text"
            defaultValue={formData.phone}
            className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none"
          />
        </div>

        {/* Giới thiệu bản thân - Chiếm trọn 2 cột (md:col-span-2) */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Giới thiệu bản thân
          </label>
          <textarea
            rows="4"
            defaultValue={formData.bio}
            className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
