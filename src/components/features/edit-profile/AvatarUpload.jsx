"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const AvatarUpload = ({ initialAvatar, onImageSelect }) => {
  // Ưu tiên dùng avatar từ props truyền xuống, nếu không có mới dùng placeholder
  const [preview, setPreview] = useState(
    initialAvatar || "/images/avatar-placeholder.jpg",
  );

  // Dọn dẹp URL cũ khi component unmount hoặc khi tạo URL mới
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Tạo URL preview mới
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 2. Gửi file thực tế lên trang cha để xử lý upload
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const handleRemove = () => {
    setPreview("/images/avatar-placeholder.jpg");
    if (onImageSelect) onImageSelect(null);
  };

  return (
    <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-[#252525] rounded-3xl border border-gray-100 dark:border-gray-800 transition-all shadow-sm">
      {/* Khung ảnh đại diện - Bo góc rounded-full chuẩn Profile */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#00c853] shadow-md flex-shrink-0 bg-white">
        <Image
          src={preview}
          alt="Avatar Preview"
          fill
          className="object-cover"
          unoptimized={preview.startsWith("blob:")} // Next.js Image cần cái này để render blob url
        />
      </div>

      <div className="space-y-3 flex-1">
        <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">
          Ảnh đại diện của bạn
        </h3>
        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">
          Nên sử dụng ảnh rõ mặt, định dạng .jpg hoặc .png để hồ sơ chuyên
          nghiệp hơn.
        </p>

        <div className="flex items-center gap-4">
          <label className="px-5 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-[#00c853] cursor-pointer hover:border-[#00c853] hover:shadow-lg hover:shadow-green-500/10 transition-all active:scale-95">
            Thay đổi ảnh
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
          <button
            onClick={handleRemove}
            type="button"
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Xóa ảnh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
