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

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedKeyword.trim()) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const pageData = await resumeService.fetchAllResumes({
          keyword: selectedKeyword.trim(),
          page: 0,
          size: 6,
        });
        const list = pageData?.content ?? [];
        setSuggestions(list);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Fetch error:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestion(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [selectedKeyword]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSelectedKeyword(val);

    if (val.trim() === "") {
      setSuggestions([]);
      setIsLoadingSuggestion(false);
      setShowDropDown(false);
    } else {
      setIsLoadingSuggestion(true);
      setShowDropDown(true);
    }
  };

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

  const handleQuickSuggestion = (s) => {
    setSelectedKeyword(s);
    setIsLoadingSuggestion(true);
    setShowDropDown(true);
    onSearch(s);
  };

  return (
    // ĐÃ XÓA HOÀN TOÀN BORDER-B (Đường kẻ ngang)
    <section className="relative px-6 py-16 min-h-[520px] bg-slate-50 dark:bg-[#0B132B] transition-colors duration-500">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particlesReady && (
          <Particles
            id="tsparticles-search"
            particlesLoaded={particlesLoaded}
            className="absolute inset-0"
            options={{
              fullScreen: { enable: false },
              background: { color: { value: "transparent" } },
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
                links: {
                  color: "#22c55e",
                  distance: 150,
                  enable: true,
                  opacity: 0.15,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 1.5,
                  outModes: { default: "bounce" },
                },
                number: { value: 80, density: { enable: true } },
                opacity: { value: 0.25 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
        )}
      </div>

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

      <div className="relative z-20 max-w-[1200px] mx-auto">
        <div className="w-full md:w-1/2 lg:w-[48%]">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 transition-colors
                        bg-emerald-50 text-emerald-600 border border-emerald-200 
                        dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
          >
            <BsStars size={13} />
            AI-Powered Search
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight text-slate-800 dark:text-white transition-colors">
            Tìm ứng viên <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              phù hợp với bạn
            </span>
          </h2>

          <div className="relative mb-4 mt-6" ref={dropdownRef}>
            <input
              type="text"
              value={selectedKeyword}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() =>
                selectedKeyword &&
                suggestions.length > 0 &&
                setShowDropDown(true)
              }
              placeholder="VD: React Developer..."
              className="w-full rounded-2xl px-5 py-4 pr-14 text-sm outline-none transition-all shadow-sm
                                bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                                dark:bg-[#131E3A] dark:border-[#1C2A4A] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-0"
            />

            {showDropDown && selectedKeyword && (
              <div
                className="absolute top-[110%] left-0 w-full rounded-2xl shadow-xl z-50 overflow-hidden transition-colors
                                bg-white border border-slate-200 
                                dark:bg-[#131E3A] dark:border-[#1C2A4A]"
              >
                <div
                  className="p-3 text-xs font-bold uppercase tracking-wider transition-colors
                                    text-slate-400 border-b border-slate-100 
                                    dark:text-slate-500 dark:border-[#1C2A4A]"
                >
                  Gợi ý ứng viên
                </div>
                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-[#1C2A4A]">
                  {isLoadingSuggestion ? (
                    <div className="p-5 text-center text-sm text-slate-400 dark:text-slate-500 italic">
                      Đang tìm kiếm...
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((resume, idx) => (
                      <div
                        key={resume.resumeId ?? resume.id ?? idx}
                        onClick={() => handleSelectSuggestion(resume)}
                        className={`flex items-center gap-3 p-3 cursor-pointer border-b transition-colors
                                                    border-slate-50 dark:border-[#1C2A4A]
                                                    ${
                                                      activeIndex === idx
                                                        ? "bg-slate-50 dark:bg-[#1A2744]"
                                                        : "hover:bg-slate-50 dark:hover:bg-[#1A2744]"
                                                    }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors
                                                    border border-slate-200 bg-white 
                                                    dark:border-[#1C2A4A] dark:bg-[#0B132B]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              resume.imgUrl || "/images/avatar-placeholder.jpg"
                            }
                            alt={resume.email}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/images/avatar-placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold truncate transition-colors text-slate-800 dark:text-white">
                            {`${resume.surname ?? ""} ${resume.name ?? ""}`.trim() ||
                              resume.email}
                          </p>
                          <div className="flex items-center gap-2 text-[12px] mt-0.5 transition-colors text-slate-500 dark:text-slate-400">
                            <h3 className="truncate">
                              {resume.major || "Đa lĩnh vực"}
                            </h3>
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
                    <div className="p-5 text-center text-sm text-slate-400 dark:text-slate-500">
                      Không tìm thấy ứng viên phù hợp
                    </div>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div
                    onClick={handleSubmit}
                    className="p-3 text-center text-xs font-semibold cursor-pointer transition-colors border-t
                                            text-emerald-600 hover:bg-emerald-50 border-slate-100 
                                            dark:text-emerald-400 dark:hover:bg-[#1A2744] dark:border-[#1C2A4A]"
                  >
                    Xem tất cả kết quả cho &quot;{selectedKeyword}&quot; →
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="absolute bottom-[9px] right-[9px] bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-colors shadow-md shadow-emerald-500/20"
            >
              <FaSearch size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs leading-6 mr-1 text-slate-500 dark:text-slate-400 transition-colors">
              Gợi ý:
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleQuickSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full transition-all
                                    bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 shadow-sm
                                    dark:bg-[#131E3A] dark:border-[#1C2A4A] dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-500/30 dark:hover:text-emerald-400 dark:shadow-none"
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
