import React from "react";
import SearchBar from "@/components/ui/SearchBar";
import { FiBriefcase, FiMapPin, FiTrendingUp } from "react-icons/fi";

const Background = ({ onSearch }) => {
  return (
    <section className="relative w-full min-h-[340px] md:min-h-[400px] flex items-center justify-center">
      {/* Background image — overflow-hidden chỉ áp dụng cho ảnh nền, không ảnh hưởng dropdown */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/images/thienNhien.jpg')" }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 dark:from-black/60 dark:via-black/50 dark:to-black/70 transition-colors duration-500" />
        </div>

        {/* Decorative blurred circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#00c853]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content — z-20 để dropdown nổi lên trên mọi thứ bên dưới */}
      <div className="relative z-20 w-full max-w-5xl px-4 py-12 md:py-16">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-wider uppercase">
            <FiTrendingUp size={12} className="text-[#00c853]" />
            Nền tảng tuyển dụng hàng đầu
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl md:text-4xl font-extrabold text-center mb-3 drop-shadow-lg">
          Tìm kiếm công việc mơ ước
        </h1>

        {/* Subtitle */}
        <p className="text-white/70 text-sm md:text-base text-center mb-8 max-w-2xl mx-auto font-medium">
          Hàng ngàn cơ hội việc làm đang chờ bạn khám phá
        </p>

        {/* Search bar */}
        <SearchBar className="max-w-4xl mx-auto" onSearch={onSearch} />

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mt-8">
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <FiBriefcase size={14} className="text-[#00c853]" />
            <span>1000+ Việc làm</span>
          </div>
          <div className="w-1 h-1 bg-white/30 rounded-full" />
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <FiMapPin size={14} className="text-[#00c853]" />
            <span>63 Tỉnh thành</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Background;
