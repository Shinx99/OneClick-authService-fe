"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaFilter,
  FaBriefcase,
  FaUsers,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown,
  FaTimes,
  FaRocket,
  FaUndo,
} from "react-icons/fa";
import { companyService } from "@/services/company.service";
import FormatLocationDisplay from "@/utils/FormatLocation";
import { VIETNAM_PROVINCES } from "@/utils/Provinces";

const CompanyFilter = ({
  onFilterChange,
  onReset,
  currentKeyword = "",
  currentIndustry = "",
  currentScale = "",
  currentLocation = "",
}) => {
  const router = useRouter();

  const [industryOptions, setIndustryOptions] = useState([]);
  const [scaleOptions, setScaleOptions] = useState([]);

  const [selectedKeyword, setSelectedKeyword] = useState(currentKeyword);
  const [selectedIndustry, setSelectedIndustry] = useState(currentIndustry);
  const [selectedScale, setSelectedScale] = useState(currentScale);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showIndustry, setShowIndustry] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const dropdownRef = useRef(null);
  const industryRef = useRef(null);
  const scaleRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    setSelectedKeyword(currentKeyword);
    setSelectedIndustry(currentIndustry);
    setSelectedScale(currentScale);
    setSelectedLocation(currentLocation);
  }, [currentKeyword, currentIndustry, currentScale, currentLocation]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await companyService.getCompanyFilters();
        if (res?.success) {
          if (res.data?.industries?.length)
            setIndustryOptions(res.data.industries);
          if (res.data?.companySizes?.length)
            setScaleOptions(res.data.companySizes);
        }
      } catch (error) {
        console.error("Lỗi khi tải bộ lọc:", error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setShowDropdown(false);
      if (industryRef.current && !industryRef.current.contains(event.target))
        setShowIndustry(false);
      if (scaleRef.current && !scaleRef.current.contains(event.target))
        setShowScale(false);
      if (locationRef.current && !locationRef.current.contains(event.target))
        setShowLocation(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedKeyword || selectedKeyword.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await companyService.getAllCompanies({
          keyword: selectedKeyword,
          page: 0,
          size: 4,
        });
        if (res?.success && res?.data?.content) {
          setSuggestions(res.data.content);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Lỗi khi tải gợi ý:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedKeyword]);

  const handleReset = () => {
    setSelectedKeyword("");
    setSelectedIndustry("");
    setSelectedScale("");
    setSelectedLocation("");
    setShowDropdown(false);
    onReset?.();
  };

  const handleChange = (type, value) => {
    if (type === "industry") setSelectedIndustry(value);
    if (type === "sizeRange") setSelectedScale(value);
    if (type === "location") setSelectedLocation(value);
    onFilterChange?.(type, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      onFilterChange?.("keyword", selectedKeyword);
    }
  };

  const handleSelectSuggestion = (companyId) => {
    setShowDropdown(false);
    router.push(`/companies/${companyId}`);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* --- DÒNG 1: SEARCH BAR CHÍNH --- */}
      <div className="bg-white dark:bg-card-bg rounded-[32px] p-2 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-card-border flex flex-col md:flex-row items-center gap-2">
        {/* Title Badge (Dành cho desktop) */}
        <div className="hidden lg:flex items-center gap-3 pl-4 pr-6 border-r border-gray-100 dark:border-card-border shrink-0">
          <div className="w-10 h-10 bg-[#00c853] text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50">
            <FaRocket size={18} />
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 w-full group" ref={dropdownRef}>
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] transition-colors">
            <FaSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên công ty hoặc tập đoàn..."
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => selectedKeyword && setShowDropdown(true)}
            className="w-full pl-14 pr-6 py-4 bg-transparent rounded-2xl outline-none text-sm font-bold text-gray-700 dark:text-white placeholder:font-medium transition-all"
          />

          {/* Gợi ý Dropdown (Giữ nguyên logic hiển thị) */}
          {showDropdown && selectedKeyword && (
            <div className="absolute top-[120%] left-0 w-full min-w-[320px] bg-white dark:bg-card-bg rounded-[24px] shadow-2xl border border-gray-100 dark:border-card-border z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 dark:border-card-border/50 bg-gray-50/50 dark:bg-transparent">
                Kết quả phù hợp nhất
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {isLoadingSuggestions ? (
                  <div className="p-8 text-center text-sm text-gray-400 italic">
                    Đang truy vấn dữ liệu...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((company) => (
                    <div
                      key={company.companyId}
                      onClick={() => handleSelectSuggestion(company.companyId)}
                      className="flex items-center gap-4 p-4 hover:bg-green-50/80 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl border border-gray-100 dark:border-card-border bg-white p-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <img
                          src={company.logoUrl}
                          alt="logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 truncate">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                          {company.companyName}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] font-medium text-gray-400 truncate">
                            {company.industry || "Đa ngành"}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-[#00c853] font-bold flex items-center gap-1">
                            <FaMapMarkerAlt size={10} />{" "}
                            {FormatLocationDisplay(company.provinceCode)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-gray-400">
                    Không có kết quả khả thi
                  </div>
                )}
              </div>
              <div
                onClick={() => {
                  setShowDropdown(false);
                  onFilterChange?.("keyword", selectedKeyword);
                }}
                className="p-4 text-center text-xs font-black text-[#00c853] hover:bg-green-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-t border-gray-50 dark:border-card-border/50 uppercase"
              >
                Nhấn Enter để tìm kiếm tất cả
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onFilterChange?.("keyword", selectedKeyword)}
          className="w-full md:w-auto px-10 py-4 bg-[#00c853] hover:bg-[#00a846] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95"
        >
          Tìm kiếm
        </button>
      </div>

      {/* --- DÒNG 2: BỘ LỌC CHI TIẾT --- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Nút lọc Title Icon */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-500 dark:text-gray-400 mr-2">
          <FaFilter size={12} />
          <span className="text-[11px] font-black uppercase tracking-tighter">
            Lọc theo
          </span>
        </div>

        {/* Lĩnh vực Dropdown */}
        <div className="relative" ref={industryRef}>
          <button
            onClick={() => {
              setShowIndustry(!showIndustry);
              setShowScale(false);
              setShowLocation(false);
            }}
            className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-black transition-all border-2
              ${
                selectedIndustry
                  ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-200"
                  : "bg-white dark:bg-card-bg text-gray-600 dark:text-gray-300 border-gray-100 dark:border-card-border hover:border-[#00c853]"
              }`}
          >
            <FaBriefcase
              size={14}
              className={selectedIndustry ? "text-white" : "text-[#00c853]"}
            />
            <span className="max-w-[120px] truncate">
              {selectedIndustry || "Lĩnh vực kinh doanh"}
            </span>
            <FaChevronDown
              size={10}
              className={`transition-transform duration-300 ${showIndustry ? "rotate-180" : ""}`}
            />
          </button>
          {showIndustry && (
            <div className="absolute top-[120%] left-0 w-64 bg-white dark:bg-card-bg rounded-2xl shadow-2xl border border-gray-100 dark:border-card-border z-[90] py-2 max-h-[300px] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div
                onClick={() => {
                  handleChange("industry", "");
                  setShowIndustry(false);
                }}
                className="px-5 py-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tất cả lĩnh vực
              </div>
              {industryOptions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleChange("industry", item);
                    setShowIndustry(false);
                  }}
                  className={`px-5 py-3 text-xs cursor-pointer hover:bg-green-50 dark:hover:bg-slate-800 ${selectedIndustry === item ? "text-[#00c853] font-black bg-green-50/50" : "font-medium text-gray-600 dark:text-gray-400"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quy mô Dropdown */}
        <div className="relative" ref={scaleRef}>
          <button
            onClick={() => {
              setShowScale(!showScale);
              setShowIndustry(false);
              setShowLocation(false);
            }}
            className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-black transition-all border-2
              ${
                selectedScale
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200"
                  : "bg-white dark:bg-card-bg text-gray-600 dark:text-gray-300 border-gray-100 dark:border-card-border hover:border-blue-500"
              }`}
          >
            <FaUsers
              size={14}
              className={selectedScale ? "text-white" : "text-blue-500"}
            />
            <span className="max-w-[120px] truncate">
              {selectedScale || "Quy mô nhân sự"}
            </span>
            <FaChevronDown
              size={10}
              className={`transition-transform duration-300 ${showScale ? "rotate-180" : ""}`}
            />
          </button>
          {showScale && (
            <div className="absolute top-[120%] left-0 w-56 bg-white dark:bg-card-bg rounded-2xl shadow-2xl border border-gray-100 dark:border-card-border z-[90] py-2 animate-in zoom-in-95 duration-200">
              <div
                onClick={() => {
                  handleChange("sizeRange", "");
                  setShowScale(false);
                }}
                className="px-5 py-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tất cả quy mô
              </div>
              {scaleOptions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleChange("sizeRange", item);
                    setShowScale(false);
                  }}
                  className={`px-5 py-3 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 ${selectedScale === item ? "text-blue-500 font-black bg-blue-50/50" : "font-medium text-gray-600 dark:text-gray-400"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Địa điểm Dropdown */}
        <div className="relative" ref={locationRef}>
          <button
            onClick={() => {
              setShowLocation(!showLocation);
              setShowIndustry(false);
              setShowScale(false);
            }}
            className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-black transition-all border-2
              ${
                selectedLocation
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                  : "bg-white dark:bg-card-bg text-gray-600 dark:text-gray-300 border-gray-100 dark:border-card-border hover:border-orange-500"
              }`}
          >
            <FaMapMarkerAlt
              size={14}
              className={selectedLocation ? "text-white" : "text-orange-500"}
            />
            <span className="max-w-[120px] truncate">
              {selectedLocation || "Khu vực hoạt động"}
            </span>
            <FaChevronDown
              size={10}
              className={`transition-transform duration-300 ${showLocation ? "rotate-180" : ""}`}
            />
          </button>
          {showLocation && (
            <div className="absolute top-[120%] left-0 w-64 bg-white dark:bg-card-bg rounded-2xl shadow-2xl border border-gray-100 dark:border-card-border z-[90] py-2 max-h-[300px] overflow-y-auto animate-in zoom-in-95 duration-200 custom-scrollbar">
              <div
                onClick={() => {
                  handleChange("location", "");
                  setShowLocation(false);
                }}
                className="px-5 py-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Toàn quốc
              </div>
              {VIETNAM_PROVINCES.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleChange("location", item);
                    setShowLocation(false);
                  }}
                  className={`px-5 py-3 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-800 ${selectedLocation === item ? "text-orange-500 font-black bg-orange-50/50" : "font-medium text-gray-600 dark:text-gray-400"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Reset Button - Kết hợp Expanding (1) và Badge đếm số lượng (3) */}
        {(selectedKeyword ||
          selectedIndustry ||
          selectedScale ||
          selectedLocation) && (
          <button
            onClick={handleReset}
            className="group relative flex items-center gap-0 hover:gap-3 px-3.5 py-3.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-500 ease-in-out rounded-2xl border border-red-100 hover:border-red-500 overflow-hidden shadow-sm hover:shadow-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:hover:bg-red-500"
          >
            {/* Badge số lượng - Sẽ biến mất khi hover để nhường chỗ cho icon xoay */}
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white border border-white dark:border-card-bg group-hover:scale-0 transition-transform duration-300">
              {
                [
                  selectedKeyword,
                  selectedIndustry,
                  selectedScale,
                  selectedLocation,
                ].filter(Boolean).length
              }
            </span>

            {/* Icon Undo - Xoay khi hover */}
            <FaUndo
              size={14}
              className="shrink-0 group-hover:rotate-[-360deg] transition-transform duration-700 ease-in-out"
            />

            {/* Text mở rộng */}
            <span className="max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-[11px] font-black uppercase whitespace-nowrap overflow-hidden tracking-tighter">
              Làm mới bộ lọc
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyFilter;
