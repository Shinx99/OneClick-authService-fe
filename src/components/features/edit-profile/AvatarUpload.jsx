"use client";
import React, { useState } from "react";
import Image from "next/image";

const AvatarUpload = () => {
  const [preview, setPreview] = useState("/images/avatar-placeholder.jpg");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-[#252525] rounded-2xl border border-gray-100 dark:border-gray-800 transition-all">
      {/* Khung ảnh đại diện */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#00c853] shadow-sm flex-shrink-0">
        <Image src={preview} alt="Avatar" fill className="object-cover" />
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white">
          Ảnh đại diện
        </h3>
        <p className="text-xs text-gray-400">WebCreatives • Toàn thời gian</p>

        <div className="flex gap-4">
          <label className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-[#00c853] cursor-pointer hover:bg-gray-50 transition-all">
            Thay đổi ảnh
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
          <button className="text-xs font-bold text-red-500 hover:underline transition-all cursor-pointer">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
