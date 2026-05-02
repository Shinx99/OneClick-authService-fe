"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import Image from "next/image";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import resumeService from "@/services/resume.service.js";

const SUGGESTIONS = [
    "React Developer 3 năm kinh nghiệm",
    "Marketing Manager biết tiếng Anh",
    "Designer thành thạo Figma",
    "Data Analyst lương 20-30 triệu",
];

const SearchPrompt = ({ onSearch }) => {
    const [selectedKeyword, setSelectedKeyword] = useState("");
    const [particlesReady, setParticlesReady] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    // ── Particles ──────────────────────────────────────────────
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setParticlesReady(true));
    }, []);
    const particlesLoaded = useCallback(async () => { }, []);

    // ── Click outside → đóng dropdown ──────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropDown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Debounce fetch suggestion ───────────────────────────────
    useEffect(() => {

        setIsLoadingSuggestion(true);
        setShowDropDown(true);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const pageData = await resumeService.fetchAllResumes({
                    keyword: selectedKeyword.trim() || undefined,
                    page: 0,
                    size: 6
                });
                const list = pageData?.content ?? [];
                setSuggestions(list);
                setActiveIndex(-1);
            } catch (err) {
                console.error("Fetch suggestion error:", err);
                setSuggestions([]);
            } finally {
                setIsLoadingSuggestion(false);
            }
        }, 350);

        return () => clearTimeout(debounceRef.current);
    }, [selectedKeyword]);

    // ── Keyboard navigation ─────────────────────────────────────
    const handleKeyDown = (e) => {
        if (!showDropDown || suggestions.length === 0) {
            if (e.key === "Enter") handleSubmit();
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0) {
                handleSelectSuggestion(suggestions[activeIndex]);
            } else {
                handleSubmit();
            }
        } else if (e.key === "Escape") {
            setShowDropDown(false);
        }
    };

    // ── Chọn suggestion → search luôn bằng tên/email ───────────
    const handleSelectSuggestion = (resume) => {
        if (resume) {
            const name = `${resume.surname ?? ""} ${resume.name ?? ""}`.trim();
            const searchTerm = name || resume.email;
            setSelectedKeyword(searchTerm);
            onSearch(searchTerm);
        }
        setShowDropDown(false);
    };

    const handleSubmit = () => {
        onSearch(selectedKeyword.trim());
        setShowDropDown(false);
    };

    return (

        <section className="relative px-6 py-16 min-h-[520px]">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {particlesReady && (
                    <Particles
                        id="tsparticles"
                        particlesLoaded={particlesLoaded}
                        className="absolute inset-0"
                        options={{
                            fullScreen: { enable: false },
                            background: { color: { value: "#0a1628" } },
                            fpsLimit: 60,
                            interactivity: {
                                events: {
                                    onClick: { enable: true, mode: "push" },
                                    onHover: { enable: true, mode: "grab" },
                                },
                                modes: { push: { quantity: 3 }, grab: { distance: 160 } },
                            },
                            particles: {
                                color: { value: "#22c55e" },
                                links: { color: "#22c55e", distance: 150, enable: true, opacity: 0.3, width: 1 },
                                move: { enable: true, speed: 1.5, outModes: { default: "bounce" } },
                                number: { value: 80, density: { enable: true } },
                                opacity: { value: 0.5 },
                                shape: { type: "circle" },
                                size: { value: { min: 1, max: 3 } },
                            },
                            detectRetina: true,
                        }}
                    />
                )}
            </div>

            {/* 3D Character */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 z-10 pointer-events-none">
                <Image
                    src="/images/character-3d.png"
                    alt="3D Character"
                    fill
                    sizes="50vw"
                    className="object-contain object-center drop-shadow-2xl scale-[1.15]"
                    priority
                    unoptimized
                />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-[1200px] mx-auto">
                <div className="w-full md:w-1/2 lg:w-[48%]">

                    {/* AI Badge */}
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                        <BsStars size={13} />
                        AI-Powered Search
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                        Tìm ứng viên <br />
                        <span className="text-green-400">phù hợp với bạn</span>
                    </h2>
                    {/* <p className="text-sm text-white/60 mb-7">
                        Mô tả ứng viên bạn đang tìm — AI sẽ tìm hồ sơ phù hợp nhất
                    </p> */}

                    {/* Search box */}
                    <div className="relative mb-4" ref={dropdownRef}>
                        <input
                            type="text"
                            value={selectedKeyword}
                            onChange={(e) => setSelectedKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => selectedKeyword && suggestions.length > 0 && setShowDropDown(true)}
                            placeholder="VD: React Developer..."
                            className="w-full border border-white/10 focus:border-green-500 rounded-2xl px-5 py-4 pr-14 text-sm text-white placeholder:text-white/30 outline-none transition-colors shadow-sm bg-white/10 backdrop-blur-sm"
                        />

                        {/* Suggestion Dropdown */}
                        {showDropDown && selectedKeyword && (
                            <div className="absolute top-[110%] left-0 w-full bg-white dark:bg-[#0d1f35] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
                                <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/10">
                                    Gợi ý ứng viên
                                </div>

                                <div className="max-h-[320px] overflow-y-auto">
                                    {isLoadingSuggestion ? (
                                        <div className="p-5 text-center text-sm text-gray-400 italic">
                                            Đang tìm kiếm...
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map((resume, idx) => (
                                            <div

                                                key={resume.resumeId ?? resume.id ?? idx}
                                                onClick={() => handleSelectSuggestion(resume)}
                                                className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-50 dark:border-white/5 transition-colors
                                                    ${activeIndex === idx
                                                        ? "bg-green-50 dark:bg-green-500/10"
                                                        : "hover:bg-green-50 dark:hover:bg-slate-800/50"
                                                    }`}
                                            >
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-lg border border-gray-100 dark:border-white/10 bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src={resume.imgUrl || "/images/avatar-placeholder.jpg"}
                                                        alt={resume.email}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = "/images/avatar-placeholder.jpg"; }}
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-semibold text-gray-800 dark:text-white truncate">
                                                        {`${resume.surname ?? ""} ${resume.name ?? ""}`.trim() || resume.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[12px] text-gray-400 mt-0.5">
                                                        <h3 className="truncate">{resume.major || "Đa lĩnh vực"}</h3>
                                                        {resume.experienceYear && (
                                                            <>
                                                                <span>·</span>
                                                                <h3>{resume.experienceYear} năm KN</h3>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-5 text-center text-sm text-gray-400">
                                            Không tìm thấy ứng viên phù hợp
                                        </div>
                                    )}
                                </div>

                                {/* Footer — tìm tất cả */}
                                {suggestions.length > 0 && (
                                    <div
                                        onClick={handleSubmit}
                                        className="p-3 text-center text-xs text-green-500 font-semibold cursor-pointer hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors border-t border-gray-100 dark:border-white/10"
                                    >
                                        Xem tất cả kết quả cho &quot;{selectedKeyword}&quot; →
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Search button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl transition-colors"
                        >
                            <FaSearch size={14} />
                        </button>
                    </div>

                    {/* Quick suggestions */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-white/40 leading-6 mr-1">Gợi ý:</span>
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => {
                                    setSelectedKeyword(s);
                                    onSearch(s);
                                }}
                                className="text-xs bg-white/10 border border-white/10 text-white/70 px-3 py-1.5 rounded-full hover:bg-green-500/20 hover:border-green-500/40 hover:text-green-400 transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchPrompt;