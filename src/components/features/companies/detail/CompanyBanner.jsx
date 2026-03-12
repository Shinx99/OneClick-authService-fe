import React from "react";
import Image from "next/image";

const CompanyBanner = ({ company = {} }) => {
  return (
    <div className="relative mb-8">
      {/* Image BAnner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-[2rem]">
        <Image
          src={company.cover || "/images/banner-placeholder.png"}
          alt={`${company.name} cover`}
          fill
          priority // Đảm bảo ảnh banner được tải ngay lập tức khi trang được truy cập
          className="object-cover"
        />
      </div>

      {/* Profile Info  */}
      <div className="absolute -bottom-12 left-8 right-8 flex flex-col md:flex-row items-end justify-between gap-4">
        <div className="flex items-end gap-6">
          {/* Logo Công ty  */}
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-gray-900 bg-white shadow-lg flex-shrink-0">
            <Image
              src={company.logo || "/images/company-placeholder.png"}
              alt={`${company.name} logo`}
              fill
              className="object-contain p-2"
            />
          </div>

          {/* Text Info */}
          <div className="pb-2">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              {company.name || "Tên công ty"}
              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-500 px-3 py-1 rounded-full whitespace-nowrap font-bold">
                {company.industry || "Ngành nghề"}
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              {company.slogan || "Slogan công ty"}
            </p>
          </div>
        </div>

        {/* Button Theo dõi */}
        <button className="bg-[#00c853] text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 mb-2 whitespace-nowrap transition-transform hover:opacity-90">
          Theo dõi
        </button>
      </div>
    </div>
  );
};

export default CompanyBanner;
