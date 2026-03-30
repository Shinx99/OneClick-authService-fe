"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// MỚI THÊM: Import thêm các Icon cần thiết cho Menu mới
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaSuitcase,
  FaFileAlt,
  FaUserShield,
} from "react-icons/fa";
import RoleSelectionModal from "@/components/features/auth/RoleSelectionModal";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  console.log("isAuthenticated debug:", isAuthenticated);
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // MỚI THÊM: State để quản lý việc đóng/mở của các mục trong Dropdown
  const [openSections, setOpenSections] = useState({
    jobs: true,
    cv: true,
    security: true,
  });

  // MỚI THÊM: Hàm xử lý đóng/mở Accordion
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Scroll hide/show header
  useEffect(() => {
    let ticking = false;
    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // FIX: Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Việc làm", href: "/jobs" },
    { name: "Công ty", href: "/companies" },
    { name: "Hồ sơ", href: "/profile" },
    { name: "Thông báo", href: "/notifications" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Lỗi trong quá trình đăng xuất:", error);
    } finally {
      setDropdownOpen(false);
      router.push("/login");
    }
  };
  return (
    <>
      <div className="h-20 w-full"></div>

      <header
        className={`fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-100 z-50 shadow-sm transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 cursor-pointer group"
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
              <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
                One-Click
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-[#00c853] font-semibold text-[15px] transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00c853] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div>
                    <button
                      onClick={() => setIsRoleModalOpen(true)}
                      className="px-6 py-2.5 bg-[#00c853] text-white font-bold rounded-full hover:bg-[#00b04a] shadow-md active:scale-95 transition-all text-sm"
                    >
                      Nhà Tuyển Dụng
                    </button>
                  </div>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 shadow-sm transition-all"
                    >
                      <FaUserCircle className="w-6 h-6" />
                      <span className="hidden md:block">{user?.email?.split('@')[0] || "User"}</span>
                      <FaChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                        {/* PHẦN ĐẦU: thông tin user */}
                        <div className="p-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <FaUserCircle className="w-10 h-10 text-slate-400" />
                            <div>
                              <p className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">
                                {user?.email}
                              </p>
                              <p className="text-xs text-slate-500 capitalize">
                                {user?.roles?.[0] || "User"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* PHẦN DƯỚI */}
                        <div className="py-2">
                          {/* --- KHU VỰC 1: QUẢN LÝ TÌM VIỆC --- */}
                          <div className="border-b border-gray-100">
                            <button
                              onClick={() => toggleSection("jobs")}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative text-slate-600">
                                  <FaSuitcase className="text-xl" />
                                  <span className="absolute -bottom-0.5 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <span className="font-semibold text-slate-800 text-[15px]">
                                  Quản lý tìm việc
                                </span>
                              </div>
                              <FaChevronDown
                                className={`text-slate-400 text-sm transition-transform ${openSections.jobs ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {openSections.jobs && (
                              <div className="flex flex-col pl-12 pr-4 pb-3 space-y-2.5">
                                <Link
                                  href="/jobs/saved"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  Việc làm đã lưu
                                </Link>
                                <Link
                                  href="/jobs/applied"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  Việc làm đã ứng tuyển
                                </Link>
                              </div>
                            )}
                          </div>

                          {/* --- KHU VỰC 2: QUẢN LÝ CV --- */}
                          <div className="border-b border-gray-100">
                            <button
                              onClick={() => toggleSection("cv")}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative text-slate-600">
                                  <FaFileAlt className="text-xl" />
                                </div>
                                <span className="font-semibold text-slate-800 text-[15px]">
                                  Quản lý CV
                                </span>
                              </div>
                              <FaChevronDown
                                className={`text-slate-400 text-sm transition-transform ${openSections.cv ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {openSections.cv && (
                              <div className="flex flex-col pl-12 pr-4 pb-3 space-y-2.5">
                                <Link
                                  href="/cv/mine"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  CV của tôi
                                </Link>
                                <Link
                                  href="/cv/connections"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  Nhà tuyển dụng muốn kết nối với bạn
                                </Link>
                                <Link
                                  href="/cv/views"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  Nhà tuyển dụng xem hồ sơ
                                </Link>
                              </div>
                            )}
                          </div>

                          {/* --- KHU VỰC 3: CÁ NHÂN & BẢO MẬT --- */}
                          <div className="border-b border-gray-100">
                            <button
                              onClick={() => toggleSection("security")}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative text-slate-600">
                                  <FaUserShield className="text-xl" />
                                  <span className="absolute -bottom-0.5 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <span className="font-semibold text-slate-800 text-[15px]">
                                  Cá nhân & Bảo mật
                                </span>
                              </div>
                              <FaChevronDown
                                className={`text-slate-400 text-sm transition-transform ${openSections.security ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {openSections.security && (
                              <div className="flex flex-col pl-12 pr-4 pb-3 space-y-2.5">
                                <Link
                                  href="/profile/settings"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  Cài đặt thông tin cá nhân
                                </Link>
                                <Link
                                  href="/change-password"
                                  className="text-sm text-slate-600 hover:text-[#00c853] transition-colors"
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setOpenSections({ jobs: false, cv: false, security: false });
                                  }}
                                >
                                  Đổi mật khẩu
                                </Link>
                              </div>
                            )}
                          </div>

                          {/* --- NÚT ĐĂNG XUẤT --- */}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-red-600 hover:bg-red-50 transition-all"
                            >
                              <FaSignOutAlt className="text-xl" />
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-[#0091ff] font-bold border border-[#e3f2fd] rounded-full hover:bg-green-100 transition-all text-sm"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};

export default Header;