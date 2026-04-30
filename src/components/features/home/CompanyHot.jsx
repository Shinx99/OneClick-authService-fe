"use client";
import React, { useState, useEffect } from "react";
import { companyService } from "@/services/company.service";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const CompanyHot = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // FIX HYDRATION: Thêm state để lưu trữ các bong bóng random
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyService.getTop6Companies();
        if (response.success) setCompanies(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu công ty hàng đầu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopCompanies();
  }, []);

  // FIX HYDRATION: Chạy hàm random bên trong useEffect ở Client Side
  useEffect(() => {
    const generatedBubbles = Array.from({ length: 15 }).map(() => ({
      width: `${Math.random() * 40 + 10}px`,
      height: `${Math.random() * 40 + 10}px`,
      left: `${Math.random() * 100}%`,
      xTarget: Math.random() * 100 - 50,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 5,
    }));
    setBubbles(generatedBubbles);
  }, []);

  const gradients = [
    "from-emerald-400 via-teal-500 to-cyan-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-amber-400 via-orange-500 to-rose-500",
    "from-sky-400 via-blue-500 to-indigo-600",
    "from-pink-400 via-rose-500 to-red-500",
    "from-lime-400 via-green-500 to-emerald-500",
  ];

  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="relative py-16 overflow-hidden bg-background transition-colors duration-300">
      {/* THAY THẾ ĐOẠN STYLE JSX GLOBAL CŨ BẰNG ĐOẠN NÀY */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
          will-change: transform;
        }
        .marquee-paused {
          animation-play-state: paused;
        }
        .bubble-tilt,
        .bubble-tilt > div,
        .bubble-tilt .glare-wrapper,
        .bubble-tilt .glare {
          border-radius: 50% !important;
          overflow: hidden !important;
        }
      `,
        }}
      />

      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-10 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 -right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* FIX HYDRATION: Map qua mảng bubbles trong state */}
        {bubbles.map((bubble, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-cyan-300/30 to-emerald-300/30 backdrop-blur-sm border border-white/20"
            style={{
              width: bubble.width,
              height: bubble.height,
              left: bubble.left,
              bottom: "-50px",
            }}
            animate={{
              y: [0, -800],
              x: [0, bubble.xTarget, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-sm mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Hot Companies
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Công ty nổi bật
            </span>
            <br />
            <span className="text-text-main text-2xl md:text-3xl">
              hàng đầu về nhân sự
            </span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mt-4 rounded-full"
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-full bg-gradient-to-br from-gray-200 to-gray-100 dark:from-slate-800 dark:to-slate-700 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div
              className="relative overflow-hidden py-8"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{ perspective: "1200px" }}
            >
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div
                className={`marquee-track flex gap-6 w-max ${
                  isPaused ? "marquee-paused" : ""
                }`}
              >
                {duplicatedCompanies.map((company, idx) => (
                  <motion.div
                    key={`${company.companyId}-${idx}`}
                    className="w-[220px] h-[220px] flex-shrink-0"
                    animate={{
                      y: [0, -20, 0, -10, 0],
                      rotateZ: [0, 2, 0, -2, 0],
                    }}
                    transition={{
                      duration: 6 + (idx % 3),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (idx % 5) * 0.3,
                    }}
                  >
                    <Tilt
                      tiltMaxAngleX={20}
                      tiltMaxAngleY={20}
                      glareEnable={false}
                      scale={1.08}
                      transitionSpeed={1500}
                      className="bubble-tilt h-full w-full"
                      style={{
                        borderRadius: "50%",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <Link
                        href={`/companies/${company.companyId}`}
                        className="relative group block w-full h-full rounded-full"
                        style={{ borderRadius: "50%" }}
                      >
                        {/* Vòng sáng ngoài - bong bóng */}
                        <motion.div
                          className={`absolute -inset-1 bg-gradient-to-br ${
                            gradients[idx % gradients.length]
                          } rounded-full opacity-60 group-hover:opacity-100 blur-md`}
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            scale: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                            rotate: {
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear",
                            },
                          }}
                        />

                        {/* Card - bong bóng tròn */}
                        <div className="relative h-full w-full bg-card-bg rounded-full p-6 flex flex-col items-center justify-center overflow-hidden border-2 border-white/50 dark:border-slate-700/50 shadow-2xl">
                          {/* Highlight giọt nước */}
                          <div className="absolute top-4 left-6 w-12 h-8 bg-white/40 rounded-full blur-md pointer-events-none" />
                          <div className="absolute top-6 left-8 w-4 h-3 bg-white/60 rounded-full blur-sm pointer-events-none" />

                          {/* Custom shine - thay cho glare của Tilt */}
                          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background:
                                  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                              }}
                            />
                          </div>

                          {/* Shine sweep khi hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full overflow-hidden pointer-events-none">
                            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-12 group-hover:translate-x-[200%] transition-transform duration-1000" />
                          </div>

                          {/* Logo */}
                          <div className="relative mb-2 transform-gpu group-hover:scale-110 transition-transform duration-500">
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${
                                gradients[idx % gradients.length]
                              } rounded-full blur-xl opacity-50`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            {company.logoUrl ? (
                              <div className="relative w-20 h-20 rounded-full shadow-xl overflow-hidden group-hover:rotate-12 transition-transform duration-500">
                                <Image
                                  src={company.logoUrl}
                                  alt={company.companyName || "Company logo"}
                                  fill
                                  sizes="80px"
                                  className="object-contain rounded-full"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div
                                className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${
                                  gradients[idx % gradients.length]
                                } shadow-xl flex items-center justify-center text-white text-2xl font-black group-hover:rotate-12 transition-transform duration-500`}
                              >
                                {company.companyName?.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Tên công ty */}
                          <span className="relative text-[11px] font-black text-text-main block uppercase tracking-wider leading-tight text-center line-clamp-2 px-2 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                            {company.companyName}
                          </span>

                          {/* Lĩnh vực */}
                          <div className="relative mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700/50 group-hover:bg-emerald-500/10 transition-colors">
                            <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                            <p className="text-[8px] text-gray-500 dark:text-slate-400 font-bold uppercase truncate max-w-[100px]">
                              {company.industry || "Đa lĩnh vực"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Tilt>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-xs text-text-muted mt-6 italic"
            >
              🫧 Di chuột vào để tạm dừng • Nhấp để xem chi tiết
            </motion.p> */}
          </>
        )}
      </div>
    </section>
  );
};

export default CompanyHot;
