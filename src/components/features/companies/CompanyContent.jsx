"use client";
import React, { useState, useEffect } from "react";
import CompanyFilter from "./CompanyFilter";
import CompanyList from "./CompanyList";
import { companyService } from "@/services/company.service";

const CompanyContent = ({ initialData }) => {
  const [filters, setFilters] = useState({
    industry: "",
    location: "",
    keyword: "",
    sizeRange: "",
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
        sizeRange: filters.sizeRange,
        page: page,
        size: 12, // Tăng size lên 12 để khớp với hàng 4 công ty (4x3)
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
    fetchCompanies(0);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      {/* Tiêu đề */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">
            Danh sách công ty
          </h1>
        </div>
      </div>

      {/* Bộ lọc hàng ngang */}
      <div className="mb-10 bg-card-bg p-6 rounded-[2rem] border border-card-border shadow-sm">
        <CompanyFilter
          onFilterChange={(type, val) =>
            setFilters((p) => ({ ...p, [type]: val }))
          }
          onReset={() =>
            setFilters({ industry: "", location: "", keyword: "" })
          }
        />
        <p className="text-text-muted text-sm font-medium italic mt-1">
          Tìm thấy{" "}
          <span className="text-[#00c853] font-bold">{data.totalElements}</span>{" "}
          kết quả phù hợp
        </p>
      </div>

      {/* Danh sách công ty hiển thị Full Width */}
      <main>
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium animate-pulse">
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
  );
};

export default CompanyContent;
