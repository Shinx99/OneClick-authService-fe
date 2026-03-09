"use client";
import React, { useState } from "react";
import CompanyFilter from "@/components/features/companies/CompanyFilter";
import CompanyList from "@/components/features/companies/CompanyList";

const CompaniesPage = () => {
  // 1. Dữ liệu mẫu (Đã bổ sung đầy đủ trường size cho tất cả các đối tượng)
  const initialCompanies = [
    {
      id: 1,
      slug: "one-click",
      name: "One-Click Corporation",
      industry: "Công nghệ thông tin",
      location: "Hà Nội",
      size: "51 - 200 nhân viên",
      logo: "/images/one-click-logo.png",
      isTop: true,
    },
    {
      id: 2,
      slug: "ecofinance-group",
      name: "EcoFinance Group",
      industry: "Tài chính - Ngân hàng",
      location: "TP.HCM",
      size: "500+ nhân viên",
      logo: "/images/ecofinance.png",
      isTop: false,
    },
    {
      id: 3,
      slug: "viethealth-care",
      name: "VietHealth Care",
      industry: "Y tế & Dược phẩm",
      location: "Đà Nẵng",
      size: "201 - 500 nhân viên",
      logo: "/images/health.png",
      isTop: false,
    },
    {
      id: 4,
      slug: "greentech-solutions",
      name: "GreenTech Solutions",
      industry: "Công nghệ thông tin",
      location: "Hà Nội",
      size: "201 - 500 nhân viên",
      logo: "/images/greentech.png",
      isTop: true,
    },
  ];

  // 2. Khởi tạo State (Đảm bảo luôn có mảng rỗng cho các tiêu chí checkbox)
  const [filters, setFilters] = useState({
    industry: [],
    scale: [], // Luôn khởi tạo là mảng rỗng để tránh lỗi .length
    location: "Tất cả địa điểm",
  });

  // 3. Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (type, value, isChecked) => {
    setFilters((prev) => {
      // Xử lý các loại lọc dạng mảng (Industry & Scale)
      if (type === "industry" || type === "scale") {
        const currentList = prev[type] || [];
        const newList = isChecked
          ? [...currentList, value]
          : currentList.filter((item) => item !== value);
        return { ...prev, [type]: newList };
      }

      // Xử lý lọc dạng đơn lẻ (Location)
      if (type === "location") {
        return { ...prev, location: value };
      }
      return prev;
    });
  };

  // 4. Logic lọc (Viết trực tiếp để React Compiler tự tối ưu, an toàn hơn useMemo thủ công)
  const filteredCompanies = initialCompanies.filter((company) => {
    // Sử dụng optional chaining (?.) và mặc định [] để tránh lỗi 'length'
    const matchIndustry =
      (filters.industry?.length || 0) === 0 ||
      filters.industry.includes(company.industry);

    const matchLocation =
      filters.location === "Tất cả địa điểm" ||
      company.location === filters.location;

    const matchScale =
      (filters.scale?.length || 0) === 0 ||
      filters.scale.includes(company.size);

    return matchIndustry && matchLocation && matchScale;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pt-10 pb-20 transition-colors">
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
    </div>
  );
};

export default CompaniesPage;
