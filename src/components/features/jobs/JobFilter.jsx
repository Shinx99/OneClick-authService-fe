"use client";
import React from "react";
import { FaFilter } from "react-icons/fa";

const LEVEL_OPTIONS = ["Senior", "Middle", "Junior", "Fresher"];
const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Internship", "Contract"];

const JobFilter = ({ filters = {}, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 0 });
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-card-border/80">
        <div className="flex items-center gap-2 text-text-main">
          <FaFilter size={14} className="text-[#00c853]" />
          <span className="text-sm font-bold uppercase tracking-widest">
            Bộ lọc nâng cao
          </span>
        </div>
      </div>

      {/* Province */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-70">
          Tỉnh / Thành phố
        </label>
        <input
          type="text"
          placeholder="VD: Hồ Chí Minh"
          value={filters.province || ""}
          onChange={(e) => handleChange("province", e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-[13px] bg-background border border-card-border/80 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-[#00c853] transition-colors"
        />
      </div>

      {/* Level */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-70">
          Cấp bậc
        </label>
        <div className="flex flex-wrap gap-2">
          {LEVEL_OPTIONS.map((opt) => {
            const active = filters.level === opt;
            return (
              <button
                key={opt}
                onClick={() => handleChange("level", active ? "" : opt)}
                className={`px-3 py-1.5 rounded-lg text-[12px] transition-all border ${
                  active
                    ? "bg-[#00c853] border-[#00c853] text-white shadow-md"
                    : "bg-background border-card-border/80 text-text-muted hover:border-[#00c853] hover:text-text-main"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-70">
          Hình thức
        </label>
        <select
          value={filters.jobType || ""}
          onChange={(e) => handleChange("jobType", e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-[13px] bg-background border border-card-border/80 text-text-main focus:outline-none focus:border-[#00c853] transition-colors"
        >
          <option value="">Tất cả</option>
          {JOB_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Salary Range */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-70">
          Mức lương (USD)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.salaryMin ?? ""}
            onChange={(e) =>
              handleChange(
                "salaryMin",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-1/2 px-3 py-2.5 rounded-xl text-[13px] bg-background border border-card-border/80 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-[#00c853] transition-colors"
          />
          <span className="text-text-muted text-xs">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.salaryMax ?? ""}
            onChange={(e) =>
              handleChange(
                "salaryMax",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-1/2 px-3 py-2.5 rounded-xl text-[13px] bg-background border border-card-border/80 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-[#00c853] transition-colors"
          />
        </div>
      </div>

      {/* Experience Max */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider opacity-70">
          Kinh nghiệm tối đa (năm)
        </label>
        <input
          type="number"
          min={0}
          placeholder="VD: 5"
          value={filters.experienceMax ?? ""}
          onChange={(e) =>
            handleChange(
              "experienceMax",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="w-full px-3 py-2.5 rounded-xl text-[13px] bg-background border border-card-border/80 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-[#00c853] transition-colors"
        />
      </div>

      {/* Reset Filters */}
      <button
        onClick={() =>
          onFilterChange({ page: 0, size: 10, sortBy: "createdAt", sortDir: "desc" })
        }
        className="w-full py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider text-text-muted border border-card-border/80 hover:border-red-400 hover:text-red-400 transition-all"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default JobFilter;
