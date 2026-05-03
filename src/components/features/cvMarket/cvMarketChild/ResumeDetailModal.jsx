"use client";

import { useEffect } from "react";
import {
    X, Briefcase, GraduationCap, DollarSign,
    Eye, Calendar, CheckCircle2, Circle,
    Mail, ExternalLink, Phone, MapPin, Link
} from "lucide-react";
import Badge from "@/components/features/cvMarket/ui/badge";
import { cn } from "@/utils/cnUtils";

const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const Section = ({ title, children }) => (
    <div className="mb-5">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">{title}</h4>
        {children}
    </div>
);

const Tag = ({ children, color = "default" }) => {
    const colors = {
        default: "bg-white/5 border-white/10 text-white/60",
        green: "bg-green-500/10 border-green-500/20 text-green-400",
        sky: "bg-sky-500/10 border-sky-500/20 text-sky-400",
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    };
    return (
        <span className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border",
            colors[color]
        )}>
            {children}
        </span>
    );
};

const ResumeDetailModal = ({ cv, onClose }) => {
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const {
        surname, name, email, imgUrl,
        major, experienceYear, salaryExpectation,
        findJob, completion = 0, viewCount,
        careerGoal, resumeUploadUrl,
        createdAt, updatedAt, parsedData,
    } = cv;

    // Parse parsedData an toàn
    const parsed = typeof parsedData === "string"
        ? (() => { try { return JSON.parse(parsedData); } catch { return null; } })()
        : parsedData;

    // Fallback tên từ parsedData.personal nếu surname/name null
    const fullName = `${surname ?? ""} ${name ?? ""}`.trim()
        || parsed?.personal?.fullName
        || email;

    // Các section từ parsedData — dùng đúng key của API
    const personal = parsed?.personal ?? null;
    const workExp = parsed?.workExperience ?? [];       // ← workExperience
    const education = parsed?.education ?? [];
    const skills = parsed?.skills ?? [];
    const certificates = parsed?.certificates ?? [];
    const extracted = parsed?.extractedFields ?? null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={cn(
                    "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto",
                    "bg-gradient-to-b from-[#0d2137] to-[#0a1628]",
                    "border border-white/10 rounded-2xl",
                    "shadow-[0_24px_80px_rgba(0,0,0,0.6)]",
                    "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* ── HEADER ── */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-5 pb-4 bg-[#0d2137]/90 backdrop-blur-md border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <img
                                src={imgUrl || personal?.avatarUrl || "/images/avatar-placeholder.jpg"}
                                alt={fullName}
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10"
                            />
                            {findJob && (
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0d2137] shadow-[0_0_6px_#00c853]" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-bold text-white">{fullName}</span>
                                {findJob && (
                                    <Badge
                                        label="Đang tìm việc"
                                        className="bg-green-500/15 text-green-400 border border-green-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                    />
                                )}
                            </div>
                            {/* Contact row */}
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                <a
                                    href={`mailto:${email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-xs text-white/40 hover:text-green-400 transition-colors"
                                >
                                    <Mail size={11} /> {email}
                                </a>
                                {personal?.phoneNumber && (
                                    <span className="flex items-center gap-1 text-xs text-white/40">
                                        <Phone size={11} /> {personal.phoneNumber}
                                    </span>
                                )}
                                {personal?.location && (
                                    <span className="flex items-center gap-1 text-xs text-white/40">
                                        <MapPin size={11} /> {personal.location}
                                    </span>
                                )}
                                {personal?.linkedinUrl && (
                                    <a
                                        href={personal.linkedinUrl.startsWith("http") ? personal.linkedinUrl : `https://${personal.linkedinUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1 text-xs text-white/40 hover:text-sky-400 transition-colors"
                                    >
                                        <Link size={11} /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
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
                                <Tag><GraduationCap size={12} /> {major ?? extracted.major}</Tag>
                            )}
                            {(experienceYear != null && experienceYear !== "") && (
                                <Tag color="green"><Briefcase size={12} /> {experienceYear} năm kinh nghiệm</Tag>
                            )}
                            {(salaryExpectation || extracted?.salaryExpectation) && (
                                <Tag color="sky"><DollarSign size={12} /> {salaryExpectation ?? extracted.salaryExpectation}</Tag>
                            )}
                            {viewCount !== undefined && (
                                <Tag><Eye size={12} /> {viewCount} lượt xem</Tag>
                            )}
                        </div>
                    </Section>

                    {/* Mục tiêu nghề nghiệp */}
                    {(careerGoal || extracted?.careerGoal) && (
                        <Section title="Mục tiêu nghề nghiệp">
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                                {careerGoal ?? extracted.careerGoal}
                            </p>
                        </Section>
                    )}

                    {/* Kỹ năng */}
                    {skills.length > 0 && (
                        <Section title="Kỹ năng">
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <Tag key={i} color="purple">{skill}</Tag>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Kinh nghiệm — fix: workExperience, position, startDate/endDate, description */}
                    {workExp.length > 0 && (
                        <Section title="Kinh nghiệm làm việc">
                            <div className="space-y-3">
                                {workExp.map((exp, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                                            <span className="text-sm font-bold text-white">
                                                {exp.position ?? "—"}
                                            </span>
                                            {(exp.startDate || exp.endDate) && (
                                                <span className="text-xs text-white/40 shrink-0">
                                                    {exp.startDate ?? "?"} – {exp.endDate ?? "nay"}
                                                </span>
                                            )}
                                        </div>
                                        {exp.company && (
                                            <span className="text-xs text-green-400 font-semibold block mb-1.5">
                                                {exp.company}
                                            </span>
                                        )}
                                        {exp.description && (
                                            <p className="text-xs text-white/50 leading-relaxed">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Học vấn — fix: schoolName, fieldOfStudy, startDate/endDate, isCurrent */}
                    {education.length > 0 && (
                        <Section title="Học vấn">
                            <div className="space-y-3">
                                {education.map((edu, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                                            <span className="text-sm font-bold text-white">
                                                {edu.degree}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
                                            </span>
                                            <span className="text-xs text-white/40 shrink-0">
                                                {edu.startDate ?? "?"} – {edu.isCurrent ? "nay" : (edu.endDate ?? "?")}
                                            </span>
                                        </div>
                                        {edu.schoolName && (
                                            <span className="text-xs text-sky-400 font-semibold">
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
                    <div className="flex justify-end pt-4 border-t border-white/10 mt-2 mb-4">
                        <a
                            href={`/CVMarket/ResumePublicDetail/${cv.resumeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-green-500/20"
                        >
                            <ExternalLink size={14} />
                            Xem hồ sơ đầy đủ
                        </a>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-2">
                        {createdAt && (
                            <div className="flex items-center gap-1.5 text-xs text-white/30">
                                <Calendar size={11} />
                                <span>Tạo: {formatDate(createdAt)}</span>
                            </div>
                        )}
                        {updatedAt && (
                            <div className="flex items-center gap-1.5 text-xs text-white/30">
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