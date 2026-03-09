"use client";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const SectionHeader = ({ title, onAdd }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 mb-6 transition-all group">
      <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
        {/* Thanh indicator xanh thương hiệu */}
        <span className="w-1.5 h-6 bg-[#00c853] rounded-full shadow-sm shadow-green-500/20"></span>
        {title}
      </h3>

      {onAdd && (
        <button
          onClick={onAdd}
          type="button"
          className="flex items-center gap-2 text-[#00c853] font-bold text-sm hover:text-[#00a846] transition-all cursor-pointer active:scale-90 px-2 py-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10"
        >
          <FaPlusCircle className="text-base" />
          <span>Thêm mới</span>
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
