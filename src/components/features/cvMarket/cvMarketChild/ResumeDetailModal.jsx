"use client";
import { useEffect } from "react";
import {
  X,
  Briefcase,
  GraduationCap,
  DollarSign,
  Eye,
  Calendar,
  CheckCircle2,
  Circle,
  Mail,
  ExternalLink,
  Phone,
  MapPin,
  Link,
} from "lucide-react";
import Badge from "@/components/features/cvMarket/ui/badge";
import { cn } from "@/utils/cnUtils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h4 className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-2.5 transition-colors">
      {title}
    </h4>
    {children}
  </div>
);

const Tag = ({ children, color = "default" }) => {
  // ── CẬP NHẬT MÀU TAG SÁNG/TỐI ──
  const colors = {
    default:
      "bg-slate-100 border-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-white/60",
    green:
      "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400",
    sky: "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400",
    purple:
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors",
        colors[color],
      )}
    >
      {children}
    </span>
  );
};

const ResumeDetailModal = ({ cv, onClose }) => {
  const router = useRouter();
  const { isRecruiter } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const {
    surname,
    name,
    email,
    imgUrl,
    major,
    experienceYear,
    salaryExpectation,
    findJob,
    completion = 0,
    viewCount,
    careerGoal,
    resumeUploadUrl,
    createdAt,
    updatedAt,
    parsedData,
  } = cv;

  const handleViewFullProfile = () => {
    if (isRecruiter) {
      router.push(`/CVMarket/ResumePublicDetail/${cv.resumeId}?mode=recruiter`);
      onClose();
    } else {
      window.open(`/CVMarket/ResumePublicDetail/${cv.resumeId}`, "_blank");
    }
  };

  const parsed =
    typeof parsedData === "string"
      ? (() => {
          try {
            return JSON.parse(parsedData);
          } catch {
            return null;
          }
        })()
      : parsedData;

  const fullName =
    `${surname ?? ""} ${name ?? ""}`.trim() ||
    parsed?.personal?.fullName ||
    email;
  const personal = parsed?.personal ?? null;
  const workExp = parsed?.workExperience ?? [];
  const education = parsed?.education ?? [];
  const skills = parsed?.skills ?? [];
  const certificates = parsed?.certificates ?? [];
  const extracted = parsed?.extractedFields ?? null;

  return (
    <div
      // Nền overlay ngoài cùng
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300",
          // NỀN MODAL
          "bg-white border border-slate-200 shadow-2xl",
          "dark:bg-gradient-to-b dark:from-[#0d2137] dark:to-[#0a1628] dark:border-white/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.6)]",
          // Thanh cuộn
          "scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hiệu ứng ánh sáng góc (Glow) */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-100/50 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none transition-colors" />

        {/* ── HEADER ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-5 pb-4 bg-white/90 dark:bg-[#0d2137]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={
                  imgUrl ||
                  personal?.avatarUrl ||
                  "/images/avatar-placeholder.jpg"
                }
                alt={fullName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-white/10 transition-colors"
              />
              {findJob && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0d2137] shadow-[0_0_6px_#00c853] transition-colors" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-slate-900 dark:text-white transition-colors">
                  {fullName}
                </span>
                {findJob && (
                  <Badge
                    label="Đang tìm việc"
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30 transition-colors"
                  />
                )}
              </div>
              {/* Contact row */}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <a
                  href={`mailto:${email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-600 dark:text-white/40 dark:hover:text-green-400 transition-colors"
                >
                  <Mail size={11} /> {email}
                </a>
                {personal?.phoneNumber && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 transition-colors">
                    <Phone size={11} /> {personal.phoneNumber}
                  </span>
                )}
                {personal?.location && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 transition-colors">
                    <MapPin size={11} /> {personal.location}
                  </span>
                )}
                {personal?.linkedinUrl && (
                  <a
                    href={
                      personal.linkedinUrl.startsWith("http")
                        ? personal.linkedinUrl
                        : `https://${personal.linkedinUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 dark:text-white/40 dark:hover:text-sky-400 transition-colors"
                  >
                    <Link size={11} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
          {/* Nút Đóng */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="px-6 py-5">
          {/* Thông tin chung */}
          <Section title="Thông tin chung">
            <div className="flex flex-wrap gap-2">
              {(major || extracted?.major) && (
                <Tag>
                  <GraduationCap size={12} /> {major ?? extracted.major}
                </Tag>
              )}
              {experienceYear != null && experienceYear !== "" && (
                <Tag color="green">
                  <Briefcase size={12} /> {experienceYear} năm kinh nghiệm
                </Tag>
              )}
              {(salaryExpectation || extracted?.salaryExpectation) && (
                <Tag color="sky">
                  <DollarSign size={12} />{" "}
                  {salaryExpectation ?? extracted.salaryExpectation}
                </Tag>
              )}
              {viewCount !== undefined && (
                <Tag>
                  <Eye size={12} /> {viewCount} lượt xem
                </Tag>
              )}
            </div>
          </Section>

          {/* Mục tiêu nghề nghiệp */}
          {(careerGoal || extracted?.careerGoal) && (
            <Section title="Mục tiêu nghề nghiệp">
              <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed whitespace-pre-line transition-colors">
                {careerGoal ?? extracted.careerGoal}
              </p>
            </Section>
          )}

          {/* Kỹ năng */}
          {skills.length > 0 && (
            <Section title="Kỹ năng">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Tag key={i} color="purple">
                    {skill}
                  </Tag>
                ))}
              </div>
            </Section>
          )}

          {/* Kinh nghiệm */}
          {workExp.length > 0 && (
            <Section title="Kinh nghiệm làm việc">
              <div className="space-y-3">
                {workExp.map((exp, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white transition-colors">
                        {exp.position ?? "—"}
                      </span>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs text-slate-500 dark:text-white/40 shrink-0 transition-colors">
                          {exp.startDate ?? "?"} – {exp.endDate ?? "nay"}
                        </span>
                      )}
                    </div>
                    {exp.company && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold block mb-1.5 transition-colors">
                        {exp.company}
                      </span>
                    )}
                    {exp.description && (
                      <p className="text-xs text-slate-600 dark:text-white/50 leading-relaxed transition-colors">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Học vấn */}
          {education.length > 0 && (
            <Section title="Học vấn">
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white transition-colors">
                        {edu.degree}
                        {edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-white/40 shrink-0 transition-colors">
                        {edu.startDate ?? "?"} –{" "}
                        {edu.isCurrent ? "nay" : (edu.endDate ?? "?")}
                      </span>
                    </div>
                    {edu.schoolName && (
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold transition-colors">
                        {edu.schoolName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Chứng chỉ */}
          {certificates.length > 0 && (
            <Section title="Chứng chỉ">
              <div className="flex flex-wrap gap-2">
                {certificates.map((cert, i) => (
                  <Tag key={i} color="sky">
                    {typeof cert === "string" ? cert : cert.name}
                  </Tag>
                ))}
              </div>
            </Section>
          )}

          {/* ── Xem trang chi tiết ── */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/10 mt-2 mb-4 transition-colors">
            <button
              onClick={handleViewFullProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-green-500/20"
            >
              <ExternalLink size={14} />
              Xem hồ sơ đầy đủ
            </button>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10 mt-2 transition-colors">
            {createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 transition-colors">
                <Calendar size={11} />
                <span>Tạo: {formatDate(createdAt)}</span>
              </div>
            )}
            {updatedAt && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 transition-colors">
                <Calendar size={11} />
                <span>Cập nhật: {formatDate(updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailModal;
