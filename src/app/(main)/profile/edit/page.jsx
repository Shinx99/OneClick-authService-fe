"use client";
import React, { useState } from "react";
import EditSidebar from "@/components/features/edit-profile/EditSidebar";
import PersonalInfoForm from "@/components/features/edit-profile/PersonalInfoForm";
import SectionHeader from "@/components/features/edit-profile/SectionHeader";
import { FaPlus } from "react-icons/fa";

const EditProfilePage = () => {
  // 1. STATE TỔNG - Đồng bộ cấu trúc với trang ProfilePage hiển thị
  const [profileData, setProfileData] = useState({
    personal: {
      fullName: "Lê Nguyễn Hoàng Trung",
      position: "Software Development",
      email: "trunglnh@fpt.edu.vn", // Thêm thông tin liên hệ
      location: "Hà Nội, Việt Nam",
    },
    experiences: [
      {
        id: 1,
        role: "Senior Developer",
        company: "WebCreatives",
        type: "Toàn thời gian",
      },
    ],
    education: [
      {
        id: 1,
        school: "FPT Polytechnic",
        major: "Software Development",
        time: "2023 - 2025",
      },
    ],
    skills: ["Figma", "Next.js", "Spring Boot", "Tailwind CSS"],
  });

  const [newSkill, setNewSkill] = useState("");

  // 2. LOGIC HANDLERS
  const removeSkill = (skillName) => {
    setProfileData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skillName),
    }));
  };

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), trimmedSkill],
      }));
      setNewSkill("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pt-10 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CỘT TRÁI: Sidebar & Tiến độ */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-[#1e1e1e] p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <EditSidebar />
            </div>
          </aside>

          {/* CỘT PHẢI: Form chi tiết */}
          <main className="lg:col-span-3 space-y-8">
            <div id="personal" className="scroll-mt-24">
              <PersonalInfoForm initialData={profileData.personal} />
            </div>

            {/* Phần Kinh nghiệm */}
            <section
              id="exp"
              className="scroll-mt-24 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <SectionHeader title="Kinh nghiệm làm việc" onAdd={() => {}} />
              <div className="space-y-4">
                {profileData.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 bg-gray-50 dark:bg-[#252525] rounded-2xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-[#1e1e1e] rounded-xl flex items-center justify-center text-[#00c853] shadow-sm">
                        <FaPlus />
                      </div>
                      <div>
                        <h4 className="font-bold dark:text-white">
                          {exp.role}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {exp.company} • {exp.type}
                        </p>
                      </div>
                    </div>
                    <button className="text-[#00c853] text-sm font-bold opacity-0 group-hover:opacity-100 transition-all hover:underline">
                      Chỉnh sửa
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Phần Học vấn */}
            <section
              id="edu"
              className="scroll-mt-24 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <SectionHeader title="Học vấn" onAdd={() => {}} />
              {profileData.education.length > 0 ? (
                profileData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 bg-gray-50 dark:bg-[#252525] rounded-2xl flex items-center gap-4 mb-3"
                  >
                    <div className="w-10 h-10 bg-[#00c853]/10 text-[#00c853] rounded-lg flex items-center justify-center font-bold">
                      F
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white text-sm">
                        {edu.school}
                      </h4>
                      <p className="text-xs text-gray-400">{edu.major}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 bg-gray-50 dark:bg-[#252525] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm text-gray-400 italic uppercase tracking-tighter">
                    Chưa có thông tin học vấn
                  </p>
                </div>
              )}
            </section>

            {/* Phần Kỹ năng */}
            <section
              id="skill"
              className="scroll-mt-24 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <SectionHeader title="Kỹ năng" onAdd={addSkill} />
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {profileData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-blue-50 dark:bg-[#252a3d] text-blue-600 dark:text-blue-400 rounded-xl text-sm font-black border border-blue-100 dark:border-blue-900/30 flex items-center gap-2 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 shadow-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Thêm kỹ năng mới (Enter để lưu)"
                    className="w-full p-4 pr-12 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] focus:ring-2 focus:ring-[#00c853] outline-none text-sm transition-all"
                  />
                  <button
                    onClick={addSkill}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00c853] hover:scale-125 transition-transform"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
