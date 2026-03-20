import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const HeroArea = () => {
  return (
    <section className="relative bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#e8f5e9] text-[#00c853] text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
              Nhà tuyển dụng
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              One-Click Smart
              <br />
              Recruitment
              <br />
              Platform
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-md">
              Tối ưu hóa quy trình tìm kiếm nhân sự với công nghệ AI tiên tiến.
              Đăng tin tuyển dụng, sàng lọc ứng viên và quản lý tuyển dụng chỉ với một nền tảng duy nhất.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="w-32">
                <Link href="/employer-register" className="block w-full">
                  <Button variant="primary">Đăng tin</Button>
                </Link>
              </div>
              <div className="w-48">
                <Button variant="social">Tư vấn tuyển dụng</Button>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <Image
                src="/images/employer-hero.png"
                alt="Smart Recruitment Platform"
                width={480}
                height={380}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroArea;
