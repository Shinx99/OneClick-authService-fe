"use client";
import React, { useState, useEffect } from "react";
import { companyService } from "@/services/company.service";

const CompanyHot = () => {
  const [companies, setCompanies] = useState([]);
  // 2. Khai báo state 'isLoading' để hiển thị trạng thái đang tải
  const [isLoading, setIsLoading] = useState(true);

  // 3. Sử dụng useEffect để thực thi việc gọi API khi component mount
  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        setIsLoading(true); // Bắt đầu tải
        const response = await companyService.getTop6Companies();

        // Kiểm tra nếu API trả về thành công (success: true)
        if (response.success) {
          setCompanies(response.data); // Gán dữ liệu (List<TopCompanyResponseDto>) vào state
          console.log("Dữ liệu công ty hàng đầu thành công"); // Kiểm tra dữ liệu nhận được từ API
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu công ty hàng đầu:", error);
      } finally {
        setIsLoading(false); // Kết thúc tải dù thành công hay thất bại
      }
    };

    fetchTopCompanies();
  }, []); // Mảng rỗng [] đảm bảo hàm này chỉ chạy 1 lần duy nhất

  return (
    <section className=" bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text-main uppercase tracking-tight">
            TOP CÔNG TY ĐƯỢC XÁC THỰC MỚI NHẤT
          </h2>
          <div className="w-16 h-1 bg-[#00c853] mx-auto mt-3 rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="text-center text-text-muted">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companies.map((company) => (
              <div
                key={company.companyId}
                className="group p-6 bg-card-bg rounded-2xl shadow-sm border border-card-border hover:border-green-400/50 hover:shadow-md transition-all duration-300 flex items-center justify-center aspect-square"
              >
                <div className="text-center opacity-70 group-hover:opacity-100 flex flex-col items-center">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.companyName}
                      className="w-12 h-12 object-contain mb-2"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500 font-bold">
                      {company.companyName?.charAt(0)}
                    </div>
                  )}

                  <span className="text-xs font-bold text-text-muted group-hover:text-green-500 block uppercase tracking-widest leading-tight text-center">
                    {company.companyName}
                  </span>

                  <p className="text-[9px] text-gray-400 dark:text-slate-600 font-bold mt-1 uppercase">
                    {company.industry || "Lĩnh vực khác"}{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyHot;
