"use client";
import React, { useState, useEffect } from "react";
import { companyService } from "@/services/company.service";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VISIBLE_COUNT = 5;

const CompanyHot = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

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

  const total = companies.length;

  const visibleCompanies =
    total > 0
      ? Array.from(
          { length: Math.min(VISIBLE_COUNT, total) },
          (_, i) => companies[(startIndex + i) % total],
        )
      : [];

  const handlePrev = () => setStartIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setStartIndex((prev) => (prev + 1) % total);

  return (
    <section className="py-8 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-text-main uppercase tracking-tight">
            Top 10 công ty hàng đầu về nhân sự
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center text-text-muted">Đang tải dữ liệu...</div>
        ) : (
          //  [Nút Prev]
          <div className="flex items-center gap-4">
            {/* Nút Prev */}
            {total > VISIBLE_COUNT && (
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-card-bg border border-card-border shadow-md hover:bg-green-500 hover:text-white hover:border-green-500 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {visibleCompanies.map((company) => (
                <Link
                  href={`/companies/${company.companyId}`}
                  key={company.companyId}
                  className="group p-6 bg-card-bg rounded-2xl shadow-sm border border-card-border hover:border-green-400/50 hover:shadow-md transition-all duration-300 flex items-center justify-center aspect-square cursor-pointer"
                >
                  <div className="text-center opacity-70 group-hover:opacity-100 flex flex-col items-center">
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

            {/* Nút Next */}
            {total > VISIBLE_COUNT && (
              <button
                onClick={handleNext}
                aria-label="Next"
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-card-bg border border-card-border shadow-md hover:bg-green-500 hover:text-white hover:border-green-500 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyHot;
