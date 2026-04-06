import React from "react";
import Link from "next/link";
import { FaRocket, FaUserTie } from "react-icons/fa";

const CallToAction = () => {
  return (
    <section className="bg-background py-16 md:py-20 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* LỚP NỀN HIỆU ỨNG (Glow) - Chỉ hiện ở Dark Mode */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00c853] to-[#1de9b6] rounded-[30px] blur-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-500 dark:block hidden"></div>

          {/* Container chính */}
          <div className="relative bg-card-bg border border-card-border rounded-[30px] p-8 md:p-12 lg:p-16 overflow-hidden shadow-2xl transition-all duration-300 text-center">
            {/* Hiệu ứng Gradient chìm */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-card-bg)_0%,#00c85308_100%)]"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Badge Tiêu điểm */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-800 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c853] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c853]"></span>
                </span>
                <span className="text-[10px] font-bold text-[#00c853] uppercase tracking-widest">
                  Hành trình mới
                </span>
              </div>

              {/* Tiêu đề - Đã bỏ tracking-tighter để tránh nhảy dòng */}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-text-main leading-[1.2] mb-6 max-w-4xl px-2">
                Sẵn sàng để bắt đầu{" "}
                <span className="bg-gradient-to-r from-[#00c853] to-[#1de9b6] bg-clip-text text-transparent">
                  hành trình mới?
                </span>
              </h2>

              {/* Mô tả */}
              <p className="text-sm md:text-lg text-text-muted mb-10 max-w-3xl mx-auto font-medium leading-relaxed px-4">
                Tham gia cùng{" "}
                <span className="text-text-main font-bold">
                  hơn 100,000 ứng viên
                </span>{" "}
                đã tìm thấy công việc mơ ước qua nền tảng tuyển dụng hiện đại{" "}
                <span className="text-[#00c853] font-bold">One-Click</span>.
              </p>

              {/* Buttons - Dàn hàng ngang trên desktop, dọc trên mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <Link
                  href="/register"
                  className="group relative inline-flex items-center justify-center gap-3 bg-[#00c853] text-white px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 shadow-lg shadow-green-500/25 hover:bg-[#00b04a] active:scale-95 w-full sm:w-auto"
                >
                  <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="whitespace-nowrap">
                    Đăng ký ứng tuyển ngay
                  </span>
                </Link>

                <Link
                  href="/employer/register"
                  className="inline-flex items-center justify-center gap-3 bg-white/5 dark:bg-white/10 backdrop-blur-sm border border-card-border hover:border-[#00c853]/50 text-text-main px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 w-full sm:w-auto"
                >
                  <FaUserTie className="text-[#00c853]" />
                  <span className="whitespace-nowrap">
                    Dành cho nhà tuyển dụng
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
