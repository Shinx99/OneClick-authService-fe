"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import CompanyFilter from "./CompanyFilter";
import { companyService } from "@/services/company.service";

// --- Hàm dịch mã bưu chính thành tên tỉnh thành ---
const formatLocationDisplay = (code) => {
  if (!code) return "Toàn quốc";
  switch (String(code).trim()) {
    case "100000":
      return "Hà Nội";
    case "700000":
      return "TP. Hồ Chí Minh";
    case "500000":
      return "Đà Nẵng";
    case "750000":
      return "Bình Dương";
    case "760000":
      return "Đồng Nai";
    case "180000":
      return "Hải Phòng";
    case "940000":
      return "Cần Thơ";
    case "570000":
      return "Khánh Hòa";
    // Thêm các mã khác nếu DB có thêm
    default:
      return code;
  }
};

// --- Component phụ 1: Card công ty ---
const CompanyCard = ({ company = {} }) => {
  // Hàm xử lý ảnh an toàn
  const getImageUrl = (url) => {
    if (!url) return "/images/company-placeholder.png";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/${url}`;
  };

  return (
    <Link
      href={`/companies/${company.companyId || ""}`}
      className="block group"
    >
      <div className="bg-card-bg p-6 rounded-3xl border border-card-border hover:border-[#00c853] transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-xl relative overflow-hidden h-full">
        {/* Logo */}
        <div className="relative w-24 h-24 mb-5 bg-background rounded-2xl p-4 transition-transform group-hover:scale-110">
          <Image
            src={getImageUrl(company.logoUrl)}
            alt={company.companyName || "Company"}
            fill
            className="object-contain p-2"
          />
        </div>

        <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-[#00c853] line-clamp-1">
          {company.companyName || "Tên công ty"}
        </h3>

        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-[11px] font-bold px-4 py-1 rounded-full mb-4">
          {company.industry || "Đa ngành"}
        </span>

        {/* --- ĐÃ GẮN HÀM DỊCH ĐỊA ĐIỂM VÀO ĐÂY --- */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 font-medium">
          <FaMapMarkerAlt size={12} className="group-hover:text-[#00c853]" />
          <span>{formatLocationDisplay(company.provinceCode)}</span>
        </div>

        <div className="w-full mt-auto py-3 border border-[#00c853] text-[#00c853] font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#00c853] group-hover:text-white transition-all">
          Xem chi tiết
          <FaArrowRight
            size={12}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
};

// --- Component phụ 2: Danh sách và Phân trang ---
const CompanyList = ({
  companies = [],
  totalPages,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="space-y-8">
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.companyId} company={company} />
          ))}
        </div>
      ) : (
        <div className="bg-card-bg p-12 rounded-[2rem] text-center border border-dashed border-card-border">
          <p className="text-gray-400 italic">Không tìm thấy công ty nào.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`w-10 h-10 rounded-xl font-black transition-all active:scale-90
                ${
                  currentPage === i
                    ? "bg-[#00c853] text-white shadow-lg"
                    : "bg-card-bg text-text-muted hover:text-[#00c853] border border-card-border"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Component chính ---
const CompanyContent = ({ initialData }) => {
  const [filters, setFilters] = useState({
    industry: "",
    location: "",
    keyword: "",
  });

  const [data, setData] = useState({
    content: initialData?.content || [],
    totalPages: initialData?.totalPages || 0,
    totalElements: initialData?.totalElements || 0,
    currentPage: initialData?.pageNumber || 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchCompanies = async (page = 0) => {
    try {
      setLoading(true);
      const res = await companyService.getAllCompanies({
        industry: filters.industry,
        provinceCode:
          filters.location === "Tất cả địa điểm" ? "" : filters.location,
        keyword: filters.keyword,
        page: page,
        size: 9,
      });

      if (res.success) {
        setData({
          content: res.data.content,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          currentPage: res.data.pageNumber,
        });
      }
    } catch (error) {
      console.error("Lỗi tải danh sách công ty:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ gọi API khi thực sự có thay đổi filter sau lần mount đầu
    fetchCompanies(0);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-text-main mb-2 uppercase tracking-tight">
          Danh sách công ty
        </h1>
        <p className="text-text-muted text-sm font-medium italic">
          Tìm thấy{" "}
          <span className="text-[#00c853] font-bold">{data.totalElements}</span>{" "}
          kết quả phù hợp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <CompanyFilter
              onFilterChange={(type, val) =>
                setFilters((p) => ({ ...p, [type]: val }))
              }
              onReset={() =>
                setFilters({ industry: "", location: "", keyword: "" })
              }
            />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-20 text-gray-400 font-medium">
              Đang tìm kiếm công ty...
            </div>
          ) : (
            <CompanyList
              companies={data.content}
              totalPages={data.totalPages}
              currentPage={data.currentPage}
              onPageChange={(p) => fetchCompanies(p)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CompanyContent;
