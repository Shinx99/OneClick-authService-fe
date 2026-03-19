import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const AiTechnology = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
            Công nghệ đăng tin tuyển dụng mới.
          </h2>
          <p className="text-[#00c853] font-bold text-lg">
            Tính năng mới. Trải nghiệm mới
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: AI Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/employer-ai.png"
                alt="AI Recruitment Technology"
                width={480}
                height={380}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#f0fdf4] text-[#00c853] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              Công nghệ AI
            </span>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-4">
              Tương lai của tuyển dụng
            </h3>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
              Sử dụng trí tuệ nhân tạo để phân tích hồ sơ và đề xuất ứng viên
              phù hợp nhất với vị trí, giúp tiết kiệm tới 70% thời gian sàng lọc.
              Tất cả mọi thứ đều tự động và thông minh.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="w-40">
                <Button variant="primary">Đăng tin ngay</Button>
              </div>
              <div className="w-48">
                <Button variant="social">Tư vấn tuyển dụng</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTechnology;
