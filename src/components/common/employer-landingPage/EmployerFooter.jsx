import React from "react";
import Link from "next/link";

const EmployerFooter = () => {
  return (
    <footer className="bg-[#0f172a] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-slate-400 font-medium">
          {/* Trái: Logo + Bản quyền */}
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg mr-2">One-Click</span>
            <span>© 2024 One-Click, Nền tảng tuyển dụng thông minh hàng đầu.</span>
          </div>

          {/* Phải: Liên kết */}
          <div className="flex items-center gap-6 text-slate-400 font-medium text-xs">
            <Link
              href="#"
              className="hover:text-white transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
            >
              Bảo mật
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EmployerFooter;
