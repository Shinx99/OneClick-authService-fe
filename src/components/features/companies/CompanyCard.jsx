import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

// --- Hàm dịch mã bưu chính ---
const formatLocationDisplay = (code) => {
  if (!code) return "Toàn quốc";
  const locations = {
    100000: "Hà Nội",
    700000: "TP. Hồ Chí Minh",
    500000: "Đà Nẵng",
    750000: "Bình Dương",
    760000: "Đồng Nai",
    180000: "Hải Phòng",
    940000: "Cần Thơ",
    570000: "Khánh Hòa",
  };
  return locations[String(code).trim()] || code;
};

const CompanyCard = ({ company = {} }) => {
  const getImageUrl = (url) => {
    if (!url) return "/images/company-placeholder.png";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/${url}`;
  };

  return (
    <Link
      href={`/companies/${company.companyId || ""}`}
      className="block group"
    >
      <div className="bg-card-bg p-5 rounded-3xl border border-card-border hover:border-[#00c853] transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-xl h-full">
        <div className="relative w-20 h-20 mb-4 bg-background rounded-2xl p-3 transition-transform group-hover:scale-105">
          <Image
            src={getImageUrl(company.logoUrl)}
            alt={company.companyName || "Company"}
            fill
            className="object-contain p-2"
          />
        </div>

        <h3 className="font-bold text-base text-text-main mb-1 group-hover:text-[#00c853] line-clamp-1">
          {company.companyName || "Tên công ty"}
        </h3>

        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full mb-3">
          {company.industry || "Đa ngành"}
        </span>

        <div className="flex items-center gap-2 text-gray-400 text-xs mb-5 font-medium">
          <FaMapMarkerAlt size={10} className="group-hover:text-[#00c853]" />
          <span>{formatLocationDisplay(company.provinceCode)}</span>
        </div>

        <div className="w-full mt-auto py-2.5 border border-[#00c853] text-[#00c853] text-sm font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#00c853] group-hover:text-white transition-all">
          Xem chi tiết
          <FaArrowRight
            size={10}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
