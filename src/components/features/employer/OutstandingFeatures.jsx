import React from "react";
import Link from "next/link";
import Image from "next/image";

const OutstandingFeatures = () => {
  const features = [
    {
      image: "/images/feature-cv.png",
      title: "Quản lý CV thông minh",
      description:
        "Hệ thống tự động sắp xếp và sàng lọc CV theo tiêu chí nhà tuyển dụng, giúp bạn tiết kiệm thời gian và nâng cao hiệu quả tuyển dụng.",
      link: "Tìm hiểu thêm →",
    },
    {
      image: "/images/feature-analytics.png",
      title: "Phân tích thị trường Job",
      description:
        "Cung cấp dữ liệu chi tiết về xu hướng ngành nghề, mức lương và nhu cầu thị trường giúp bạn ra quyết định tuyển dụng chính xác hơn.",
      link: "Tìm hiểu thêm →",
    },
    {
      image: "/images/feature-exam.png",
      title: "Phòng thi trực tuyến",
      description:
        "Tổ chức thi tuyển và kiểm tra năng lực ứng viên trực tuyến ngay trên nền tảng, giúp quy trình tuyển dụng nhanh chóng và minh bạch.",
      link: "Tìm hiểu thêm →",
    },
  ];

  return (
    <section className="bg-[#f1f5f9] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-[#e8f5e9] text-[#00c853] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Các tính năng nổi bật
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Các tính năng chỉ có trên One-Click
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="w-full h-48 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={240}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-base font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <Link
                  href="#"
                  className="text-[#00c853] text-sm font-semibold hover:underline inline-flex items-center gap-1 transition-colors"
                >
                  {feature.link}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutstandingFeatures;
