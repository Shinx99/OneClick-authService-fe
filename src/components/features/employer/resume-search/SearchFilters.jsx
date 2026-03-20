"use client";
import React, { useState } from "react";
import { MdOutlineFilterList, MdOutlineLocationOn } from "react-icons/md";

const filterSections = [
  {
    title: "Job Role",
    options: ["Frontend Developer", "Backend Developer", "Fullstack Engineer", "Product Designer", "QA Engineer", "Marketing"],
  },
  {
    title: "Experience Level",
    options: ["Entry Level (0-1 yr)", "Junior (1-3 yrs)", "Mid-Level (3-5 yrs)", "Senior (5-8 yrs)", "Lead/Expert (8+ yrs)"],
  },
  {
    title: "Employment Type",
    options: ["Full-time", "Part-time", "Contract", "Remote"],
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
          Advanced Filters
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
          <h4 className="text-sm font-semibold text-slate-600 mb-2.5">Location</h4>
          <div className="relative">
            <MdOutlineLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="City or region..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-2.5">Salary Range</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Min"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <span className="text-slate-400 text-xs">—</span>
            <input
              type="text"
              placeholder="Max"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button className="w-full mt-6 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
        Apply Filters
      </button>
    </div>
  );
};

export default SearchFilters;
