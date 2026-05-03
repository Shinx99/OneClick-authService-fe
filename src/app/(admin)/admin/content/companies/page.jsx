"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
} from "react-icons/fa";
import toast from "react-hot-toast";
import CompanyTable from "@/components/features/admin/content/CompanyTable";
import { adminCompanyService } from "@/services/adminCompany.service";

export default function ApproveCompaniesPage() {
  // ============ STATE ============
  const [companies, setCompanies] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Debounce timer cho search
  const [searchTimer, setSearchTimer] = useState(null);

  // ============ FETCH DATA ============
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size, sortBy, sortDir };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (status) params.status = status;

      const res = await adminCompanyService.getCompanies(params);
      const pageData = res.data;

      setCompanies(pageData.content || []);
      setTotalElements(pageData.totalElements || 0);
      setTotalPages(pageData.totalPages || 0);
    } catch (error) {
      console.error("Fetch companies error:", error);
      toast.error("Không thể tải danh sách công ty");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, keyword, status, sortBy, sortDir]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // ============ HANDLERS ============
  const handleSearchChange = (value) => {
    setKeyword(value);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(
      setTimeout(() => {
        setPage(0);
      }, 400)
    );
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleActionComplete = () => {
    fetchCompanies();
  };

  // ============ STATUS OPTIONS ============
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Đang chờ duyệt" },
    { value: "active", label: "Đã duyệt" },
    { value: "rejected", label: "Đã từ chối" },
  ];

  // ============ RENDER ============
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight">
            Phê duyệt Công ty
          </h1>
          <p className="text-sm text-text-muted font-medium mt-1">
            Tổng cộng: {totalElements} công ty
          </p>
        </div>
        <button
          onClick={fetchCompanies}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-card-bg hover:opacity-80 rounded-2xl text-sm font-bold text-text-muted transition-all border border-card-border"
        >
          <FaSync className={loading ? "animate-spin" : ""} size={12} />
          Làm mới
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative group flex-1 max-w-sm">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-[#00c853] transition-colors">
            <FaSearch size={14} />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm theo tên công ty..."
            className="w-full pl-11 pr-4 py-2.5 bg-card-bg border border-card-border focus:border-[#00c853] rounded-2xl text-sm font-medium text-text-main placeholder:text-text-muted outline-none transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="pl-4 pr-9 py-2.5 bg-card-bg border border-card-border focus:border-[#00c853] rounded-2xl text-sm font-bold text-text-muted outline-none appearance-none cursor-pointer transition-all min-w-[180px]"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <FaChevronDown size={10} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-card-bg p-6 sm:p-8 rounded-[2rem] border border-card-border">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center gap-3 text-text-muted font-medium">
              <FaSync className="animate-spin" />
              Đang tải dữ liệu...
            </div>
          </div>
        ) : (
          <CompanyTable
            data={companies}
            onActionComplete={handleActionComplete}
          />
        )}
      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted font-medium">
            Trang {page + 1} / {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className={`p-2 rounded-xl border transition-all ${
                page === 0
                  ? "border-card-border text-text-muted/40 cursor-not-allowed"
                  : "border-card-border text-text-muted hover:text-text-main hover:border-[#00c853]/50"
              }`}
            >
              <FaChevronLeft size={12} />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    pageNum === page
                      ? "bg-[#00c853] text-white shadow-lg shadow-green-500/20"
                      : "text-text-muted hover:text-text-main border border-card-border hover:border-[#00c853]/50"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className={`p-2 rounded-xl border transition-all ${
                page >= totalPages - 1
                  ? "border-card-border text-text-muted/40 cursor-not-allowed"
                  : "border-card-border text-text-muted hover:text-text-main hover:border-[#00c853]/50"
              }`}
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
