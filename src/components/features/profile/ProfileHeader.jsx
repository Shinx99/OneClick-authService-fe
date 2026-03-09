"use client";
import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaPen } from "react-icons/fa";
import Link from "next/link";

const ProfileHeader = ({ user = {} }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-gray-50 dark:border-gray-700 shadow-md">
            <Image
              src={user.avatar || "/images/avatar-placeholder.jpg"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {user.fullName}
            </h1>
            <p className="text-[#00c853] font-bold text-xl">{user.position}</p>
            <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm gap-2">
              <FaMapMarkerAlt /> <span>{user.location}</span>
            </div>
          </div>
        </div>
        <Link href="/profile/edit">
          <button className="bg-[#00c853] text-white px-8 py-3 rounded-full font-bold active:scale-95">
            Chỉnh sửa hồ sơ
          </button>
        </Link>
      </div>
    </div>
  );
};
export default ProfileHeader;
