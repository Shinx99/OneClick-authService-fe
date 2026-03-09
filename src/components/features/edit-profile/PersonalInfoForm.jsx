"use client";
import React, { useState } from "react";
import AvatarUpload from "./AvatarUpload";

const PersonalInfoForm = ({ initialData, onSave }) => {
  // 1. Khởi tạo State trực tiếp từ Props.
  // Xóa bỏ hoàn toàn useEffect để không bị lỗi "cascading renders".
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    position: initialData?.position || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    bio: initialData?.bio || "",
    location: initialData?.location || "Ho Chi Minh City, Vietnam",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    alert("Lưu thành công!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 transition-all"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Thông tin cá nhân
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Quản lý hồ sơ công khai của bạn.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#00c853] text-white font-black rounded-xl hover:bg-[#00a846] transition-all shadow-lg active:scale-95"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      <AvatarUpload initialAvatar={initialData?.avatar} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
            Chức danh
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
            Địa chỉ Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none font-medium"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
            Giới thiệu bản thân
          </label>
          <textarea
            name="bio"
            rows="5"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none resize-none font-medium"
          />
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
