"use client";
import React from "react";
import Image from "next/image";

const CompanyBanner = ({ company = {} }) => {
  return (
    <div className="relative mb-8">
      {/* Cover Image - Giữ nguyên h-64/h-80 và bo góc 2rem */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-[2rem]">
        <Image
          src={company.cover || "/images/banner-placeholder.png"}
          alt="Cover"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Profile Info Overlay - Giữ nguyên absolute và spacing */}
      <div className="absolute -bottom-12 left-8 right-8 flex flex-col md:flex-row items-end justify-between gap-4">
        <div className="flex items-end gap-6">
          {/* Logo Công ty - Giữ nguyên border-4 white */}
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white bg-white shadow-lg flex-shrink-0">
            <Image
              src={company.logo || "/images/company-placeholder.png"}
              alt="Logo"
              fill
              className="object-contain p-2"
            />
          </div>

          {/* Text Info - Giữ nguyên cấu trúc h1 và span industry */}
          <div className="pb-2">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              {company.name || "Tên công ty"}
              <span className="text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-full whitespace-nowrap">
                {company.industry || "Ngành nghề"}
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {company.slogan || "Slogan công ty"}
            </p>
          </div>
        </div>

        {/* Button Theo dõi - Giữ nguyên màu xanh #00c853 và active:scale-95 */}
        <button className="bg-[#00c853] text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 mb-2 whitespace-nowrap">
          Theo dõi
        </button>
      </div>
    </div>
  );
};

export default CompanyBanner;
