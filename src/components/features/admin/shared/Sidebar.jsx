"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaThLarge,
  FaUsers,
  FaFileAlt,
  FaTags,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaBolt,
} from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  // Quản lý trạng thái đóng/mở của các menu đa cấp
  const [openMenus, setOpenMenus] = useState({ users: true, content: true });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Hàm kiểm tra xem link có đang active không để tô màu
  const isActive = (path) => pathname === path;

  return (
    <div className="h-screen bg-white border-r border-gray-100 flex flex-col p-6">
      {/* 1. LOGO */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div>
          <div className="w-9 h-9 bg-[#e8f5e9] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              className="w-6 h-6 text-[#00c853]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
            One-Click
          </span>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            Admin Panel
          </p>
        </div>
      </div>

      {/* 2. MENU LIST */}
      <nav
        className="flex-1 space-y-2 overflow-y-auto no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Bảng điều khiển */}
        <MenuLink
          href="/admin"
          icon={<FaThLarge />}
          label="Bảng điều khiển"
          active={isActive("/admin")}
        />

        {/* Người dùng - Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu("users")}
            className="w-full flex items-center justify-between p-4 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm"
          >
            <div className="flex items-center gap-4">
              <FaUsers /> <span>Người dùng</span>
            </div>
            <FaChevronDown
              size={10}
              className={`transition-transform ${openMenus.users ? "rotate-180" : ""}`}
            />
          </button>

          {openMenus.users && (
            <div className="ml-12 space-y-1">
              <SubMenuLink
                href="/admin/users/candidates"
                label="Quản lý Ứng viên"
                active={isActive("/admin/users/candidates")}
              />
              <SubMenuLink
                href="/admin/users/employers"
                label="Quản lý Nhà tuyển dụng"
                active={isActive("/admin/users/employers")}
              />
            </div>
          )}
        </div>

        {/* Nội dung - Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu("content")}
            className="w-full flex items-center justify-between p-4 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm"
          >
            <div className="flex items-center gap-4">
              <FaFileAlt /> <span>Nội dung</span>
            </div>
            <FaChevronDown
              size={10}
              className={`transition-transform ${openMenus.content ? "rotate-180" : ""}`}
            />
          </button>

          {openMenus.content && (
            <div className="ml-12 space-y-1">
              <SubMenuLink
                href="/admin/content/companies"
                label="Phê duyệt Công ty"
                active={isActive("/admin/content/companies")}
              />
              <SubMenuLink
                href="/admin/content/jobs"
                label="Duyệt Tin tuyển dụng"
                active={isActive("/admin/content/jobs")}
              />
            </div>
          )}
        </div>

        {/* Danh mục - Mục được Active xanh như trong hình */}
        <MenuLink
          href="/admin/categories"
          icon={<FaTags />}
          label="Danh mục"
          active={isActive("/admin/categories")}
        />

        {/* Báo cáo */}
        <MenuLink
          href="/admin/reports"
          icon={<FaChartBar />}
          label="Báo cáo"
          active={isActive("/admin/reports")}
        />

        {/* Cấu hình */}
        <MenuLink
          href="/admin/settings"
          icon={<FaCog />}
          label="Cấu hình"
          active={isActive("/admin/settings")}
        />
      </nav>

      {/* 3. USER FOOTER */}
      <div className="mt-auto pt-6 border-t border-gray-50">
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00c853]/10 flex items-center justify-center text-[#00c853] font-bold">
            QT
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">
              Quản trị viên
            </p>
            <p className="text-[10px] text-gray-400 truncate font-medium">
              admin@oneclick.vn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con cho các Menu chính (Dùng chung style)
const MenuLink = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all
      ${
        active
          ? "bg-[#00c853] text-white shadow-lg shadow-green-500/20"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    <span className={active ? "text-white" : "text-gray-400"}>{icon}</span>
    {label}
  </Link>
);

// Component con cho các SubMenu (Link con bên trong)
const SubMenuLink = ({ href, label, active }) => (
  <Link
    href={href}
    className={`block py-2 text-xs font-bold transition-colors
      ${active ? "text-[#00c853]" : "text-gray-400 hover:text-gray-900"}`}
  >
    {label}
  </Link>
);

export default Sidebar;
