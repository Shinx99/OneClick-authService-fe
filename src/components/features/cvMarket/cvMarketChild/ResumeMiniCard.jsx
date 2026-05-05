import { cn } from "@/utils/cnUtils";
import Badge from "@/components/features/cvMarket/ui/badge";
import { Eye } from "lucide-react";

const getParsed = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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
  const latestJob = parsed?.workExperience?.[0] ?? null;
  const topSkills = parsed?.extractedFields?.topSkills ?? [];
  const allSkills = parsed?.skills ?? [];
  const MAX_DISPLAY = 10;
  const displaySkills =
    topSkills.length > 0
      ? topSkills.slice(0, MAX_DISPLAY)
      : allSkills.slice(0, MAX_DISPLAY);
  const extraCount = allSkills.length - displaySkills.length;

  const displayName = name?.trim() || parsed?.personal?.fullName || email;

  return (
    <div
      className={cn(
        "relative group flex flex-col rounded-2xl p-5 w-full overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1",
        // LIGHT THEME
        "bg-white border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-green-500 hover:bg-slate-50/50",
        // DARK THEME
        "dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_32px_rgba(0,200,83,0.15)] dark:hover:border-green-500/40 dark:hover:bg-white/8",
      )}
      onClick={onViewDetail}
    >
      {/* Header — avatar + tên */}
      <div className="flex gap-3 mb-3 items-start">
        <div className="relative shrink-0">
          <img
            src={
              avatar ||
              parsed?.personal?.avatarUrl ||
              "/images/avatar-placeholder.jpg"
            }
            alt={displayName}
            className="w-11 h-11 rounded-xl object-cover ring-2 transition-all ring-slate-100 group-hover:ring-green-500/30 dark:ring-white/10 dark:group-hover:ring-green-500/30"
          />
          {findJob && (
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 shadow-[0_0_6px_rgba(34,197,94,0.4)] border-white dark:border-[#0d2137]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-[15px] font-bold truncate text-slate-900 dark:text-white">
              {displayName}
            </span>
            {findJob && (
              <Badge
                label="Đang tìm việc"
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30"
              />
            )}
          </div>
          <span className="text-xs truncate block text-slate-500 dark:text-white/40">
            {latestJob?.position ??
              major ??
              parsed?.extractedFields?.major ??
              email}
          </span>
        </div>
      </div>

      {/* ── KINH NGHIỆM GẦN NHẤT ── */}
      {latestJob ? (
        <div className="rounded-xl px-3 py-2.5 mb-3 bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/10">
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <span className="text-xs font-bold truncate text-slate-800 dark:text-white">
              {latestJob.position ?? "—"}
            </span>
            {(latestJob.startDate || latestJob.endDate) && (
              <span className="text-[10px] shrink-0 text-slate-400 dark:text-white/30">
                {latestJob.startDate ?? "?"} – {latestJob.endDate ?? "nay"}
              </span>
            )}
          </div>
          {latestJob.company && (
            <span className="text-[11px] font-semibold text-green-600 dark:text-green-400/80">
              {latestJob.company}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {major && (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-white/60">
              🎓 {major}
            </span>
          )}
          {experienceYear != null && experienceYear !== "" && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400">
              💼 {experienceYear} năm KN
            </span>
          )}
          {salaryExpectation && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400">
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
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-600 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-300"
            >
              {skill}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-[11px] px-1 py-0.5 text-slate-400 dark:text-white/30">
              +{extraCount}
            </span>
          )}
        </div>
      ) : (
        salaryExpectation && (
          <div className="mb-4">
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit bg-sky-50 border border-sky-200 text-sky-600 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400">
              💰 {salaryExpectation}
            </span>
          </div>
        )
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          {(major || parsed?.extractedFields?.major) && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/50">
              🎓 {major ?? parsed.extractedFields.major}
            </span>
          )}
          {experienceYear != null && experienceYear !== "" && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
              💼 {experienceYear} năm KN
            </span>
          )}
          {!major &&
            !parsed?.extractedFields?.major &&
            (experienceYear == null || experienceYear === "") && (
              <span className="text-xs italic text-slate-400 dark:text-white/30">
                Chưa cập nhật
              </span>
            )}
        </div>
        <div className="flex items-center gap-2">
          {viewCount !== undefined && (
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-white/30">
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
