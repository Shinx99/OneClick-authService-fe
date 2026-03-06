"use client";
import React from "react";
// Import các component từ thư mục features để đảm bảo cấu trúc sạch sẽ
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import ExperienceList from "@/components/features/profile/ExperienceList";
import SkillList from "@/components/features/profile/SkillList";
import EducationList from "@/components/features/profile/EducationList";
import DocumentSidebar from "@/components/features/profile/DocumentSidebar";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pt-8 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Profile Header (Avatar, Tên, Progress Bar) */}
        <section className="mb-6">
          <ProfileHeader />
        </section>

        {/* 2. Main Content: Kinh nghiệm, Học vấn, Kỹ năng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExperienceList />

            <EducationList />

            <SkillList />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <DocumentSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
