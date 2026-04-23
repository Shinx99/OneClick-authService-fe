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

  // === STATES QUẢN LÝ ĐÓNG/MỞ CÁC DROPDOWN ===
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showIndustry, setShowIndustry] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Refs để xử lý click ra ngoài
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

  // Fetch bộ lọc
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await companyService.getCompanyFilters();
        if (res?.success) {
          if (res.data?.industries?.length) {
            setIndustryOptions(res.data.industries);
          }
          if (res.data?.companySizes?.length) {
            setScaleOptions(res.data.companySizes);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải bộ lọc:", error);
      }
    };
    fetchFilters();
  }, []);

  // === XỬ LÝ CLICK RA NGOÀI ĐỂ ĐÓNG TẤT CẢ DROPDOWN ===
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

  // === TÌM KIẾM GỢI Ý KHI GÕ ===
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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 items-center">
        {/* CỘT 1: Tiêu đề bộ lọc */}
        <div className="flex items-center gap-4 p-1">
          <div className="w-12 h-12 bg-[#00c853] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <FaFilter size={20} />
          </div>
          <div>
            <h2 className="font-black text-text-main text-[15px] uppercase leading-tight">
              Bộ lọc <br /> công ty
            </h2>
          </div>
        </div>

        {/* CỘT 2: Ô SEARCH CÓ KÈM DROPDOWN */}
        <div className="relative group" ref={dropdownRef}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00c853] z-10">
            <FaSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Nhập tên công ty...."
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => selectedKeyword && setShowDropdown(true)}
            className="w-full pl-11 pr-4 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 dark:text-text-main outline-none focus:border-[#00c853] transition-all hover:bg-gray-50 dark:hover:bg-slate-800/50 placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 relative z-10"
          />

          {showDropdown && selectedKeyword && (
            <div className="absolute top-[110%] left-0 w-full min-w-[340px] bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-card-border z-50 overflow-hidden">
              <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 dark:border-card-border/50">
                Gợi ý công ty
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="p-5 text-center text-sm text-gray-400 italic">
                    Đang tìm kiếm...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((company) => (
                    <div
                      key={company.companyId}
                      onClick={() => handleSelectSuggestion(company.companyId)}
                      className="flex items-center gap-3 p-3 hover:bg-green-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-gray-50 dark:border-card-border/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg border border-gray-100 dark:border-card-border/50 bg-white flex items-center justify-center p-1 flex-shrink-0">
                        <img
                          src={company.logoUrl}
                          alt={company.companyName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-bold text-gray-800 dark:text-text-main truncate">
                          {company.companyName}
                        </h4>
                        <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                          <span className="truncate">
                            {company.industry || "Đa lĩnh vực"}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <span className="truncate flex items-center gap-1">
                            <FaMapMarkerAlt
                              size={11}
                              className="text-gray-400"
                            />
                            {FormatLocationDisplay(company.provinceCode) ||
                              "Cập nhật sau"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-center text-sm text-gray-400">
                    Không tìm thấy công ty nào phù hợp.
                  </div>
                )}
              </div>
              <div
                onClick={() => {
                  setShowDropdown(false);
                  onFilterChange?.("keyword", selectedKeyword);
                }}
                className="p-3 text-center text-sm font-black text-[#00c853] hover:bg-green-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-t border-gray-50 dark:border-card-border/50 uppercase tracking-wide"
              >
                Xem tất cả kết quả cho "{selectedKeyword}"
              </div>
            </div>
          )}
        </div>
        {/* CỘT 3:  Lĩnh vực */}
        <div className="relative group" ref={industryRef}>
          <div
            onClick={() => {
              setShowIndustry(!showIndustry);
              setShowScale(false);
              setShowLocation(false);
            }}
            className="w-full pl-11 pr-10 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 dark:text-text-main cursor-pointer hover:border-[#00c853] hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between"
          >
            <div className="absolute left-4 text-[#00c853]">
              <FaBriefcase size={16} />
            </div>
            <span className="truncate select-none">
              {selectedIndustry || "Tất cả lĩnh vực"}
            </span>
            <FaChevronDown
              className={`absolute right-4 text-gray-400 transition-transform duration-200 ${showIndustry ? "rotate-180 text-[#00c853]" : ""}`}
            />
          </div>

          {showIndustry && (
            <div className="absolute top-[110%] left-0 w-full bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-card-border z-50 py-2 max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
              <div
                onClick={() => {
                  handleChange("industry", "");
                  setShowIndustry(false);
                }}
                className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${!selectedIndustry ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
              >
                Tất cả lĩnh vực
              </div>
              {industryOptions.map((item, idx) => (
                <div
                  key={`ind-${idx}`}
                  onClick={() => {
                    handleChange("industry", item);
                    setShowIndustry(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors truncate ${selectedIndustry === item ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CỘT 4: - Quy mô */}
        <div className="relative group" ref={scaleRef}>
          <div
            onClick={() => {
              setShowScale(!showScale);
              setShowIndustry(false);
              setShowLocation(false);
            }}
            className="w-full pl-11 pr-10 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 dark:text-text-main cursor-pointer hover:border-[#00c853] hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between"
          >
            <div className="absolute left-4 text-[#00c853]">
              <FaUsers size={16} />
            </div>
            <span className="truncate select-none">
              {selectedScale || "Tất cả quy mô"}
            </span>
            <FaChevronDown
              className={`absolute right-4 text-gray-400 transition-transform duration-200 ${showScale ? "rotate-180 text-[#00c853]" : ""}`}
            />
          </div>

          {showScale && (
            <div className="absolute top-[110%] left-0 w-full bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-card-border z-50 py-2 max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
              <div
                onClick={() => {
                  handleChange("sizeRange", "");
                  setShowScale(false);
                }}
                className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${!selectedScale ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
              >
                Tất cả quy mô
              </div>
              {scaleOptions.map((item, idx) => (
                <div
                  key={`scale-${idx}`}
                  onClick={() => {
                    handleChange("sizeRange", item);
                    setShowScale(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors truncate ${selectedScale === item ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CỘT 5:  Địa điểm & Nút Xóa */}
        <div className="flex items-center gap-1">
          <div className="relative flex-1 group" ref={locationRef}>
            <div
              onClick={() => {
                setShowLocation(!showLocation);
                setShowIndustry(false);
                setShowScale(false);
              }}
              className="w-full pl-11 pr-8 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 dark:text-text-main cursor-pointer hover:border-[#00c853] hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between"
            >
              <div className="absolute left-4 text-[#00c853]">
                <FaMapMarkerAlt size={16} />
              </div>
              <span className="truncate select-none max-w-[90px] lg:max-w-[120px]">
                {selectedLocation || "Tất cả địa điểm"}
              </span>
              <FaChevronDown
                className={`absolute right-3 text-gray-400 transition-transform duration-200 ${showLocation ? "rotate-180 text-[#00c853]" : ""}`}
              />
            </div>

            {showLocation && (
              <div className="absolute top-[110%] right-0 w-64 bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-card-border z-50 py-2 max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                <div
                  onClick={() => {
                    handleChange("location", "");
                    setShowLocation(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${!selectedLocation ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Tất cả địa điểm
                </div>
                {VIETNAM_PROVINCES.map((item, idx) => (
                  <div
                    key={`loc-${idx}`}
                    onClick={() => {
                      handleChange("location", item);
                      setShowLocation(false);
                    }}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors truncate ${selectedLocation === item ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="whitespace-nowrap p-1.5 py-3.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl font-bold text-xs uppercase shadow-sm cursor-pointer"
          >
            Xóa hết
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyFilter;
