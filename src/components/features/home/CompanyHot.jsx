"use client";
import React, { useState, useEffect } from "react";
import { companyService } from "@/services/company.service";
import Link from "next/link"; // 1. Nhập Link để điều hướng trang

const CompanyHot = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyService.getTop6Companies();
        if (response.success) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu công ty hàng đầu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopCompanies();
  }, []);

  return (
    <section className="py-8 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-text-main uppercase tracking-tight">
            Công ty hàng đầu về nhân sự
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center text-text-muted">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companies.map((company) => (
              /* 2. Bao bọc item bằng Link.
Đường dẫn: /companies/ID-CỦA-CÔNG-TY */
              <Link
                href={`/companies/${company.companyId}`}
                key={company.companyId}
                className="group p-6 bg-card-bg rounded-2xl shadow-sm border border-card-border hover:border-green-400/50 hover:shadow-md transition-all duration-300 flex items-center justify-center aspect-square cursor-pointer"
              >
                <div className="text-center opacity-70 group-hover:opacity-100 flex flex-col items-center">
                  {/* Hiển thị Logo */}
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.companyName}
                      className="w-12 h-12 object-contain mb-2 transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full mb-2 flex items-center justify-center text-gray-500 dark:text-slate-300 font-bold group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                      {company.companyName?.charAt(0)}
                    </div>
                  )}

                  <span className="text-xs font-bold text-text-muted group-hover:text-green-500 block uppercase tracking-widest leading-tight text-center">
                    {company.companyName}
                  </span>

                  <p className="text-[9px] text-gray-400 dark:text-slate-400 font-bold mt-1 uppercase">
                    {company.industry || "Lĩnh vực khác"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyHot;
