import { cn } from "@/utils/cnUtils";
import Badge from "@/components/features/cvMarket/ui/badge";
import { Eye } from "lucide-react";

const getParsed = (raw) => {
    if (!raw) return null;
    if (typeof raw === "object") return raw;
    try { return JSON.parse(raw); } catch { return null; }
};

const ResumeMiniCard = ({
    name,
    email,
    avatar,
    major,
    experienceYear,
    salaryExpectation,
    findJob,
    viewCount,
    parsedData,
    onViewDetail,
}) => {
    const parsed = getParsed(parsedData);

    // ── Fix key cho đúng API: workExperience, topSkills ──
    const latestJob = parsed?.workExperience?.[0] ?? null;
    const topSkills = parsed?.extractedFields?.topSkills ?? [];   // max 7
    const allSkills = parsed?.skills ?? [];

    const MAX_DISPLAY = 10
    const displaySkills = topSkills.length > 0 ? topSkills.slice(0, MAX_DISPLAY) : allSkills.slice(0, MAX_DISPLAY);
    const extraCount = allSkills.length - displaySkills.length;

    // Tên hiển thị: ưu tiên parsedData.personal.fullName nếu surname/name null
    const displayName = name?.trim() || parsed?.personal?.fullName || email;

    return (
        <div
            className={cn(
                "relative group flex flex-col",
                "bg-white/5 backdrop-blur-md",
                "border border-white/10",
                "hover:border-green-500/40 hover:bg-white/8",
                "rounded-2xl p-5",
                "shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
                "hover:shadow-[0_8px_32px_rgba(0,200,83,0.15)]",
                "hover:-translate-y-1",
                "transition-all duration-300",
                "cursor-pointer w-full overflow-hidden"
            )}
            onClick={onViewDetail}
        >

            {/* Header — avatar + tên */}
            <div className="flex gap-3 mb-3 items-start">
                <div className="relative shrink-0">
                    <img
                        src={avatar || parsed?.personal?.avatarUrl || "/images/avatar-placeholder.jpg"}
                        alt={displayName}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-green-500/30 transition-all"
                    />
                    {findJob && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d2137] shadow-[0_0_6px_#00c853]" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[15px] font-bold text-white truncate">{displayName}</span>
                        {findJob && (
                            <Badge
                                label="Đang tìm việc"
                                className="bg-green-500/15 text-green-400 border border-green-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            />
                        )}
                    </div>
                    {/* vị trí gần nhất hoặc major làm subtitle */}
                    <span className="text-xs text-white/40 truncate block">
                        {latestJob?.position ?? major ?? parsed?.extractedFields?.major ?? email}
                    </span>
                </div>
            </div>

            {/* ── KINH NGHIỆM GẦN NHẤT ── */}
            {latestJob ? (
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-3">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">
                            {latestJob.position ?? "—"}
                        </span>
                        {(latestJob.startDate || latestJob.endDate) && (
                            <span className="text-[10px] text-white/30 shrink-0">
                                {latestJob.startDate ?? "?"} – {latestJob.endDate ?? "nay"}
                            </span>
                        )}
                    </div>
                    {latestJob.company && (
                        <span className="text-[11px] text-green-400/80 font-semibold">{latestJob.company}</span>
                    )}
                </div>
            ) : (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {major && (
                        <span className="flex items-center gap-1 text-xs text-white/60 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                            🎓 {major}
                        </span>
                    )}
                    {experienceYear != null && experienceYear !== "" && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg">
                            💼 {experienceYear} năm KN
                        </span>
                    )}
                    {salaryExpectation && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                            💰 {salaryExpectation}
                        </span>
                    )}
                </div>
            )}

            {/* ── KỸ NĂNG ── */}
            {displaySkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {displaySkills.map((skill, i) => (
                        <span
                            key={i}
                            className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md"
                        >
                            {skill}
                        </span>
                    ))}
                    {extraCount > 0 && (
                        <span className="text-[11px] text-white/30 px-1 py-0.5">
                            +{extraCount}
                        </span>
                    )}
                </div>
            ) : (
                salaryExpectation && (
                    <div className="mb-4">
                        <span className="flex items-center gap-1 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg w-fit">
                            💰 {salaryExpectation}
                        </span>
                    </div>
                )
            )}

            {/* Footer */}
            {/* Footer — thay completion bằng major + experienceYear */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">

                {/* Bên trái: major + experienceYear */}
                <div className="flex items-center gap-2 flex-wrap">
                    {(major || parsed?.extractedFields?.major) && (
                        <span className="flex items-center gap-1 text-xs text-white/50">
                            🎓 {major ?? parsed.extractedFields.major}
                        </span>
                    )}
                    {(experienceYear != null && experienceYear !== "") && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-400">
                            💼 {experienceYear} năm KN
                        </span>
                    )}
                    {/* fallback nếu cả hai đều null */}
                    {!major && !parsed?.extractedFields?.major && (experienceYear == null || experienceYear === "") && (
                        <span className="text-xs text-white/30 italic">Chưa cập nhật</span>
                    )}
                </div>

                {/* Bên phải: viewCount + button */}
                <div className="flex items-center gap-2">
                    {viewCount !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-white/30">
                            <Eye size={12} />
                            <span className="font-semibold">{viewCount}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeMiniCard;