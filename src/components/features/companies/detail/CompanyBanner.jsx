import React from "react";
import Image from "next/image";

// Hàm kiểm tra URL hợp lệ để tránh lỗi "Invalid URL" gây sập trang
const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http") || url.startsWith("/");
};

const CompanyBanner = ({ company = {} }) => {
  return (
    <div className="relative mb-8">
      {/* Image Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-[2rem]">
        <Image
          src={
            isValidUrl(company.backgroundUrl || company.cover)
              ? company.backgroundUrl || company.cover
              : "/images/banner-placeholder.png"
          }
          alt={`${company.companyName || "Company"} cover`}
          fill
          priority // Đảm bảo ảnh banner được tải ngay lập tức khi trang được truy cập
          className="object-cover"
        />
      </div>

      {/* Profile Info  */}
      <div className="absolute -bottom-12 left-8 right-8 flex flex-col md:flex-row items-end justify-between gap-4">
        <div className="flex items-end gap-6">
          {/* Logo Công ty  */}
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-card-bg dark:border-gray-900 bg-card-bg shadow-lg flex-shrink-0">
            <Image
              // Sử dụng logoUrl theo đúng tên trong Database và kiểm tra hợp lệ
              src={
                isValidUrl(company.logoUrl)
                  ? company.logoUrl
                  : "/images/company-placeholder.png"
              }
              alt={`${company.companyName || "Company"} logo`}
              fill
              className="object-contain p-2"
            />
          </div>

          {/* Text Info */}
          <div className="pb-2">
            <h1 className="text-3xl font-black text-text-main flex items-center gap-3">
              {/* Đổi company.name thành company.companyName cho khớp DB */}
              {company.companyName || "Tên công ty"}
              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-500 px-3 py-1 rounded-full whitespace-nowrap font-bold">
                {company.industry || "Ngành nghề"}
              </span>
            </h1>
          </div>
        </div>

        {/* Button Theo dõi */}
        {/* <button className="bg-[#00c853] text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 mb-2 whitespace-nowrap transition-transform hover:opacity-90">
          Theo dõi
        </button> */}
      </div>
    </div>
  );
};

export default CompanyBanner;
