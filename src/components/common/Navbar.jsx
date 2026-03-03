"use client";
import React from "react";
import Link from "next/link";
console.log("Navbar component rendered");
const Header = () => {
  // Danh sách các mục menu để dễ quản lý và render
  const navLinks = [
    { name: "Việc làm", href: "/jobs" },
    { name: "Công ty", href: "/companies" },
    { name: "Hồ sơ", href: "/profile" },
    { name: "Thông báo", href: "/notifications" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 1. KHỐI LOGO (Trái) */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-[#e8f5e9] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              {/* Icon lá cây đặc trưng của One-Click */}
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

          {/* 2. KHỐI NAVIGATION (Giữa) */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-[#00c853] font-semibold text-[15px] transition-colors relative group"
              >
                {link.name}
                {/* Hiệu ứng gạch chân khi hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00c853] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* 3. KHỐI ACTION BUTTONS (Phải) */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 text-[#0091ff] font-bold border border-[#e3f2fd] rounded-full hover:bg-[#f5faff] transition-all text-sm flex items-center justify-center"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-[#00e676] text-white font-bold rounded-full hover:bg-[#00c853] transition-all shadow-md shadow-green-100 cursor-pointer text-sm"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
