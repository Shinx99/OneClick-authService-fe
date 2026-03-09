"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaGraduationCap, FaCode } from "react-icons/fa";

const EditSidebar = () => {
  // State để theo dõi phần tử nào đang hiển thị trên màn hình
  const [activeSection, setActiveSection] = useState("personal");

  const menuItems = [
    { id: "personal", label: "Thông tin cá nhân", icon: <FaUser /> },
    { id: "exp", label: "Kinh nghiệm làm việc", icon: <FaBriefcase /> },
    { id: "edu", label: "Học vấn", icon: <FaGraduationCap /> },
    { id: "skill", label: "Kỹ năng", icon: <FaCode /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id); // Set active ngay khi click
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Logic nâng cao: Tự động đổi Active khi người dùng cuộn chuột (Scroll Spy)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset để nhận diện section sớm hơn

      menuItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="px-6 py-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
        Danh mục chỉnh sửa
      </h3>

      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer group
            ${
              activeSection === item.id
                ? "bg-[#e6f9ee] dark:bg-[#1a2e24] text-[#00c853] shadow-sm shadow-green-500/10"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252525] hover:text-[#00c853]"
            }`}
        >
          <span
            className={`transition-colors ${
              activeSection === item.id
                ? "text-[#00c853]"
                : "text-gray-400 group-hover:text-[#00c853]"
            }`}
          >
            {item.icon}
          </span>
          {item.label}

          {/* Một cái indicator nhỏ xíu ở bên phải cho xịn */}
          {activeSection === item.id && (
            <div className="ml-auto w-1.5 h-1.5 bg-[#00c853] rounded-full shadow-lg shadow-green-500"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default EditSidebar;
