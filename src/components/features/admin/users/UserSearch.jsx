"use client";
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function UserSearch({ onSearchChange, searchTerm }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] transition-colors">
        <FaSearch size={14} />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm theo tên hoặc email..."
        className="pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#00c853] focus:bg-white rounded-2xl text-sm font-medium outline-none w-72 transition-all shadow-sm"
      />
    </div>
  );
}
