"use client";

import { use, useState } from "react";
import { ResumePublicDetail } from "@/components/features/cvMarket";
import { JobSelectorPanel } from "@/components/features/cvMarket";
import { AIMatchingPanel } from "@/components/features/cvMarket";
import { useResumeByResumeId } from "@/hooks/useResume/useResumeByResumeId";
import { applicationService } from "@/services/application.service";
import { useAuth } from "@/context/AuthContext";
// import { aiService } from "@/services/ai.service";

const ResumePublicPage = ({ params }) => {
    const { resumeId } = use(params);
    const { resume, isLoading, error } = useResumeByResumeId(resumeId);

    // Authorization from context
    const { isRecruiter } = useAuth();

    // ── AI Matching state ──────────────────────────────────────
    const [selectedJob, setSelectedJob] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [isMatching, setIsMatching] = useState(false);

    const handleSelectJob = async (job) => {
        setSelectedJob(job);
        setMatchResult(null);
        setIsMatching(true);

        const result = applicationService.getMyJobs();

        await new Promise((r) => setTimeout(r, 1800));
        setMatchResult(null);
        setIsMatching(false);
    };

    // ── Loading ────────────────────────────────────────────────
    if (isLoading) return (
        <main className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto p-8 space-y-4 animate-pulse">
                <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-card-border/60 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 w-48 rounded-lg bg-card-border/60" />
                        <div className="h-4 w-64 rounded-lg bg-card-border/60" />
                        <div className="h-4 w-32 rounded-lg bg-card-border/60" />
                    </div>
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-card-border/60" />
                ))}
            </div>
        </main>
    );

    // ── Error ──────────────────────────────────────────────────
    if (error || !resume) return (
        <main className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-2">
                <p className="text-red-400 text-sm font-semibold">
                    {error ?? "Không tìm thấy hồ sơ này."}
                </p>
                <a href="/CVMarket" className="text-xs text-[#00c853] hover:underline">
                    ← Quay lại danh sách
                </a>
            </div>
        </main>
    );

    // ── Render ─────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-background py-10 px-4 space-y-6">
            <div className="max-w-[1400px] mx-auto space-y-6">

                {/* ── ROW 1: CV detail (trái) + Job selector (phải) ── */}

                <div className="min-w-0">
                    <ResumePublicDetail cv={resume} />
                </div>


                {isRecruiter && (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
                        <div className="min-w-0">
                            <ResumePublicDetail cv={resume} />
                        </div>

                        <div className="min-w-0 lg:sticky lg:top-6">
                            <JobSelectorPanel
                                selectedJob={selectedJob}
                                onSelectJob={handleSelectJob}
                            />
                        </div>
                    </div>
                )}


                {/* ── ROW 2: AI Matching full width ── */}
                {isRecruiter && (
                    <div className="w-full">
                        <AIMatchingPanel
                            selectedJob={selectedJob}
                            matchResult={matchResult}
                            isMatching={isMatching}
                        />
                    </div>
                )}

            </div>
        </main>
    );
};

export default ResumePublicPage;