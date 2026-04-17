"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  MdOutlinePublic,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  {
    name: "Bảng điều khiển",
    href: "/employer/dashboard",
    icon: MdOutlineDashboard,
  },
  {
    name: "Tin tuyển dụng",
    icon: MdOutlineWorkOutline,
    children: [
      {
        name: "Danh sách tin",
        href: "/employer/job-posting",
      },
      {
        name: "Quy trình tuyển dụng",
        href: "/employer/candidate",
      },
    ],
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
    name: "Thương hiệu cá nhân",
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
  const { logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất tài khoản nhà tuyển dụng");
      router.push("/login");
    } catch (error) {
      toast.error("Lỗi đăng xuất, vui lòng thử lại");
    }
  };

  return (
    <aside
      className={`min-h-screen bg-[#0f172a] flex flex-col justify-between fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"
      >
        {isCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
      </button>

      {/* TOP */}
      <div>
        {/* Logo */}
        <div
          className={`pt-6 pb-8 flex items-center ${
            isCollapsed ? "justify-center" : "px-6"
          }`}
        >
          <Link href="/employer/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#e8f5e9] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#00c853]" viewBox="0 0 24 24">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-white font-bold">One-Click</span>
              </div>
            )}
          </Link>
        </div>

        {/* NAV */}
        <nav className="px-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              // ===== ITEM CÓ CHILD =====
              if (item.children) {
                const isParentActive = item.children.some((child) =>
                  pathname.startsWith(child.href),
                );

                return (
                  <li key={item.name}>
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === item.name ? null : item.name)
                      }
                      className={`w-full flex items-center rounded-xl ${
                        isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                      } ${
                        isParentActive
                          ? "text-emerald-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />

                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <MdChevronRight
                            className={`transition ${
                              openMenu === item.name ? "rotate-90" : ""
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {/* CHILD */}
                    {!isCollapsed && openMenu === item.name && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isActive = pathname.startsWith(child.href);
                          return (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={`block px-4 py-2 rounded-lg text-sm ${
                                  isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              // ===== ITEM THƯỜNG =====
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-xl ${
                      isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                    } ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="px-3 pb-6 space-y-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-xl text-slate-400 hover:text-red-400 ${
            isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
          }`}
        >
          <MdOutlineLogout className="w-5 h-5" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
