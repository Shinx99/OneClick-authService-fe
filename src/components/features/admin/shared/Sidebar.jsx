"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Thêm useRouter để điều hướng
import {
  FaThLarge,
  FaUsers,
  FaFileAlt,
  FaTags,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaSignOutAlt, // Import icon đăng xuất
  FaBolt,
  FaComments, // icon chat
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext"; // Import Hook Auth của dự án
import toast from "react-hot-toast";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // Lấy hàm logout từ Context

  const [openMenus, setOpenMenus] = useState({ users: true, content: true });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => pathname === path;

  // HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = async () => {
    try {
      await logout(); // Gọi logic xóa token/session trong Context & Service
      toast.success("Đăng xuất thành công");
      router.push("/login"); // Đẩy về trang đăng nhập
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0">
      {/* 1. LOGO */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-[#e8f5e9] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              className="w-6 h-6 text-[#00c853]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-800 tracking-tight block leading-none">
              One-Click
            </span>
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* 2. MENU LIST */}
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
        <MenuLink
          href="/admin"
          icon={<FaThLarge />}
          label="Bảng điều khiển"
          active={isActive("/admin")}
        />

         {/* HỖ TRỢ TRỰC TUYẾN - CHAT */}
        <MenuLink
          href="/admin/chat"
          icon={<FaComments />}
          label="Hỗ trợ trực tuyến"
          active={isActive("/admin/chat")}
        />

        <div className="space-y-1">
          <button
            onClick={() => toggleMenu("users")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm"
          >
            <div className="flex items-center gap-4">
              <FaUsers className="text-gray-400" /> <span>Người dùng</span>
            </div>
            <FaChevronDown
              size={10}
              className={`transition-transform ${openMenus.users ? "rotate-180" : ""}`}
            />
          </button>
          {openMenus.users && (
            <div className="ml-12 space-y-1 animate-in slide-in-from-top-1 duration-200">
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

        <div className="space-y-1">
          <button
            onClick={() => toggleMenu("content")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm"
          >
            <div className="flex items-center gap-4">
              <FaFileAlt className="text-gray-400" /> <span>Nội dung</span>
            </div>
            <FaChevronDown
              size={10}
              className={`transition-transform ${openMenus.content ? "rotate-180" : ""}`}
            />
          </button>
          {openMenus.content && (
            <div className="ml-12 space-y-1 animate-in slide-in-from-top-1 duration-200">
              <SubMenuLink
                href="/admin/content/companies"
                label="Phê duyệt Công ty"
                active={isActive("/admin/content/companies")}
              />
              {/* <SubMenuLink
                href="/admin/content/jobs"
                label="Duyệt Tin tuyển dụng"
                active={isActive("/admin/content/jobs")}
              /> */}
            </div>
          )}
        </div>

        {/* <MenuLink
          href="/admin/categories"
          icon={<FaTags />}
          label="Danh mục"
          active={isActive("/admin/categories")}
        />
        <MenuLink
          href="/admin/reports"
          icon={<FaChartBar />}
          label="Báo cáo"
          active={isActive("/admin/reports")}
        />
        <MenuLink
          href="/admin/settings"
          icon={<FaCog />}
          label="Cấu hình"
          active={isActive("/admin/settings")}
        /> */}
      </nav>

      {/* 3. USER FOOTER & LOGOUT */}
      <div className="mt-auto pt-4 space-y-3">
        {/* Profile Info */}
        <div className="bg-gray-50 p-3.5 rounded-2xl flex items-center gap-3 border border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-[#00c853] flex items-center justify-center text-white text-xs font-black shadow-sm">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-black text-gray-900 truncate uppercase">
              Quản trị viên
            </p>
            <p className="text-[10px] text-gray-400 truncate font-medium">
              admin@oneclick.vn
            </p>
          </div>
        </div>

        {/* NÚT ĐĂNG XUẤT (Sử dụng icon FaSignOutAlt cho khác biệt) */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3.5 rounded-2xl font-black text-xs text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 uppercase tracking-widest"
        >
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

// ... (Giữ nguyên component MenuLink và SubMenuLink của bạn)
const MenuLink = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 p-3.5 rounded-2xl font-bold text-sm transition-all
      ${active ? "bg-[#00c853] text-white shadow-lg shadow-green-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
  >
    <span className={active ? "text-white" : "text-gray-400"}>{icon}</span>
    {label}
  </Link>
);

const SubMenuLink = ({ href, label, active }) => (
  <Link
    href={href}
    className={`block py-1.5 text-xs font-bold transition-colors
      ${active ? "text-[#00c853]" : "text-gray-400 hover:text-gray-900"}`}
  >
    {label}
  </Link>
);

export default Sidebar;
