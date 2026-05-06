"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const EmployerNavbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Giới thiệu", href: "#" },
    { name: "Báo giá", href: "#" },
    { name: "Dành tuyển dụng", href: "#" },
    { name: "Tư vấn tuyển dụng", href: "#" },
  ];

  return (
    <>
      {/* Khoảng trống */}
      <div className="h-20 w-full"></div>

      {/* Phần đầu */}
      <header
        className={`fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-100 z-50 shadow-sm transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/help-center"
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

            {/* Menu điều hướng */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-[#00c853] font-semibold text-[14px] transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00c853] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Các nút hành động */}
            <div className="flex items-center gap-3">
              <div className="w-48">
                <Link href="/login" className="block w-full">
                  <Button variant="social">Đăng nhập</Button>
                </Link>
              </div>
              <div className="w-48">
                <Link href="/register" className="block w-full">
                  <Button variant="primary">Đăng ký Nhà Tuyển Dụng</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default EmployerNavbar;
