"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";

const PricingPlan = () => {
  const [pricingTab, setPricingTab] = useState("monthly");

  const basicFeatures = [
    "Đăng 3 tin tuyển dụng",
    "Quản lý 50 CV ứng viên",
    "Bộ lọc CV cơ bản",
    "Hỗ trợ email",
  ];

  const standardFeatures = [
    "Đăng 15 tin tuyển dụng / tháng",
    "Quản lý không giới hạn CV",
    "AI phân tích và sàng lọc CV",
    "Phòng thi trực tuyến (5 bài / tháng)",
    "Báo cáo phân tích thị trường",
    "Hỗ trợ ưu tiên 24/7",
  ];

  const enterpriseFeatures = [
    "Tất cả tính năng Tiêu chuẩn",
    "API tích hợp hệ thống",
    "Tin tuyển dụng không giới hạn",
    "Phòng thi không giới hạn",
    "Account Manager riêng",
    "SLA đảm bảo",
  ];

  return (
    <section className="bg-[#f8fafc] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-[#e8f5e9] text-[#00c853] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Bảng giá dịch vụ
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4">
            Giải pháp tuyển dụng cho mọi quy mô doanh nghiệp
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Tính giá linh hoạt phù hợp cho doanh nghiệp vừa và nhỏ đến các tập đoàn lớn.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
            <button
              onClick={() => setPricingTab("monthly")}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                pricingTab === "monthly"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => setPricingTab("yearly")}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                pricingTab === "yearly"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Theo năm
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Cơ bản */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <p className="text-sm text-gray-500 font-medium mb-2">Cơ bản</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mb-1">
              Miễn phí
            </h3>
            <p className="text-sm text-gray-400 mb-8">&nbsp;</p>

            <ul className="space-y-3 mb-8 min-h-[180px]">
              {basicFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button variant="social" className="border-[#00c853] text-[#00c853] hover:text-[#00c853] hover:border-[#00b04a]">Bắt đầu miễn phí</Button>
          </div>

          {/* Tiêu chuẩn (Highlighted) */}
          <div className="bg-white rounded-2xl border-2 border-[#00c853] p-8 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-[#00c853] text-white text-xs font-bold rounded-full">
                Phổ biến nhất
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-2">Tiêu chuẩn</p>
            <div className="flex items-baseline gap-1 mb-1">
              <h3 className="text-3xl font-extrabold text-[#00c853]">
                {pricingTab === "monthly" ? "2.490.000đ" : "24.900.000đ"}
              </h3>
              <span className="text-sm text-gray-400 font-medium">
                /{pricingTab === "monthly" ? "tháng" : "năm"}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-8">&nbsp;</p>

            <ul className="space-y-3 mb-8 min-h-[180px]">
              {standardFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button variant="primary">Mua ngay</Button>
          </div>

          {/* Doanh nghiệp */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <p className="text-sm text-gray-500 font-medium mb-2">Doanh nghiệp</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mb-1">
              Tùy chỉnh
            </h3>
            <p className="text-sm text-gray-400 mb-8">&nbsp;</p>

            <ul className="space-y-3 mb-8 min-h-[180px]">
              {enterpriseFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button variant="primary">Liên hệ</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;
