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

// Hàm bổ trợ chuyển đổi Tiếng Việt có dấu thành không dấu
const removeAccents = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const SearchBar = ({ className, onSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  const fetchSuggestions = useCallback(async (keyword) => {
    if (!keyword || keyword.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const data = await jobService.getAllJobs({
        keyword: keyword.trim(),
        page: 0,
        size: 20, // Tăng size lên một chút để lọc FE chính xác hơn
      });

      const rawJobs = data?.content || [];
      const searchKeyClean = removeAccents(keyword.trim());

      // LỌC THÔNG MINH: So sánh cả có dấu và không dấu
      const filteredJobs = rawJobs.filter((job) => {
        if (!job.title) return false;
        const titleClean = removeAccents(job.title);
        return titleClean.includes(searchKeyClean);
      });

      setSuggestions(filteredJobs.slice(0, 6)); // Tăng lên 5 gợi ý nhìn cho đẹp dropdown
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

  // Hàm xử lý khi nhấn Enter trong ô Input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    setShowDropdown(false);
    if (onSearch) {
      onSearch(query.trim());
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-card-bg rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl shadow-black/15 dark:shadow-black/20 mx-auto border-0 transition-all w-full max-w-6xl">

        {/* Ô nhập Keyword */}
        <div
          ref={dropdownRef}
          className="flex-[1.5] flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-card-border py-4 md:py-0 relative"
        >
          <FaSearch className="text-gray-400 dark:text-text-muted mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Vị trí tuyển dụng, tên công ty..."
            className="outline-none bg-transparent text-gray-800 dark:text-text-main w-full text-sm placeholder:text-gray-400 font-medium"
          />

          {showDropdown && (
            <div className="absolute left-0 right-0 top-[calc(100%+16px)] bg-white dark:bg-card-bg rounded-2xl border border-gray-100 dark:border-card-border shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 border-2 border-card-border border-t-[#00c853] rounded-full animate-spin"></div>
                </div>
              ) : suggestions.length > 0 ? (
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
                              <FiMapPin size={10} /> {job.province}
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
              ) : (
                query.trim().length >= 2 && (
                  <div className="py-6 text-center text-sm text-text-muted">
                    Không tìm thấy kết quả cho &quot;{query}&quot;
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Nút Tìm kiếm */}
        <button
          onClick={handleSearchClick}
          className="bg-[#00c853] hover:bg-[#00a846] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-green-500/30 w-full md:w-auto cursor-pointer active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0"
        >
          <FaSearch size={14} />
          <span>Tìm kiếm</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
