"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import RoleSelectionModal from "@/components/features/auth/RoleSelectionModal";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Thêm logout
  console.log("isAuthenticated debug:", isAuthenticated);
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Fix: no TypeScript

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

  // FIX: Gọi logout từ AuthContext
  const handleLogout = async () => {
    //await logout();
    router.push("/login")
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="h-20 w-full"></div>

      <header className={`fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-100 z-50 shadow-sm transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-9 h-9 bg-[#e8f5e9] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-[#00c853]" fill="currentColor" viewBox="0 0 24 24">
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaUserCircle className="w-8 h-8 text-slate-500" />
                    <span className="hidden md:block text-sm">
                      {/* {user?.email?.split('@')[0] || "User"} */}
                    </span>
                    <FaChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <FaUserCircle className="w-10 h-10 text-slate-400" />
                          <div>
                            <p className="font-semibold text-slate-800 text-sm truncate max-w-[140px]">
                              {user?.email}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                              {user?.roles?.[0] || "User"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-all" onClick={() => setDropdownOpen(false)}>
                          <FaUserCircle className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-all" onClick={() => setDropdownOpen(false)}>
                          <FaCog className="w-4 h-4" />
                          Settings
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all">
                          <FaSignOutAlt className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="px-6 py-2.5 text-[#0091ff] font-bold border border-[#e3f2fd] rounded-full hover:bg-green-100 transition-all text-sm">
                    Đăng nhập
                  </Link>
                  <button onClick={() => setIsRoleModalOpen(true)} className="px-6 py-2.5 bg-[#00c853] text-white font-bold rounded-full hover:bg-[#00b04a] shadow-md active:scale-95 transition-all text-sm">
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <RoleSelectionModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </>
  );
};

export default Header;
