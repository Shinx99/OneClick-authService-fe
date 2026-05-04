"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, ROLES } from "@/context/AuthContext";

const AuthLayout = ({ loginForm, registerForm }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isLoading, user } = useAuth();

  // Tính toán trực tiếp trạng thái hiện tại từ URL
  const isRegister = pathname === "/register";

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const roles = user.roles || [];

      const isOnlyCandidate =
        roles.includes(ROLES.CANDIDATE) &&
        !roles.includes(ROLES.RECRUITER) &&
        !roles.includes(ROLES.ADMIN);

      if (isOnlyCandidate && isRegister) {
        return;
      }

      if (roles.includes(ROLES.ADMIN)) {
        router.replace("/admin");
      } else if (roles.includes(ROLES.RECRUITER)) {
        router.replace("/employer/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router, isRegister]); // ✅ Đã đổi pathname thành isRegister ở đây
  const toggleMode = () => {
    router.push(isRegister ? "/login" : "/register");
  };

  // 1. Màn hình chờ khi đang kiểm tra Auth
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // 2. CHỐT CHẶN UI:
  const isOnlyCandidate =
    user?.roles?.includes(ROLES.CANDIDATE) &&
    !user?.roles?.includes(ROLES.RECRUITER) &&
    !user?.roles?.includes(ROLES.ADMIN);

  // Ẩn UI nếu đã login, NGOẠI TRỪ trường hợp Candidate đang ở trang /register
  const shouldBlockUI = isAuthenticated && !(isOnlyCandidate && isRegister);

  if (shouldBlockUI) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="bg-gray-100 dark:bg-[#1e293b] relative w-full max-w-[1100px] min-h-[740px] rounded-[30px] shadow-2xl overflow-hidden">
        {/* --- KHU VỰC TRÁI: Chứa Form Đăng Nhập --- */}
        <div
          className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 transition-all duration-700 ease-in-out z-10
            ${isRegister ? "opacity-0 -translate-x-[20%] pointer-events-none" : "opacity-100 translate-x-0"}
          `}
        >
          {loginForm}
        </div>

        {/* --- KHU VỰC PHẢI: Chứa Form Đăng Ký --- */}
        <div
          className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 transition-all duration-700 ease-in-out z-10
            ${isRegister ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[20%] pointer-events-none"}
          `}
        >
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
