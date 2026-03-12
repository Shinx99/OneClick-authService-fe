"use client";
import React, { useState } from "react";
import CompanyFilter from "./CompanyFilter";
import CompanyList from "./CompanyList";

const CompanyContent = ({ initialCompanies = [] }) => {
  const [filters, setFilters] = useState({
    industry: [],
    scale: [],
    location: "Tất cả địa điểm",
  });

  // 2. Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (type, value, isChecked) => {
    setFilters((prev) => {
      if (type === "industry" || type === "scale") {
        const currentList = prev[type] || [];
        const newList = isChecked
          ? [...currentList, value]
          : currentList.filter((item) => item !== value);
        return { ...prev, [type]: newList };
      }

      if (type === "location") {
        return { ...prev, location: value };
      }
      return prev;
    });
  };

  // 3. Logic lọc dữ liệu
  const filteredCompanies = initialCompanies.filter((company) => {
    const matchIndustry =
      filters.industry.length === 0 ||
      filters.industry.includes(company.industry);

    const matchLocation =
      filters.location === "Tất cả địa điểm" ||
      company.location === filters.location;

    const matchScale =
      filters.scale.length === 0 || filters.scale.includes(company.size);

    return matchIndustry && matchLocation && matchScale;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">
            Danh sách công ty nổi bật
          </h1>
          <p className="text-gray-500 text-sm font-medium italic">
            Tìm thấy{" "}
            <span className="text-[#00c853] font-bold">
              {filteredCompanies.length}
            </span>{" "}
            kết quả phù hợp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cột trái: Bộ lọc */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <CompanyFilter
              onFilterChange={handleFilterChange}
              selectedIndustries={filters.industry}
              selectedScale={filters.scale}
              currentLocation={filters.location}
              onReset={() =>
                setFilters({
                  industry: [],
                  scale: [],
                  location: "Tất cả địa điểm",
                })
              }
            />
          </div>
        </aside>

        {/* Cột phải: Danh sách công ty */}
        <main className="lg:col-span-3">
          <CompanyList companies={filteredCompanies} />
        </main>
      </div>
    </div>
  );
};

export default CompanyContent;
