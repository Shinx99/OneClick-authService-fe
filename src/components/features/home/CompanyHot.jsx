"use client";
import React from "react";
import Image from "next/image";

const CompanyHot = () => {
  // 1. Dữ liệu giả lập (Sau này bạn sẽ fetch từ API)
  const companies = [
    { id: 1, name: "Mianima 1", logo: "/logos/company1.png" },
    { id: 2, name: "Mianima 2", logo: "/logos/company2.png" },
    { id: 3, name: "Minimal 3", logo: "/logos/company3.png" },
    { id: 4, name: "Mnimal 4", logo: "/logos/company4.png" },
    { id: 5, name: "Company 5", logo: "/logos/company5.png" },
    { id: 6, name: "Minimal 6", logo: "/logos/company6.png" },
  ];

  return (
    <section className="py-6 bg-gray-100 dark:bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Công ty hàng đầu
          </h2>
          <div className="w-16 h-1 bg-[#00c853] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Container chứa Logo */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group relative flex items-center justify-center p-6 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-transparent hover:border-green-400/50 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Giả lập Logo bằng Text/Icon nếu chưa có file ảnh thực tế */}
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
                {/* Thay thế bằng thẻ <Image /> khi bạn có file ảnh trong thư mục public */}
                <div className="text-center">
                  <span className="text-xs font-semibold text-gray-400 group-hover:text-[#00c853]">
                    {company.name}
                  </span>
                  <p className="text-[10px] text-gray-300">LOGO HERE</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyHot;
