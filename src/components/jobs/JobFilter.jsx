"use client";
import React, { useState, useEffect } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";

// 1. Cấu hình dữ liệu lọc (Sau này có thể lấy danh mục này từ API)
const FILTER_CONFIG = [
  {
    id: "salary",
    title: "Mức lương",
    options: [
      { label: "Dưới 10 triệu", value: "UNDER_10M" },
      { label: "10 - 20 triệu", value: "10_20M" },
      { label: "Trên 20 triệu", value: "ABOVE_20M" },
    ],
  },
  {
    id: "type",
    title: "Loại hình",
    options: [
      { label: "Toàn thời gian", value: "FULL_TIME" },
      { label: "Bán thời gian", value: "PART_TIME" },
      { label: "Thực tập", value: "INTERN" },
    ],
  },
  {
    id: "method",
    title: "Phương thức",
    options: [
      { label: "Tại văn phòng", value: "OFFICE" },
      { label: "Làm việc từ xa", value: "REMOTE" },
      { label: "Hybrid", value: "HYBRID" },
    ],
  },
];

const FilterGroup = ({ title, options, name, selectedValue, onChange }) => (
  <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4 transition-all">
    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-xs uppercase tracking-widest flex justify-between items-center">
      {title}
      <FaChevronDown className="text-[10px] text-gray-400 md:hidden" />
    </h3>
    <div className="space-y-3">
      {options.map((opt, index) => (
        <label
          key={index}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selectedValue === opt.value}
            onChange={(e) => onChange(e.target.value)}
            className="peer w-4 h-4 accent-[#00c853] cursor-pointer"
          />
          <span
            className={`text-sm transition-colors ${
              selectedValue === opt.value
                ? "text-[#00c853] font-semibold"
                : "text-gray-600 dark:text-gray-400 group-hover:text-[#00c853]"
            }`}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

const JobFilter = () => {
  // Trạng thái lưu trữ các giá trị lọc
  const [filters, setFilters] = useState({
    salary: "",
    type: "",
    method: "",
  });

  // 2. Hàm xử lý thay đổi
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 3. Theo dõi thay đổi của filters để gọi API (Placeholder)
  useEffect(() => {
    const fetchJobs = async () => {
      // Ở đây bạn sẽ dùng axios hoặc fetch để gửi 'filters' lên Spring Boot
      console.log("Đang gửi yêu cầu lọc tới API với params:", filters);
    };

    fetchJobs();
  }, [filters]); // Mỗi khi filters thay đổi, useEffect sẽ chạy

  const clearFilters = () => {
    setFilters({ salary: "", type: "", method: "" });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[#00c853]">
          <FaFilter size={16} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Bộ lọc
          </h2>
        </div>
        <button
          onClick={clearFilters}
          className="text-[11px] text-gray-400 hover:text-red-500 transition-colors underline cursor-pointer"
        >
          Xóa lọc
        </button>
      </div>

      {/* 4. Render các nhóm lọc từ cấu hình */}
      {FILTER_CONFIG.map((group) => (
        <FilterGroup
          key={group.id}
          name={group.id}
          title={group.title}
          options={group.options}
          selectedValue={filters[group.id]}
          onChange={(val) => handleFilterChange(group.id, val)}
        />
      ))}

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30">
        <p className="text-[11px] text-green-700 dark:text-green-400">
          💡 <b>Mẹo:</b> Lọc theo đúng chuyên môn để tìm việc nhanh hơn.
        </p>
      </div>
    </aside>
  );
};

export default JobFilter;
