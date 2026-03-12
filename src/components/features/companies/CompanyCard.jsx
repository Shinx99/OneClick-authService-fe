import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const CompanyCard = ({ company = {} }) => {
  return (
    <Link href={`/companies/${company.slug}`} className="block group">
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-[#00c853] transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-xl relative overflow-hidden h-full">
        {company.isTop && (
          <span className="absolute top-4 right-4 bg-[#00c853] text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-lg z-10">
            TOP RATE
          </span>
        )}

        {/* Container Logo */}
        <div className="relative w-24 h-24 mb-5 bg-gray-50 dark:bg-[#252525] rounded-2xl p-4 transition-transform group-hover:scale-110">
          <Image
            src={company.logo || "/images/company-placeholder.png"}
            alt={company.name || "Company Logo"}
            fill
            className="object-contain p-2"
          />
        </div>

        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#00c853] transition-colors line-clamp-1">
          {company.name}
        </h3>

        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-[11px] font-bold px-4 py-1 rounded-full mb-4">
          {company.industry}
        </span>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 font-medium">
          <FaMapMarkerAlt size={12} className="group-hover:text-[#00c853]" />
          <span>{company.location}</span>
        </div>

        {/* Nút Xem chi tiết */}
        <div className="w-full mt-auto py-3 border border-[#00c853] text-[#00c853] font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#00c853] group-hover:text-white transition-all active:scale-95">
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
