"use client";
import React, { useState } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";

const FILTER_CONFIG = [
  {
    id: "salary",
    title: "Mức lương",
    options: [
      { label: "Dưới 10M", value: "U10" },
      { label: "10M - 20M", value: "10_20" },
      { label: "Trên 20M", value: "A20" },
    ],
  },
  {
    id: "method",
    title: "Phương thức",
    options: [
      { label: "Tại văn phòng", value: "OFFICE" },
      { label: "Từ xa (Remote)", value: "REMOTE" },
      { label: "Linh hoạt (Hybrid)", value: "HYBRID" },
    ],
  },
  {
    id: "exp",
    title: "Kinh nghiệm",
    options: [
      { label: "Intern/Fresher", value: "NEW" },
      { label: "1 - 3 năm", value: "MID" },
      { label: "Trên 5 năm", value: "SENIOR" },
    ],
  },
  {
    id: "industry",
    title: "Lĩnh vực",
    options: [
      { label: "Công nghệ (IT)", value: "IT" },
      { label: "Marketing", value: "MKT" },
      { label: "Thiết kế (Design)", value: "DSGN" },
    ],
  },
];

const JobFilter = () => {
  const [filters, setFilters] = useState({});

  const handleToggle = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === val ? "" : val }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-card-border/80">
        <div className="flex items-center gap-2 text-text-main">
          <FaFilter size={14} className="text-[#00c853]" />
          <span className="text-sm font-bold uppercase tracking-widest">
            Bộ lọc nâng cao
          </span>
        </div>
      </div>

      {FILTER_CONFIG.map((group) => (
        <div key={group.id} className="space-y-4">
          <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-70">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.options.map((opt) => {
              const active = filters[group.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleToggle(group.id, opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] transition-all border ${
                    active
                      ? "bg-[#00c853] border-[#00c853] text-white shadow-md"
                      : "bg-background border-card-border/80 text-text-muted hover:border-[#00c853] hover:text-text-main"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobFilter;
