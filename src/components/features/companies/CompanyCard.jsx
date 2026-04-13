import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

// Hàm dịch mã bưu chính thành tên tỉnh thành để hiển thị
const formatLocationDisplay = (code) => {
  if (!code) return "Toàn quốc";

  // Đảm bảo ép về kiểu chuỗi (String) trước khi so sánh
  switch (String(code).trim()) {
    case "100000":
      return "Hà Nội";
    case "700000":
      return "TP. Hồ Chí Minh";
    case "500000":
      return "Đà Nẵng";
    case "750000":
      return "Bình Dương";
    case "760000":
      return "Đồng Nai";
    case "180000":
      return "Hải Phòng";
    case "940000":
      return "Cần Thơ";
    case "570000":
      return "Khánh Hòa";
    // Thêm các mã khác nếu DB có thêm
    default:
      return code; // Nếu mã lạ, in thẳng mã đó ra
  }
};

const CompanyCard = ({ company = {} }) => {
  return (
    // Dùng companyId để Link tới trang chi tiết
    <Link href={`/companies/${company.companyId}`} className="block group">
      <div className="bg-card-bg p-6 rounded-3xl border border-card-border hover:border-[#00c853] transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-xl relative overflow-hidden h-full">
        {/* Container Logo */}
        <div className="relative w-24 h-24 mb-5 bg-background rounded-2xl p-4 transition-transform group-hover:scale-110">
          <Image
            src={
              company.logoUrl === "" || company.logoUrl === undefined
                ? "/images/one-click-logo.png"
                : company.logoUrl
            }
            alt={company.companyName || "Logo công ty"}
            fill
            className="object-contain p-2"
          />
        </div>

        <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-[#00c853] line-clamp-1">
          {company.companyName}
        </h3>

        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-[11px] font-bold px-4 py-1 rounded-full mb-4">
          {company.industry || "Ngành nghề"}
        </span>

        {/* --- CHÚ Ý CHỖ NÀY: Gọi hàm dịch mã địa điểm --- */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 font-medium">
          <FaMapMarkerAlt size={12} className="group-hover:text-[#00c853]" />
          <span>{formatLocationDisplay(company.provinceCode)}</span>
        </div>
        {/* --------------------------------------------- */}

        <div className="w-full mt-auto py-3 border border-[#00c853] text-[#00c853] font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#00c853] group-hover:text-white transition-all">
          Xem chi tiết
          <FaArrowRight
            size={12}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
