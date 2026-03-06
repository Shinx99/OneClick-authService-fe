"use client";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const SectionHeader = ({ title, onAdd }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 mb-6 transition-all">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span>
        {title}
      </h3>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-[#00c853] font-bold text-sm hover:opacity-80 transition-all cursor-pointer"
        >
          <FaPlusCircle />
          Thêm mới
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
