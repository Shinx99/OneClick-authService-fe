"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { FiBriefcase, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

const carouselImages = [
  "/images/thienNhien.jpg",
  "/images/pexels.jpg",
  "/images/pexels-2.jpg",
];

const Background = ({ onSearch, showSearch = true, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      {/* --- CAROUSEL LAYER --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {carouselImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear ${
                index === currentIndex ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* --- CONTENT LAYER --- */}
      {/* Tăng z-index của toàn bộ khối nội dung lên z-20 */}
      <div className="relative z-20 w-full max-w-5xl px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase">
              <FiTrendingUp size={12} className="text-[#00c853]" />
              Nền tảng tuyển dụng hàng đầu
            </span>
          </div>

          <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            {title || "Tìm kiếm công việc mơ ước"}
          </h1>
          <p className="text-white/80 text-sm md:text-lg mb-10 max-w-2xl mx-auto font-medium">
            {subtitle || "Hàng ngàn cơ hội việc làm đang chờ bạn khám phá"}
          </p>
        </motion.div>

        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-50" // Giữ z-50 cực cao cho SearchBar
          >
            <SearchBar
              className="max-w-4xl mx-auto shadow-2xl"
              onSearch={onSearch}
            />

            <div className="flex items-center justify-center gap-6 md:gap-10 mt-8">
              <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <FiBriefcase size={16} className="text-[#00c853]" />
                <span>1000+ Việc làm</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <FiMapPin size={16} className="text-[#00c853]" />
                <span>63 Tỉnh thành</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- INDICATORS --- */}
      {/* GIẢM z-index xuống z-10 để nó nằm dưới Content Layer (z-20) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`group relative h-2 transition-all duration-300 ${
              i === currentIndex
                ? "w-10 bg-[#00c853]"
                : "w-2 bg-white/40 hover:bg-white/60"
            } rounded-full`}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === currentIndex && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Background;
