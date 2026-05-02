"use client";

import { useState, useEffect, useCallback } from "react";
import ResumeMiniCard from "@/components/features/cvMarket/cvMarketChild/ResumeMiniCard";
import ResumeDetailModal from "@/components/features/cvMarket/cvMarketChild/ResumeDetailModal";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useResumes } from "@/hooks/useResume/useResumes";

const CVMarket = ({ keyword = "" }) => {
    const [particlesReady, setParticlesReady] = useState(false);
    const [page, setPage] = useState(0);
    const [selectedCv, setSelectedCv] = useState(null);

    useEffect(() => {
        setPage(0);
    }, [keyword]);

    // -----------------------------------------------------------------------
    // HOOK
    // -----------------------------------------------------------------------
    const { resumes, isLoading, error } = useResumes({ keyword, page, size: 9 });

    // -----------------------------------------------------------------------
    // PARTICLES
    // -----------------------------------------------------------------------
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setParticlesReady(true));
    }, []);
    const particlesLoaded = useCallback(async () => { }, []);

    return (
        <section className="relative px-6 py-16 overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0d2137] to-slate-900">

            {/* PARTICLES */}
            {particlesReady && (
                <Particles
                    id="tsparticles-cv"
                    particlesLoaded={particlesLoaded}
                    className="absolute inset-0 z-0"
                    options={{
                        fullScreen: { enable: false },
                        background: { color: { value: "transparent" } },
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onClick: { enable: true, mode: "push" },
                                onHover: { enable: true, mode: "grab" },
                            },
                            modes: {
                                push: { quantity: 3 },
                                grab: { distance: 160 },
                            },
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
                                speed: 1,
                                outModes: { default: "bounce" },
                            },
                            number: {
                                value: 50,
                                density: { enable: true },
                            },
                            opacity: { value: 0.25 },
                            shape: { type: "circle" },
                            size: { value: { min: 1, max: 2 } },
                        },
                        detectRetina: true,
                    }}
                />
            )}

            <div className="relative z-10 max-w-[1200px] mx-auto">

                {/* HEADER */}
                <div className="mb-7">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5">
                        Hồ sơ ứng viên
                    </h2>
                    <p className="text-sm text-green-400 font-medium">
                        Tìm kiếm ứng viên phù hợp với vị trí tuyển dụng
                    </p>
                </div>

                {/* LOADING — skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <p className="text-center text-red-400 text-sm py-8">{error}</p>
                )}

                {/* CV LIST */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resumes?.content?.length > 0 ? (
                            resumes.content.map((cv) => (
                                <ResumeMiniCard
                                    key={cv.resumeId}
                                    name={`${cv.surname ?? ""} ${cv.name ?? ""}`.trim()}
                                    email={cv.email}
                                    avatar={cv.imgUrl}
                                    major={cv.major}
                                    experienceYear={cv.experienceYear}
                                    salaryExpectation={cv.salaryExpectation}
                                    findJob={cv.findJob}
                                    viewCount={cv.viewCount}
                                    parsedData={cv.parsedData}
                                    onViewDetail={() => setSelectedCv(cv)}
                                />
                            ))
                        ) : (
                            <p className="col-span-3 text-center text-white/40 py-8">
                                Không tìm thấy hồ sơ phù hợp
                            </p>
                        )}
                    </div>
                )}

                {/* PAGINATION */}
                {!isLoading && resumes?.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            type="button"
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:border-green-500 hover:text-green-400 disabled:opacity-30 text-sm transition-all"
                        >
                            ← Trước
                        </button>

                        <span className="text-white/40 text-sm">
                            {page + 1} / {resumes?.totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={resumes?.last}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:border-green-500 hover:text-green-400 disabled:opacity-30 text-sm transition-all"
                        >
                            Tiếp →
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL CHI TIẾT */}
            {selectedCv && (
                <ResumeDetailModal
                    cv={selectedCv}
                    onClose={() => setSelectedCv(null)}
                />
            )}
        </section>
    );
};

export default CVMarket;