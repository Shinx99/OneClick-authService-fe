// src/components/common/Footer.jsx
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#f9fafb] pt-16 pb-8 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* LƯỚI DANH MỤC (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#e8f5e9] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#00c853]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">One-Click</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Giải pháp tuyển dụng hiện đại, kết nối ứng viên tài năng với những
              cơ hội nghề nghiệp hàng đầu.
            </p>
          </div>

          {/* Cột 2: Cho Ứng viên */}
          <nav className="flex flex-col space-y-4">
            <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">
              Ứng viên
            </h4>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Tìm việc làm
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Cẩm nang nghề nghiệp
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Mẫu CV chuyên nghiệp
            </Link>
          </nav>

          {/* Cột 3: Nhà tuyển dụng */}
          <nav className="flex flex-col space-y-4">
            <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">
              Nhà tuyển dụng
            </h4>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Đăng tin tuyển dụng
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Tìm kiếm nhân tài
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Báo cáo thị trường
            </Link>
          </nav>

          {/* Cột 4: Liên hệ & Hỗ trợ */}
          <nav className="flex flex-col space-y-4">
            <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">
              Hỗ trợ
            </h4>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Trung tâm trợ giúp
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-[#00c853] transition-colors"
            >
              Chính sách bảo mật
            </Link>
          </nav>
        </div>

        {/* PHẦN COPYRIGHT (Dưới cùng) */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-gray-400 font-medium">
          <p>© 2026 One-Click Recruitment. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-gray-600 flex items-center gap-1">
              🌐 Tiếng Việt
            </span>
            <span className="cursor-pointer hover:text-gray-600 flex items-center gap-1">
              ✉️ support@oneclick.vn
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
