"use client";
import React from "react";
import EditSidebar from "@/components/features/edit-profile/EditSidebar";
import PersonalInfoForm from "@/components/features/edit-profile/PersonalInfoForm";
import SectionHeader from "@/components/features/edit-profile/SectionHeader";
import { FaPlus, FaRegLightbulb } from "react-icons/fa";

const EditProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pt-10 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CỘT TRÁI: Sidebar điều hướng */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-[#1e1e1e] p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <EditSidebar />
            </div>

            <div className="bg-[#e6f9ee] dark:bg-[#1a2e24] p-6 rounded-3xl border border-[#00c853]/20">
              <h4 className="text-sm font-bold text-[#00c853] mb-2">
                Độ hoàn thiện hồ sơ
              </h4>
              <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-[#00c853]"></div>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                Hoàn thiện thêm Kinh nghiệm để tăng khả năng trúng tuyển.
              </p>
            </div>
          </aside>

          {/* CỘT PHẢI: Nội dung chỉnh sửa chính */}
          <main className="lg:col-span-3 space-y-8">
            {/* 1. Form thông tin cá nhân */}
            <div id="personal" className="scroll-mt-24">
              <PersonalInfoForm />
            </div>

            {/* 2. Phần Kinh nghiệm làm việc */}
            <div
              id="exp"
              className="scroll-mt-24 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all"
            >
              <SectionHeader title="Kinh nghiệm làm việc" onAdd={() => {}} />
              <div className="space-y-4">
                <div className="p-5 bg-gray-50 dark:bg-[#252525] rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-[#1e1e1e] rounded-xl flex items-center justify-center text-[#00c853] shadow-sm">
                      <FaPlus />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">
                        Senior Developer
                      </h4>
                      <p className="text-xs text-gray-400">
                        WebCreatives • Toàn thời gian
                      </p>
                    </div>
                  </div>
                  <button className="text-[#00c853] text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Phần Học vấn */}
            <div
              id="edu"
              className="scroll-mt-24 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all"
            >
              <SectionHeader title="Học vấn" onAdd={() => {}} />
              <div className="p-5 bg-gray-50 dark:bg-[#252525] rounded-2xl">
                <p className="text-sm text-gray-400 italic text-center">
                  Chưa có thông tin học vấn. Nhấn Add New để thêm.
                </p>
              </div>
            </div>

            {/* 4. Phần Kỹ năng (MỚI THÊM) */}
            <div
              id="skill"
              className="scroll-mt-24 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all"
            >
              <SectionHeader title="Kỹ năng" onAdd={() => {}} />
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {/* Mock Skills - Sau này map từ API */}
                  {["Figma", "Next.js", "Spring Boot", "Tailwind CSS"].map(
                    (skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-blue-50 dark:bg-[#252a3d] text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold border border-blue-100 dark:border-blue-900/30 flex items-center gap-2"
                      >
                        {skill}
                        <button className="text-blue-300 hover:text-red-500 transition-colors">
                          ×
                        </button>
                      </div>
                    ),
                  )}
                </div>

                {/* Input giả để thêm kỹ năng */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Thêm kỹ năng mới (ví dụ: React, Java...)"
                    className="w-full p-4 pr-12 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none text-sm transition-all"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00c853] hover:scale-110 transition-transform">
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
