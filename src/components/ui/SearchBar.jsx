"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaListUl,
  FaChevronDown,
} from "react-icons/fa";
import { FiMapPin, FiDollarSign } from "react-icons/fi";
import { jobService } from "@/services/job.service";
import { companyService } from "@/services/company.service";
import { VIETNAM_PROVINCES } from "@/utils/Provinces";

const SearchBar = ({ className, onSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // States cho filter
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // States quản lý trạng thái mở của Custom Dropdown
  const [showLocation, setShowLocation] = useState(false);
  const [showIndustry, setShowIndustry] = useState(false);

  // Refs để xử lý click ra ngoài
  const dropdownRef = useRef(null);
  const locationRef = useRef(null);
  const industryRef = useRef(null);
  const debounceTimer = useRef(null);

  // 1. Fetch danh mục ngành nghề
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await companyService.getCompanyFilters();
        if (res?.success && res.data?.industries) {
          setIndustries(res.data.industries);
        }
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    fetchIndustries();
  }, []);

  // 2. Fetch gợi ý công việc
  const fetchSuggestions = useCallback(async (keyword) => {
    if (!keyword || keyword.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      // Gọi BE, xin data
      const data = await jobService.getAllJobs({
        keyword: keyword.trim(),
        page: 0,
        size: 10,
      });

      const rawJobs = data?.content || [];
      const searchKey = keyword.trim().toLowerCase();

      // LỌC Ở FE: Chỉ lấy những job mà Title có chứa keyword
      const filteredJobs = rawJobs.filter(
        (job) => job.title && job.title.toLowerCase().includes(searchKey),
      );
      setSuggestions(filteredJobs.slice(0, 3));
      setShowDropdown(true);
    } catch (err) {
      console.error("Search suggestions error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(value), 400);
  };

  const handleSearchClick = () => {
    setShowDropdown(false);
    if (onSearch) {
      onSearch({
        keyword: query,
        industry: selectedIndustry,
        location: selectedLocation,
      });
    }
  };

  // Select a suggestion
  const handleSelectSuggestion = (job) => {
    setQuery(job.title);
    setShowDropdown(false);
    router.push(`/jobs/${job.jobId}`);
  };

  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Thỏa thuận";
    const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
    if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
    return min != null ? `>${fmt(min)}` : `<${fmt(max)}`;
  };

  // 3. Xử lý click ra ngoài để đóng TẤT CẢ các dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
      if (locationRef.current && !locationRef.current.contains(e.target))
        setShowLocation(false);
      if (industryRef.current && !industryRef.current.contains(e.target))
        setShowIndustry(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-card-bg rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl shadow-black/15 dark:shadow-black/20 mx-auto border-0 transition-all w-full max-w-6xl">
        {/* ================= 1. DANH MỤC NGHỀ (CUSTOM DROPDOWN) ================= */}
        <div
          ref={industryRef}
          onClick={() => setShowIndustry(!showIndustry)}
          className="relative hidden md:flex items-center px-5 py-2 border-r border-gray-200 dark:border-card-border hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-l-full transition-colors cursor-pointer w-48 shrink-0"
        >
          <div className="p-2 rounded-full mr-2 text-[#00c853] bg-green-50 dark:bg-green-500/10">
            <FaListUl size={12} />
          </div>
          <span className="text-[#00c853] font-bold text-sm truncate flex-1 select-none">
            {selectedIndustry || "Tất cả ngành"}
          </span>
          <FaChevronDown
            size={10}
            className={`text-[#00c853] ml-2 transition-transform duration-200 ${showIndustry ? "rotate-180" : ""}`}
          />

          {/* Menu xổ xuống */}
          {showIndustry && (
            <div className="absolute top-[calc(100%+12px)] left-0 w-64 bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-card-border z-50 max-h-64 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndustry("");
                  setShowIndustry(false);
                }}
                className={`px-5 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${!selectedIndustry ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
              >
                Tất cả ngành
              </div>
              {industries.map((ind, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndustry(ind);
                    setShowIndustry(false);
                  }}
                  className={`px-5 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors truncate ${selectedIndustry === ind ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {ind}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= 2. Ô NHẬP TÊN CÔNG VIỆC ================= */}
        <div
          ref={dropdownRef}
          className="flex-[1.5] flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-card-border py-4 md:py-0 relative"
        >
          <FaSearch className="text-gray-400 dark:text-text-muted mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Vị trí tuyển dụng, tên công ty..."
            className="outline-none bg-transparent text-gray-800 dark:text-text-main w-full text-sm placeholder:text-gray-400 font-medium"
          />

          {/* DROPDOWN GỢI Ý CÔNG VIỆC */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-[calc(100%+16px)] bg-white dark:bg-card-bg rounded-2xl border border-gray-100 dark:border-card-border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-[420px] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 border-2 border-card-border border-t-[#00c853] rounded-full animate-spin"></div>
                </div>
              )}
              {!loading &&
                suggestions.length === 0 &&
                query.trim().length >= 2 && (
                  <div className="py-6 text-center text-sm text-text-muted">
                    Không tìm thấy kết quả cho &quot;{query}&quot;
                  </div>
                )}
              {!loading && suggestions.length > 0 && (
                <>
                  <div className="px-5 pt-4 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Gợi ý việc làm
                    </span>
                  </div>
                  {suggestions.map((job) => (
                    <button
                      key={job.jobId}
                      onClick={() => handleSelectSuggestion(job)}
                      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#00c853]/5 transition-colors text-left group/item border-b border-gray-50 dark:border-card-border/50 last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden relative">
                        {job.companyLogoUrl ? (
                          <Image
                            src={job.companyLogoUrl}
                            alt=""
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-[#00c853] font-bold text-sm uppercase">
                            {job.title?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 dark:text-text-main group-hover/item:text-[#00c853] truncate">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                          <span className="truncate">
                            {job.companyName || "OneClick"}
                          </span>
                          {job.province && (
                            <span className="flex items-center gap-1 shrink-0">
                              <FiMapPin size={10} />
                              {job.province}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-[12px] font-medium text-[#00c853] shrink-0">
                        <FiDollarSign size={12} />
                        <span>
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* ================= 3. Ô CHỌN ĐỊA ĐIỂM (CUSTOM DROPDOWN) ================= */}
        <div
          ref={locationRef}
          onClick={() => setShowLocation(!showLocation)}
          className="flex-1 flex items-center px-6 w-full py-4 md:py-0 relative group cursor-pointer"
        >
          <FaMapMarkerAlt
            className={`mr-3 shrink-0 transition-colors ${selectedLocation ? "text-[#00c853]" : "text-gray-400 group-hover:text-[#00c853]"}`}
          />
          <span
            className={`text-sm font-medium flex-1 select-none truncate ${selectedLocation ? "text-gray-800 dark:text-text-main" : "text-gray-400"}`}
          >
            {selectedLocation || "Địa điểm"}
          </span>
          <FaChevronDown
            className={`ml-2 size-3 transition-transform duration-200 ${selectedLocation ? "text-[#00c853]" : "text-gray-400 group-hover:text-[#00c853]"} ${showLocation ? "rotate-180" : ""}`}
          />

          {/* Menu xổ xuống */}
          {showLocation && (
            <div className="absolute top-[calc(100%+16px)] right-0 w-64 bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-card-border z-50 max-h-64 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLocation("");
                  setShowLocation(false);
                }}
                className={`px-5 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${!selectedLocation ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
              >
                Tất cả địa điểm
              </div>
              {VIETNAM_PROVINCES.map((prov, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(prov);
                    setShowLocation(false);
                  }}
                  className={`px-5 py-3 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${selectedLocation === prov ? "text-[#00c853] font-bold bg-green-50/50 dark:bg-slate-800" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {prov}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nút Tìm kiếm */}
        <button
          onClick={handleSearchClick}
          className="bg-[#00c853] hover:bg-[#00a846] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-green-500/30 w-full md:w-auto cursor-pointer active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          <FaSearch size={14} />
          <span>Tìm kiếm</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
