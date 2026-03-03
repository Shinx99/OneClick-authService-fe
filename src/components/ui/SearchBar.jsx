"use client";
import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaListUl,
  FaChevronDown,
} from "react-icons/fa";

const SearchBar = ({ className }) => {
  return (
    <div
      className={`bg-white dark:bg-[#1e1e1e] rounded-full p-2 flex flex-col md:flex-row items-center shadow-xl mx-auto border border-gray-100 dark:border-gray-800 transition-all w-full max-w-6xl ${className}`}
    >
      {/* 1. Danh mục Nghề (Phần mới thêm để dài ra) */}
      <div className="hidden md:flex items-center px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-full transition-colors group">
        <div className=" dark:bg-green-900/20 p-2 rounded-full mr-3 text-[#00c853]">
          <FaListUl size={14} />
        </div>
        <span className="text-[#00c853] font-bold text-sm whitespace-nowrap">
          Danh mục Nghề
        </span>
      </div>

      {/* 2. Ô nhập tên công việc (Tăng flex-grow để dài hơn) */}
      <div className="flex-[2] flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 py-4 md:py-0">
        <FaSearch className="text-gray-400 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Vị trí tuyển dụng, tên công ty..."
          className="outline-none bg-transparent text-gray-700 dark:text-white w-full text-sm placeholder:text-gray-400"
        />
      </div>

      {/* 3. Ô chọn địa điểm (Thêm icon mũi tên cho giống mẫu) */}
      <div className="flex-1 flex items-center px-6 w-full py-4 md:py-0 group cursor-pointer">
        <FaMapMarkerAlt className="text-gray-400 mr-3 shrink-0 group-hover:text-[#00c853] transition-colors" />
        <input
          type="text"
          placeholder="Địa điểm"
          className="outline-none bg-transparent text-gray-700 dark:text-white w-full text-sm cursor-pointer"
          readOnly
        />
        <FaChevronDown className="text-gray-400 ml-2 size-3" />
      </div>

      <button className="bg-[#00c853] hover:bg-[#00a846] text-white px-12 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-green-100 dark:shadow-none w-full md:w-auto cursor-pointer active:scale-95 flex items-center justify-center gap-2">
        <FaSearch size={14} />
        <span>Tìm kiếm</span>
      </button>
    </div>
  );
};

export default SearchBar;
