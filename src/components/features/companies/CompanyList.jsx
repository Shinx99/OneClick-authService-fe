"use client";
import React from "react";
import CompanyCard from "./CompanyCard";

const CompanyList = ({ companies = [] }) => {
  return (
    <div className="space-y-8">
      {/* Grid danh sách card */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1e1e1e] p-12 rounded-[2rem] text-center border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-400 italic">
            Không tìm thấy công ty nào phù hợp với bộ lọc.
          </p>
        </div>
      )}

      {/* Phân trang (Pagination) - Giữ nguyên UX bo góc chuẩn Figma */}
      {companies.length > 0 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          {[1, 2, 3, "...", 12].map((p, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-xl font-black transition-all active:scale-90
                ${
                  p === 1
                    ? "bg-[#00c853] text-white shadow-lg shadow-green-500/20"
                    : "bg-white dark:bg-[#1e1e1e] text-gray-400 hover:text-[#00c853] border border-gray-100 dark:border-gray-800"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyList;
