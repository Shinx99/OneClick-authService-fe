import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-card-border mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#00c853]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-text-main">
                One-Click
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Giải pháp tuyển dụng hiện đại, kết nối ứng viên tài năng với những
              cơ hội nghề nghiệp hàng đầu.
            </p>
          </div>

          {/* Cột 2, 3, 4: Sửa tiêu đề và Link */}
          {[
            {
              title: "Ứng viên",
              links: [
                "Tìm việc làm",
                "Cẩm nang nghề nghiệp",
                "Mẫu CV chuyên nghiệp",
              ],
            },
            {
              title: "Nhà tuyển dụng",
              links: [
                "Đăng tin tuyển dụng",
                "Tìm kiếm nhân tài",
                "Báo cáo thị trường",
              ],
            },
            {
              title: "Hỗ trợ",
              links: [
                "Trung tâm trợ giúp",
                "Điều khoản dịch vụ",
                "Chính sách bảo mật",
              ],
            },
          ].map((group) => (
            <nav key={group.title} className="flex flex-col space-y-4">
              <h4 className="font-bold text-text-main uppercase text-xs tracking-wider">
                {group.title}
              </h4>
              {group.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-sm text-text-muted hover:text-[#00c853] transition-colors"
                >
                  {link}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* PHẦN COPYRIGHT */}
        <div className="pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-text-muted font-medium">
          <p>© 2026 One-Click Recruitment. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-text-main flex items-center gap-1">
              🌐 Tiếng Việt
            </span>
            <span className="cursor-pointer hover:text-text-main flex items-center gap-1">
              ✉️ support@oneclick.vn
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
