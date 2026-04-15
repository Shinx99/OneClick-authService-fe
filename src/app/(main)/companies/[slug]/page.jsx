import React from "react";
import CompanyBanner from "@/components/features/companies/detail/CompanyBanner";
import CompanyOverview from "@/components/features/companies/detail/CompanyOverview";
import CompanyContact from "@/components/features/companies/detail/CompanyContact";
import CompanyJobs from "@/components/features/companies/detail/CompanyJobs";
import { notFound } from "next/navigation";
import { companyService } from "@/services/company.service"; // Nhập service đã viết

export default async function CompanyDetailPage({ params }) {
  // 1. Lấy slug (thực chất là companyId) từ URL
  const { slug } = await params;

  // 2. FETCH API THẬT TỪ BACKEND
  let companyData = null;
  try {
    const response = await companyService.getCompanyById(slug);
    if (response.success) {
      companyData = response.data; // Dữ liệu từ Backend (Entity Company)
    }
  } catch (error) {
    console.error("Lỗi khi fetch chi tiết công ty:", error);
  }

  // 3. Nếu không thấy dữ liệu, hiển thị trang 404
  if (!companyData) {
    notFound();
  }

  // 4. Ánh xạ (Map) dữ liệu từ Backend sang cấu trúc Props của UI cũ
  // Backend dùng: companyName, backgroundUrl, logoUrl...
  // UI cũ dùng: name, cover, logo...
  const mappedData = {
    ...companyData,
    name: companyData.companyName,
    cover: companyData.backgroundUrl, // Ảnh bìa
    logo: companyData.logoUrl,
    size: companyData.sizeRange, // Quy mô nhân sự
    description: companyData.overview, // Giới thiệu
    // Các phần reviews và jobs hiện tại BE chưa trả về nên ta để mảng rỗng
    reviews: companyData.reviews || [],
    jobs: companyData.jobs || [],
    rating: companyData.rating || "5.0",
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Truyền dữ liệu đã ánh xạ xuống các component con */}
        <CompanyBanner company={mappedData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          <div className="lg:col-span-2 space-y-8">
            <CompanyOverview description={mappedData.description} />
            <CompanyJobs companyId={mappedData.companyId} />{" "}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className=" top-24 space-y-8">
              <CompanyContact contact={mappedData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
