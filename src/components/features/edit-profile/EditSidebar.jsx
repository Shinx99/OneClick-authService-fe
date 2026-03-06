"use client";
import React from "react";
import {
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaFileAlt,
} from "react-icons/fa";

const EditSidebar = () => {
  const menuItems = [
    { id: "personal", label: "Thông tin cá nhân", icon: <FaUser /> },
    { id: "exp", label: "Kinh nghiệm làm việc", icon: <FaBriefcase /> },
    { id: "edu", label: "Học vấn", icon: <FaGraduationCap /> },
    { id: "skill", label: "Kỹ năng", icon: <FaCode /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Lấy vị trí của phần tử so với viewport
      const yOffset = -100; // Khoảng cách chừa ra cho Header fixed
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-gray-500 hover:bg-[#e6f9ee] hover:text-[#00c853] dark:hover:bg-[#1a2e24] group cursor-pointer"
        >
          {/* group-hover: Giúp icon đổi màu cùng lúc với text khi hover */}
          <span className="text-gray-400 group-hover:text-[#00c853] transition-colors">
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default EditSidebar;
