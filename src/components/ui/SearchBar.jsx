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
      className={`bg-card-bg rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl mx-auto border border-card-border transition-all w-full max-w-6xl ${className}`}
    >
      {/* 1. Danh mục Nghề */}
      <div className="hidden md:flex items-center px-5 py-2 border-r border-card-border cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-l-full transition-colors group">
        <div className="p-2 rounded-full mr-3 text-[#00c853] bg-green-50 dark:bg-green-500/10 transition-colors">
          <FaListUl size={14} />
        </div>
        <span className="text-[#00c853] font-bold text-sm whitespace-nowrap">
          Danh mục Nghề
        </span>
      </div>

      {/* 2. Ô nhập tên công việc */}
      <div className="flex-[2] flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-card-border py-4 md:py-0">
        <FaSearch className="text-text-muted mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Vị trí tuyển dụng, tên công ty..."
          className="outline-none bg-transparent text-text-main w-full text-sm placeholder:text-text-muted font-medium"
        />
      </div>

      {/* 3. Ô chọn địa điểm */}
      <div className="flex-1 flex items-center px-6 w-full py-4 md:py-0 group cursor-pointer">
        <FaMapMarkerAlt className="text-text-muted mr-3 shrink-0 group-hover:text-[#00c853] transition-colors" />
        <input
          type="text"
          placeholder="Địa điểm"
          className="outline-none bg-transparent text-text-main w-full text-sm cursor-pointer placeholder:text-text-muted font-medium"
          readOnly
        />
        <FaChevronDown className="text-text-muted ml-2 size-3 group-hover:text-[#00c853] transition-colors" />
      </div>

      {/* Nút Tìm kiếm */}
      <button className="bg-[#00c853] hover:bg-[#00a846] text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-green-500/20 dark:shadow-none w-full md:w-auto cursor-pointer active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
        <FaSearch size={14} />
        <span>Tìm kiếm</span>
      </button>
    </div>
  );
};

export default SearchBar;
