"use client";
import React from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";

export default function UserFilter({ onFilterChange, currentStatus }) {
  const statuses = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang hoạt động" },
    { value: "pending", label: "Đang chờ" },
    { value: "inactive", label: "Đã khóa" },
  ];

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <FaFilter size={12} />
      </div>
      <select
        value={currentStatus}
        onChange={(e) => onFilterChange(e.target.value)}
        className="pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent focus:border-[#00c853] focus:bg-white rounded-2xl text-sm font-bold text-gray-500 outline-none appearance-none cursor-pointer transition-all w-56"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
        <FaChevronDown size={10} />
      </div>
    </div>
  );
}