import React from "react";
import CompanyContent from "@/components/features/companies/CompanyContent";
import { companyService } from "@/services/company.service";

// Đảm bảo trang luôn lấy dữ liệu mới từ Server
export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  // Dữ liệu mặc định để tránh lỗi trắng trang
  let initialData = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
  };

  try {
    const response = await companyService.getAllCompanies({
      page: 0,
      size: 9,
    });

    if (response && response.success) {
      initialData = response.data;
    }
  } catch (error) {
    console.error("Server Fetch Error:", error.message);
  }

  return (
    <div className="min-h-screen bg-background pt-10 pb-20 transition-colors duration-300">
      <CompanyContent initialData={initialData} />
    </div>
  );
}
