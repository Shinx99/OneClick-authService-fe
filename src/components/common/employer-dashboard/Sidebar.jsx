"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Thêm useRouter để điều hướng
import {
  MdOutlineDashboard,
  MdOutlineWorkOutline,
  MdOutlinePeopleAlt,
  MdOutlineSearch,
  MdOutlineBusiness,
  MdOutlineSettings,
  MdOutlineHelpOutline,
  MdOutlineLogout,
  MdManageAccounts,
  MdOutlinePublic, // Import thêm icon cho phần Mạng xã hội / Thương hiệu
} from "react-icons/md";
import { useAuth } from "@/context/AuthContext"; // Import Hook quản lý Auth
import toast from "react-hot-toast";

const navItems = [
  {
    name: "Bảng điều khiển",
    href: "/employer/dashboard",
    icon: MdOutlineDashboard,
  },
  {
    name: "Tin tuyển dụng",
    href: "/employer/job-posting",
    icon: MdOutlineWorkOutline,
  },
  {
    name: "Quản lý ứng viên",
    href: "/employer/candidate",
    icon: MdOutlinePeopleAlt,
  },
  {
    name: "Quản lý nhân sự",
    href: "/employer/team",
    icon: MdManageAccounts,
  },
  {
    name: "Tìm kiếm hồ sơ",
    href: "/employer/resume-search",
    icon: MdOutlineSearch,
  },
  {
    name: "Hồ sơ công ty",
    href: "/employer/company-profile",
    icon: MdOutlineBusiness,
  },
  {
    name: "Thương hiệu cá nhân", // NavItem mới thêm vào
    href: "/employer/social-profile",
    icon: MdOutlinePublic,
  },
  {
    name: "Cài đặt tài khoản",
    href: "/employer/setting",
    icon: MdOutlineSettings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext

  // Hàm xử lý đăng xuất dành cho Employer
  const handleLogout = async () => {
    try {
      await logout(); // Thực thi xóa session/token trong Context và Service
      toast.success("Đã đăng xuất tài khoản nhà tuyển dụng");
      router.push("/login"); // Điều hướng về trang đăng nhập sau khi thành công
    } catch (error) {
      toast.error("Lỗi đăng xuất, vui lòng thử lại");
      console.error("Logout Error:", error);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] flex flex-col justify-between fixed left-0 top-0 bottom-0 z-40">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="px-6 pt-6 pb-8">
          <Link
            href="/employer/dashboard"
            className="flex items-center gap-3 group"
          >
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
              <span className="text-xl font-extrabold text-white tracking-tight block leading-tight">
                One-Click
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-[0.15em] uppercase">
                Nền tảng tuyển dụng
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/employer/dashboard" &&
                  pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-l-[3px] border-emerald-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-6">
        {/* Support */}
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <MdOutlineHelpOutline className="w-5 h-5" />
          <span>Hỗ trợ</span>
        </Link>

        {/* System Status */}
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
            Hệ thống hoạt động
          </span>
        </div>

        {/* Logout - Đã gán hàm xử lý đăng xuất */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <MdOutlineLogout className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
