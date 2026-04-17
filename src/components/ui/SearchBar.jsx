"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaListUl,
  FaChevronDown,
} from "react-icons/fa";
import { FiMapPin, FiDollarSign, FiBriefcase } from "react-icons/fi";
import { jobService } from "@/services/job.service";

const SearchBar = ({ className, onSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Debounced fetch suggestions
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
        size: 6,
      });
      setSuggestions(data?.content || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search suggestions error:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce: wait 400ms after user stops typing
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);
  };

  // Select a suggestion → navigate to job detail page
  const handleSelectSuggestion = (job) => {
    setQuery(job.title);
    setShowDropdown(false);
    router.push(`/jobs/${job.jobId}`);
  };

  // Click "Tìm kiếm" button
  const handleSearchClick = () => {
    setShowDropdown(false);
    if (onSearch) onSearch(query);
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      if (onSearch) onSearch(query);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Thỏa thuận";
    const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
    if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
    return min != null ? `>${fmt(min)}` : `<${fmt(max)}`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="bg-white dark:bg-card-bg rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl shadow-black/15 dark:shadow-black/20 mx-auto border-0 transition-all w-full max-w-6xl">
        {/* 1. Danh mục Nghề */}
        <div className="hidden md:flex items-center px-5 py-2 border-r border-gray-200 dark:border-card-border cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-l-full transition-colors group">
          <div className="p-2 rounded-full mr-3 text-[#00c853] bg-green-50 dark:bg-green-500/10 transition-colors">
            <FaListUl size={14} />
          </div>
          <span className="text-[#00c853] font-bold text-sm whitespace-nowrap">
            Danh mục Nghề
          </span>
        </div>

        {/* 2. Ô nhập tên công việc */}
        <div className="flex-[2] flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-card-border py-4 md:py-0">
          <FaSearch className="text-gray-400 dark:text-text-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Vị trí tuyển dụng, tên công ty..."
            className="outline-none bg-transparent text-gray-800 dark:text-text-main w-full text-sm placeholder:text-gray-400 dark:placeholder:text-text-muted font-medium"
          />
        </div>

        {/* 3. Ô chọn địa điểm */}
        <div className="flex-1 flex items-center px-6 w-full py-4 md:py-0 group cursor-pointer">
          <FaMapMarkerAlt className="text-gray-400 dark:text-text-muted mr-3 shrink-0 group-hover:text-[#00c853] transition-colors" />
          <input
            type="text"
            placeholder="Địa điểm"
            className="outline-none bg-transparent text-gray-800 dark:text-text-main w-full text-sm cursor-pointer placeholder:text-gray-400 dark:placeholder:text-text-muted font-medium"
            readOnly
          />
          <FaChevronDown className="text-gray-400 dark:text-text-muted ml-2 size-3 group-hover:text-[#00c853] transition-colors" />
        </div>

        {/* Nút Tìm kiếm */}
        <button
          onClick={handleSearchClick}
          className="bg-[#00c853] hover:bg-[#00a846] text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-green-500/20 dark:shadow-none w-full md:w-auto cursor-pointer active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          <FaSearch size={14} />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {/* ===== DROPDOWN SUGGESTIONS ===== */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-card-bg rounded-2xl border border-card-border shadow-2xl shadow-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[420px] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-card-border border-t-[#00c853] rounded-full animate-spin"></div>
              <span className="ml-3 text-sm text-text-muted">
                Đang tìm kiếm...
              </span>
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="py-6 text-center text-sm text-text-muted">
              Không tìm thấy kết quả cho &quot;{query}&quot;
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <>
              <div className="px-5 pt-4 pb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Gợi ý việc làm
                </span>
              </div>
              {suggestions.map((job) => (
                <button
                  key={job.jobId}
                  onClick={() => handleSelectSuggestion(job)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#00c853]/5 transition-colors text-left group/item border-b border-card-border/50 last:border-b-0"
                >
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-xl border border-card-border bg-background flex items-center justify-center shrink-0 overflow-hidden relative">
                    {job.companyLogoUrl ? (
                      <Image
                        src={job.companyLogoUrl}
                        alt={job.companyName || ""}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="text-[#00c853] font-bold text-sm uppercase">
                        {job.title?.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-main group-hover/item:text-[#00c853] transition-colors truncate">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-text-muted">
                      <span className="truncate">
                        {job.companyName || "OneClick Partner"}
                      </span>
                      {job.province && (
                        <span className="flex items-center gap-1 shrink-0">
                          <FiMapPin size={10} />
                          {job.province}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="hidden sm:flex items-center gap-1 text-[12px] font-medium text-[#00c853] shrink-0">
                    <FiDollarSign size={12} />
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                </button>
              ))}

              {/* Footer → xem tất cả */}
              <button
                onClick={handleSearchClick}
                className="w-full py-3 text-center text-[12px] font-bold text-[#00c853] hover:bg-[#00c853]/5 transition-colors uppercase tracking-wider border-t border-card-border/50"
              >
                Xem tất cả kết quả cho &quot;{query}&quot;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
