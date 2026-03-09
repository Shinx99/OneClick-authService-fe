"use client";
import React from "react";

// Nhận description từ props truyền xuống
const CompanyOverview = ({ description = "" }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all shadow-sm hover:shadow-md">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="w-1.5 h-6 bg-[#00c853] rounded-full"></span>
          Giới thiệu công ty
        </h3>

        {/* Render description động */}
        <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-4 font-medium">
          {description ? (
            /* Tách đoạn văn dựa trên dấu xuống dòng nếu cần, hoặc render trực tiếp */
            <p className="whitespace-pre-line">{description}</p>
          ) : (
            <p className="italic text-gray-400">
              Thông tin giới thiệu đang được cập nhật...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
