"use client";
import React, { useState } from "react";
import { MdOutlineFilterList, MdOutlineLocationOn } from "react-icons/md";

const filterSections = [
  {
    title: "Vai trò công việc",
    options: ["Lập trình Frontend", "Lập trình Backend", "Kỹ sư Fullstack", "Thiết kế sản phẩm", "Kỹ sư QA", "Marketing"],
  },
  {
    title: "Cấp độ kinh nghiệm",
    options: ["Mới vào nghề (0-1 năm)", "Sơ cấp (1-3 năm)", "Trung cấp (3-5 năm)", "Cao cấp (5-8 năm)", "Chuyên gia (8+ năm)"],
  },
  {
    title: "Hình thức làm việc",
    options: ["Toàn thời gian", "Bán thời gian", "Hợp đồng", "Làm việc từ xa"],
  },
];

const SearchFilters = () => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleFilter = (section, option) => {
    setSelectedFilters((prev) => {
      const key = `${section}-${option}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <MdOutlineFilterList className="w-5 h-5 text-emerald-600" />
          Bộ lọc nâng cao
        </h3>
      </div>

      {/* Filter Sections */}
      <div className="space-y-5">
        {filterSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-slate-600 mb-2.5">
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.options.map((option) => {
                const key = `${section.title}-${option}`;
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedFilters[key]}
                      onChange={() => toggleFilter(section.title, option)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
                    />
                    <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Location */}
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-2.5">Địa điểm</h4>
          <div className="relative">
            <MdOutlineLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Thành phố hoặc khu vực..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-2.5">Mức lương</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tối thiểu"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <span className="text-slate-400 text-xs">—</span>
            <input
              type="text"
              placeholder="Tối đa"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button className="w-full mt-6 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
        Áp dụng bộ lọc
      </button>
    </div>
  );
};

export default SearchFilters;
