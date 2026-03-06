"use client";
import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaPen } from "react-icons/fa";
import Link from "next/link";

const ProfileHeader = () => {
  const user = {
    fullName: "Nguyễn Văn A",
    position: "Senior UX Designer",
    location: "Hà Nội, Việt Nam",
    avatar: "/images/avatar-placeholder.jpg",
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Khung Avatar & Thông tin chính */}
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-gray-50 dark:border-gray-700 shadow-md flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.fullName}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thông tin văn bản (Text Content) */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {user.fullName}
            </h1>

            <p className="text-[#00c853] font-bold text-xl">{user.position}</p>

            <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm gap-2 font-medium">
              <FaMapMarkerAlt className="text-gray-400" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/profile/edit">
            <button className="flex items-center gap-2 bg-[#00c853] hover:bg-[#00a846] text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-green-100 dark:shadow-none active:scale-95 cursor-pointer">
              <FaPen size={14} />
              Chỉnh sửa hồ sơ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
