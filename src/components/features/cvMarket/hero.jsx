"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";

const POPULAR_TAGS = ["React Developer", "Product Manager", "UX Designer", "Data Analyst", "Marketing"];

const Hero = () => {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: implement search logic
    };

    return (
        <section className="relative w-full min-h-[420px] flex items-center justify-center">

            {/* ── Background ── */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{ backgroundImage: "url('/images/thienNhien.jpg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
                </div>

                {/* Decorative blurs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* ── Content ── */}
            <div className="relative z-20 w-full max-w-[920px] px-6 py-16 mx-auto text-center">

                {/* Badge */}
                <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-wider uppercase">
                        <FiTrendingUp size={12} className="text-green-400" />
                        Nền tảng hồ sơ ứng viên hàng đầu
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
                    Tìm ứng viên phù hợp,{" "}
                    <br />
                    <span className="text-green-400">nhanh chóng & chính xác</span>
                </h1>

                {/* Subheading */}
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-[520px] mx-auto mb-8">
                    Hàng nghìn hồ sơ ứng viên chất lượng đang chờ bạn khám phá
                </p>

                {/* Search bar */}
                <form
                    onSubmit={handleSearch}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex gap-2 max-w-[640px] mx-auto mb-5"
                >
                    <div className="flex flex-1 items-center gap-3 bg-white rounded-xl px-4 py-3">
                        <FaSearch className="text-slate-400 shrink-0" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Chuyên ngành, kỹ năng, tên ứng viên..."
                            className="flex-1 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                            autoComplete="off"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 rounded-xl shrink-0 transition-colors"
                    >
                        Tìm kiếm
                    </button>
                </form>

                {/* Popular tags */}
                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    <span className="text-white/50 text-xs leading-6">Phổ biến:</span>
                    {POPULAR_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setQuery(tag)}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-0.5 text-xs text-white/80 hover:bg-green-500/30 hover:border-green-400 hover:text-white transition-all"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Quick stats */}
                <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                        <FiUsers size={14} className="text-green-400" />
                        <span>50K+ Ứng viên</span>
                    </div>
                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                    <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                        <FiBriefcase size={14} className="text-green-400" />
                        <span>10K+ Nhà tuyển dụng</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;