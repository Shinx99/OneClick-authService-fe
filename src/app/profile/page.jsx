"use client";
import React from "react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import ExperienceList from "@/components/features/profile/ExperienceList";
import SkillList from "@/components/features/profile/SkillList";
import EducationList from "@/components/features/profile/EducationList";
import DocumentSidebar from "@/components/features/profile/DocumentSidebar";

const ProfilePage = () => {
  // DỮ LIỆU TỔNG (Sau này fetch từ GET /api/user/profile)
  const userData = {
    personal: {
      fullName: "Lê Nguyễn Hoàng Trung",
      position: "Full-stack Developer",
      location: "Hà Nội, Việt Nam",
      avatar: "/images/one-click-logo.png",
    },
    experiences: [
      {
        id: 1,
        role: "Senior Product Designer",
        company: "VinGroup",
        time: "2020 - Hiện tại",
        desc: "Chịu trách nhiệm thiết kế trải nghiệm người dùng...",
        achievements: [
          "Tăng tỷ lệ chuyển đổi lên 15%",
          "Xây dựng hệ thống Design System",
        ],
        logo: "/images/one-click-logo.png",
      },
    ],
    education: [
      {
        id: 1,
        school: "Đại học FPT",
        major: "Software Development",
        time: "2014 - 2018",
        gpa: "3.51/4.0",
        logo: "/images/one-click-logo.png",
      },
    ],
    skills: [
      { id: 1, name: "Java Spring Boot" },
      { id: 2, name: "Next.js" },
      { id: 3, name: "Docker" },
    ],
    documents: [
      {
        id: 1,
        name: "CV_HoangTrung.pdf",
        updateAt: "2 ngày trước",
        type: "pdf",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pt-8 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-6">
          <ProfileHeader user={userData.personal} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExperienceList experiences={userData.experiences} />
            <EducationList education={userData.education} />
            <SkillList skills={userData.skills} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <DocumentSidebar documents={userData.documents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
