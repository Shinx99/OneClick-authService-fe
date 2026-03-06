"use client";
import React from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

const ExperienceList = () => {
  // MOCK DATA: Sau này thay bằng API từ Spring Boot
  const experiences = [
    {
      id: 1,
      role: "Senior Product Designer",
      company: "VinGroup",
      time: "2020 - Hiện tại",
      desc: "Chịu trách nhiệm thiết kế trải nghiệm người dùng cho các sản phẩm Fintech. Dẫn dắt đội ngũ thiết kế gồm 5 thành viên.",
      achievements: [
        "Tăng tỷ lệ chuyển đổi lên 15% thông qua tối ưu hóa luồng đăng ký.",
        "Xây dựng hệ thống Design System mới giúp giảm 30% thời gian thiết kế.",
      ],
      logo: "/images/vin-logo.png",
    },
    {
      id: 2,
      role: "UI/UX Designer",
      company: "TopCV",
      time: "2018 - 2020",
      desc: "Thiết kế giao diện website và ứng dụng di động cho nền tảng tuyển dụng.",
      logo: "/images/topcv-logo.png",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#00c853] rounded-full"></span>
          Kinh nghiệm làm việc
        </h2>
        {/* Nút thêm nhanh cho UI */}
        <button className="p-2 text-[#00c853] hover:bg-green-50 rounded-full transition-colors">
          <FaPlus />
        </button>
      </div>

      <div className="space-y-8 relative">
        {/* Đường kẻ dọc nối các mốc thời gian (Timeline) */}
        <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

        {experiences.map((exp) => (
          <div key={exp.id} className="relative flex gap-6 group">
            {/* Logo công ty - dùng z-10 để nằm trên đường kẻ timeline */}
            <div className="relative w-14 h-14 flex-shrink-0 bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-100 dark:border-gray-700 p-2 z-10 shadow-sm">
              <Image
                src={exp.logo}
                alt={exp.company}
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="flex-1 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {exp.role}
                  </h3>
                  <p className="text-[#00c853] font-semibold text-sm">
                    {exp.company}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 italic">
                    {exp.time}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                {exp.desc}
              </p>
              {/* Hiển thị thành tựu nếu có */}
              {exp.achievements && (
                <ul className="mt-3 space-y-2">
                  {exp.achievements.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-[#00c853] mt-1">✓</span> {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceList;
