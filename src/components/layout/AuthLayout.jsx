"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const AuthLayout = ({ loginForm, registerForm, initialIsRegister = false }) => {
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  // Thêm đoạn này để xử lý nút Back/Forward của trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      // Kiểm tra URL hiện tại đang là gì để set State tương ứng
      if (window.location.pathname === "/register") {
        setIsRegister(true);
      } else if (window.location.pathname === "/login") {
        setIsRegister(false);
      }
    };

    // Lắng nghe sự kiện người dùng bấm Back/Forward
    window.addEventListener("popstate", handlePopState);

    // Cleanup khi component bị hủy
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const toggleMode = () => {
    const newState = !isRegister;
    setIsRegister(newState);

    // Cập nhật thanh URL ngầm để khớp với giao diện
    if (newState) {
      window.history.pushState(null, "", "/register");
    } else {
      window.history.pushState(null, "", "/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="bg-gray-100 dark:bg-[#1e293b] relative w-full max-w-[1100px] min-h-[740px] rounded-[30px] shadow-2xl overflow-hidden">
        {/* --- KHU VỰC TRÁI: Chứa Form Đăng Nhập --- */}
        <div
          className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 transition-all duration-700 ease-in-out z-10
            ${isRegister ? "opacity-0 -translate-x-[20%] pointer-events-none" : "opacity-100 translate-x-0"}
          `}
        >
          {/* Nhúng component LoginForm được truyền từ ngoài vào */}
          {loginForm}
        </div>

        {/* --- KHU VỰC PHẢI: Chứa Form Đăng Ký --- */}
        <div
          className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 transition-all duration-700 ease-in-out z-10
            ${isRegister ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[20%] pointer-events-none"}
          `}
        >
          {/* Nhúng component RegisterForm được truyền từ ngoài vào */}
          {registerForm}
        </div>

        {/* --- LỚP PHỦ ẢNH TRƯỢT (OVERLAY) --- */}
        <div
          className={`hidden md:block absolute top-0 left-0 w-1/2 h-full z-30 overflow-hidden transition-all duration-700 ease-in-out
    ${isRegister ? "translate-x-0 rounded-r-[50px]" : "translate-x-full rounded-l-[50px]"}
  `}
        >
          <div className="absolute inset-0 bg-black/20 z-10"></div>

          <Image
            src="/images/login-bg.jpg"
            alt="Auth Background"
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center p-12">
            {/* Nội dung mời Đăng nhập */}
            <div
              className={`transition-all duration-700 absolute flex flex-col items-center ${isRegister ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
            >
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4 uppercase tracking-wider drop-shadow-md">
                Chào mừng trở lại!
              </h2>
              <p className="mb-8 text-sm font-medium opacity-90">
                Để tiếp tục kết nối với mạng lưới công việc, vui lòng đăng nhập.
              </p>
              <button
                onClick={toggleMode}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Đăng nhập
              </button>
            </div>

            {/* Nội dung mời Đăng ký */}
            <div
              className={`transition-all duration-700 absolute flex flex-col items-center ${isRegister ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"}`}
            >
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4 uppercase tracking-wider drop-shadow-md">
                Chào mừng bạn!
              </h2>
              <p className="mb-8 text-sm font-medium opacity-90">
                Tạo tài khoản ngay để bắt đầu hành trình sự nghiệp của bạn.
              </p>
              <button
                onClick={toggleMode}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
