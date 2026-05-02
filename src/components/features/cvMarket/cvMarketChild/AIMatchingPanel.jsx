"use client";

import { Sparkles, CheckCircle2, XCircle, Zap } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const MATCH_TIERS = [
    { min: 85, label: "Rất phù hợp", color: "#00c853", ringBg: "#e5e7eb", bg: "bg-[#00c853]/10", border: "border-[#00c853]/30", text: "text-[#00c853]" },
    { min: 70, label: "Có thể phù hợp", color: "#f59e0b", ringBg: "#e5e7eb", bg: "bg-amber-500/10", border: "border-amber-400/30", text: "text-amber-500" },
    { min: 50, label: "Ít phù hợp", color: "#f97316", ringBg: "#e5e7eb", bg: "bg-orange-500/10", border: "border-orange-400/30", text: "text-orange-500" },
    { min: 0, label: "Không phù hợp", color: "#ef4444", ringBg: "#e5e7eb", bg: "bg-red-500/10", border: "border-red-400/30", text: "text-red-500" },
];

const getTier = (score) =>
    MATCH_TIERS.find((t) => score >= t.min) ?? MATCH_TIERS[MATCH_TIERS.length - 1];

// ─── Big Score Ring ───────────────────────────────────────────────────────────
const BigScoreRing = ({ score }) => {
    const tier = getTier(score);
    const r = 52;
    const circumference = 2 * Math.PI * r;
    const dash = (score / 100) * circumference;

    return (
        <div className="relative w-[130px] h-[130px] flex-shrink-0">
            <svg width="130" height="130" className="-rotate-90">
                <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                    cx="65" cy="65" r={r} fill="none"
                    stroke={tier.color} strokeWidth="10"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <span className="text-2xl font-black leading-none" style={{ color: tier.color }}>
                    {score}%
                </span>
                <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase">
                    Match Rate
                </span>
            </div>
        </div>
    );
};

// ─── Skill Tag ────────────────────────────────────────────────────────────────
const SkillTag = ({ label, variant }) => {
    const styles = {
        green: "border border-[#00c853]/40 text-[#00a040] bg-white",
        orange: "border border-orange-300   text-orange-500 bg-white",
    };
    return (
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${styles[variant]}`}>
            {label}
        </span>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const MatchSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {/* Card 1 skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex gap-5 items-start">
                <div className="w-[130px] h-[130px] rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-3 pt-2">
                    <div className="h-5 bg-gray-100 rounded w-28" />
                    <div className="h-4 bg-gray-100 rounded w-40" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                    <div className="h-3 bg-gray-100 rounded w-4/6" />
                </div>
            </div>
        </div>
        {/* Card 2 & 3 skeleton */}
        {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100" />
                    <div className="h-4 bg-gray-100 rounded w-36" />
                    <div className="h-5 bg-gray-100 rounded-full w-7 ml-1" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {[...Array(6)].map((_, j) => (
                        <div key={j} className="h-7 bg-gray-100 rounded-full w-20" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// ─── Main Panel ───────────────────────────────────────────────────────────────
const AIMatchingPanel = ({ selectedJob, matchResult, isMatching }) => {

    // ── Empty state ──
    if (!selectedJob && !isMatching) return (
        <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center px-6">
            <Zap size={28} className="text-gray-300 mb-3" />
            <p className="text-sm font-bold text-gray-400">Chọn vị trí để bắt đầu AI Matching</p>
            <p className="text-xs text-gray-300 mt-1">AI sẽ phân tích mức độ phù hợp của ứng viên</p>
        </div>
    );

    // ── Loading ──
    if (isMatching) return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-[#00c853]/20 bg-[#00c853]/5 p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse flex-shrink-0" />
                <p className="text-sm text-[#00c853] font-bold">
                    AI đang phân tích cho vị trí{" "}
                    <span className="underline">{selectedJob?.title}</span>...
                </p>
            </div>
            <MatchSkeleton />
        </div>
    );

    // ── No result ──
    if (!matchResult) return null;

    const { overallScore, summary, matchedSkills = [], missingSkills = [] } = matchResult;
    const tier = getTier(overallScore);

    return (
        <div className="space-y-3">

            {/* ── Card 1: Score ring + Summary ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex gap-5 items-start">

                    {/* Ring */}
                    <BigScoreRing score={overallScore} />

                    {/* Right */}
                    <div className="flex-1 min-w-0 pt-1">
                        {/* Tier badge */}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${tier.bg} ${tier.border} ${tier.text}`}>
                            <Sparkles size={11} />
                            {tier.label}
                        </span>

                        <h3 className="text-base font-black text-gray-800 mb-2">
                            Kết quả phân tích CV
                        </h3>

                        <p className="text-sm text-gray-500 leading-relaxed">
                            {summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Card 2: Matched skills ── */}
            {matchedSkills.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#00c853] flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={13} className="text-white" />
                        </div>
                        <h4 className="text-sm font-black text-gray-800">Kỹ năng phù hợp</h4>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                            {matchedSkills.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, i) => (
                            <SkillTag key={i} label={skill} variant="green" />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Card 3: Missing skills ── */}
            {missingSkills.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
                            <XCircle size={13} className="text-white" />
                        </div>
                        <h4 className="text-sm font-black text-gray-800">Kỹ năng cần bổ sung</h4>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                            {missingSkills.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, i) => (
                            <SkillTag key={i} label={skill} variant="orange" />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default AIMatchingPanel;