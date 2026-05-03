/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaRocket, FaUserTie } from "react-icons/fa";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const CallToAction = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [shootingStars, setShootingStars] = useState([]);
  const [particlesInit, setParticlesInit] = useState(false);

  // Init tsParticles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  // Generate shooting stars ở client
  useEffect(() => {
    setShootingStars(
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        top: Math.random() * 60,
        delay: i * 3 + Math.random() * 2,
        duration: Math.random() * 2 + 1.5,
      })),
    );
  }, []);

  // Parallax cho nebula/planets
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const layer1X = useTransform(smoothX, [-1, 1], [-20, 20]);
  const layer1Y = useTransform(smoothY, [-1, 1], [-20, 20]);
  const layer3X = useTransform(smoothX, [-1, 1], [-60, 60]);
  const layer3Y = useTransform(smoothY, [-1, 1], [-60, 60]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setMousePos((p) => ({ ...p, active: false }));
  };

  return (
    <section className="relative bg-background transition-colors duration-300 py-16 isolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Glow Vũ trụ (Đổi màu sang Tím/Xanh biển/Cyan) */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/25 via-purple-400/25 to-cyan-500/25 rounded-[30px] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-[30px] overflow-hidden shadow-2xl border border-indigo-300/20"
          >
            {/* Background galaxy gradient (Chuyển sang nền Deep Space) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#07071c] via-[#130b29] to-[#030308] z-0" />

            {/* tsParticles - Constellation tương tác */}
            {particlesInit && (
              <Particles
                id="tsparticles-cta"
                particlesLoaded={particlesLoaded}
                className="absolute inset-0 z-[1]"
                options={{
                  fullScreen: { enable: false },
                  background: { color: { value: "transparent" } },
                  fpsLimit: 60,
                  interactivity: {
                    detectsOn: "parent",
                    events: {
                      onClick: { enable: true, mode: "push" },
                      onHover: { enable: true, mode: "grab" },
                      resize: { enable: true },
                    },
                    modes: {
                      push: { quantity: 4 },
                      grab: {
                        distance: 180,
                        links: { opacity: 0.8, color: "#818cf8" }, // Line màu xanh chàm
                      },
                      repulse: { distance: 100, duration: 0.4 },
                    },
                  },
                  particles: {
                    color: {
                      // Các hạt màu hồng, tím, cyan và trắng
                      value: ["#c084fc", "#818cf8", "#2dd4bf", "#ffffff"],
                    },
                    links: {
                      color: "#818cf8",
                      distance: 150,
                      enable: true,
                      opacity: 0.3,
                      width: 1,
                      triangles: { enable: false },
                    },
                    move: {
                      enable: true,
                      speed: 1,
                      direction: "none",
                      random: true,
                      straight: false,
                      outModes: { default: "bounce" },
                    },
                    number: {
                      value: 90,
                      density: { enable: true, area: 800 },
                    },
                    opacity: {
                      value: { min: 0.3, max: 0.9 },
                      animation: {
                        enable: true,
                        speed: 1,
                        sync: false,
                      },
                    },
                    shape: { type: "circle" },
                    size: {
                      value: { min: 1, max: 3 },
                      animation: {
                        enable: true,
                        speed: 2,
                        sync: false,
                      },
                    },
                    shadow: {
                      enable: true,
                      color: "#6366f1", // Shadow ánh tím/xanh
                      blur: 5,
                    },
                  },
                  detectRetina: true,
                }}
              />
            )}

            {/* Aura đuổi theo chuột (Đổi thành màu Tím Vũ trụ) */}
            {mousePos.active && (
              <div
                className="absolute pointer-events-none transition-opacity duration-300 z-[2]"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: 400,
                  height: 400,
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.15) 30%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
            )}

            {/* Nebula clouds parallax (Mây tinh vân hệ màu Galaxy) */}
            <motion.div
              style={{ x: layer1X, y: layer1Y }}
              className="absolute inset-0 z-[2] pointer-events-none"
            >
              <motion.div
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]"
                animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px]"
                animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Dải ngân hà (Milky way band màu ánh tím) */}
            <motion.div
              style={{ x: layer1X, y: layer1Y }}
              className="absolute inset-0 opacity-50 z-[2] pointer-events-none"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(139, 92, 246, 0.2) 45%, rgba(255, 255, 255, 0.15) 50%, rgba(59, 130, 246, 0.2) 55%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
            </motion.div>

            {/* Shooting stars (Sao băng xẹt màu tím hồng) */}
            {shootingStars.map((star) => (
              <motion.div
                key={`shoot-${star.id}`}
                className="absolute h-[2px] w-[120px] pointer-events-none z-[3]"
                style={{
                  top: `${star.top}%`,
                  left: "-120px",
                  background:
                    "linear-gradient(90deg, transparent, #fff 50%, #a855f7 100%)",
                  boxShadow: "0 0 10px #a855f7, 0 0 20px #8b5cf6",
                }}
                animate={{
                  x: ["0vw", "120vw"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  repeatDelay: 5,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Planet orbs (Hành tinh lơ lửng) */}
            <motion.div
              style={{ x: layer3X, y: layer3Y }}
              className="absolute inset-0 hidden md:block z-[3] pointer-events-none"
            >
              {/* Hành tinh Tím/Hồng */}
              <motion.div
                className="absolute top-10 right-10 w-24 h-24 rounded-full opacity-70"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #fbcfe8, #d946ef 40%, #701a75)",
                  boxShadow:
                    "inset -10px -10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(217, 70, 239, 0.6)",
                }}
                animate={{ y: [0, -15, 0], rotate: [0, 360] }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                }}
              />
              {/* Hành tinh Xanh Băng */}
              <motion.div
                className="absolute bottom-10 left-10 w-16 h-16 rounded-full opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #ffffff, #2dd4bf 40%, #0f766e)",
                  boxShadow:
                    "inset -6px -6px 20px rgba(0,0,0,0.5), 0 0 30px rgba(45, 212, 191, 0.6)",
                }}
                animate={{ y: [0, 10, 0], rotate: [0, -360] }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                }}
              />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center pointer-events-none">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-indigo-300/30 rounded-full mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                  </span>
                  <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent uppercase tracking-widest">
                    ✨ Hành trình giữa các vì sao
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-[1.2] mb-6 max-w-4xl px-2"
                >
                  <span className="text-white drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">
                    Sẵn sàng để bắt đầu
                  </span>{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                      hành trình mới?
                    </span>
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-sm md:text-lg text-indigo-100/80 mb-10 max-w-3xl mx-auto font-medium leading-relaxed px-4 text-center"
                >
                  Tham gia cùng{" "}
                  <span className="text-white font-bold whitespace-nowrap">
                    hơn 100,000 ứng viên
                  </span>{" "}
                  đã tìm thấy công việc mơ ước qua nền tảng tuyển dụng hiện đại{" "}
                  <span className="bg-gradient-to-r from-indigo-300 to-white bg-clip-text text-transparent font-bold whitespace-nowrap">
                    One-Click
                  </span>
                  .
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pointer-events-auto"
                >
                  <Link
                    href="/register"
                    className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 w-full sm:w-auto overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]" />
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 blur-xl opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3 text-white">
                      <FaRocket className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      <span className="whitespace-nowrap">
                        Đăng ký ứng tuyển ngay
                      </span>
                    </span>
                  </Link>
                  <Link
                    href="/register"
                    className="group/btn relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-indigo-300/30 hover:border-purple-300/70 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 w-full sm:w-auto"
                  >
                    <FaUserTie className="text-indigo-300 group-hover/btn:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">
                      Dành cho nhà tuyển dụng
                    </span>
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1 }}
                  className="text-[10px] text-indigo-200/60 mt-6 italic"
                >
                  ✨ Di chuyển chuột để kết nối các vì sao • Click để tạo sao
                  mới
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THAY THẾ ĐOẠN STYLE JSX CŨ BẰNG ĐOẠN NÀY */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `,
        }}
      />
    </section>
  );
};

export default CallToAction;
