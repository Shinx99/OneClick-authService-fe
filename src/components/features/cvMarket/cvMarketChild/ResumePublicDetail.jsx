"use client";

import { useState } from "react";
import {
    GraduationCap, DollarSign, Target, Eye,
    CheckCircle2, Circle, Briefcase,
    Code2, Calendar, Building2, ChevronRight,
    Mail, Phone, MapPin, Link, ExternalLink,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getParsed = (raw) => {
    if (!raw) return null;
    if (typeof raw === "object") return raw;
    try { return JSON.parse(raw); } catch { return null; }
};

const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#00c853]/10 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-[#00c853]" />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-text-main leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
    </div>
);

const WorkExperienceSection = ({ entries = [] }) => {
    const [expanded, setExpanded] = useState(null);
    if (entries.length === 0) return null;
    return (
        <div>
            <SectionHeader
                icon={Briefcase}
                title="Kinh nghiệm làm việc"
                subtitle={`${entries.length} vị trí`}
            />
            <div className="space-y-3">
                {entries.map((entry, idx) => (
                    <div key={idx} className="rounded-xl border border-card-border bg-background overflow-hidden">
                        <div
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-card-border/20 transition-colors"
                            onClick={() => setExpanded(expanded === idx ? null : idx)}
                        >
                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00c853]" />
                                {idx < entries.length - 1 && <div className="w-px h-4 bg-[#00c853]/20" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-text-main truncate">
                                    {entry.position ?? "—"}
                                </p>
                                {entry.company && (
                                    <p className="text-xs text-[#00c853] font-bold flex items-center gap-1 mt-0.5">
                                        <Building2 size={10} /> {entry.company}
                                    </p>
                                )}
                            </div>
                            {entry.startDate && (
                                <span className="text-xs text-text-muted font-medium flex items-center gap-1 flex-shrink-0">
                                    <Calendar size={10} />
                                    {entry.startDate}{entry.endDate ? ` – ${entry.endDate}` : " – nay"}
                                </span>
                            )}
                            <ChevronRight
                                size={15}
                                className={`text-text-muted transition-transform flex-shrink-0 ${expanded === idx ? "rotate-90" : ""}`}
                            />
                        </div>
                        {expanded === idx && entry.description && (
                            <div className="px-4 pb-4 pt-3 border-t border-card-border">
                                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                                    {entry.description}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const EducationSection = ({ entries = [] }) => {
    const [expanded, setExpanded] = useState(null);
    if (entries.length === 0) return null;
    return (
        <div>
            <SectionHeader
                icon={GraduationCap}
                title="Học vấn"
                subtitle={`${entries.length} bằng cấp / trường học`}
            />
            <div className="space-y-3">
                {entries.map((entry, idx) => (
                    <div key={idx} className="rounded-xl border border-card-border bg-background overflow-hidden">
                        <div
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-card-border/20 transition-colors"
                            onClick={() => setExpanded(expanded === idx ? null : idx)}
                        >
                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00c853]" />
                                {idx < entries.length - 1 && <div className="w-px h-4 bg-[#00c853]/20" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-text-main truncate">
                                    {entry.degree
                                        ? `${entry.degree}${entry.fieldOfStudy ? ` – ${entry.fieldOfStudy}` : ""}`
                                        : entry.fieldOfStudy ?? "—"}
                                </p>
                                {entry.schoolName && (
                                    <p className="text-xs text-[#00c853] font-bold flex items-center gap-1 mt-0.5">
                                        <Building2 size={10} /> {entry.schoolName}
                                    </p>
                                )}
                            </div>
                            {entry.startDate && (
                                <span className="text-xs text-text-muted font-medium flex items-center gap-1 flex-shrink-0">
                                    <Calendar size={10} />
                                    {entry.startDate}
                                    {entry.isCurrent ? " – nay" : entry.endDate ? ` – ${entry.endDate}` : ""}
                                </span>
                            )}
                            <ChevronRight
                                size={15}
                                className={`text-text-muted transition-transform flex-shrink-0 ${expanded === idx ? "rotate-90" : ""}`}
                            />
                        </div>
                        {expanded === idx && (
                            <div className="px-4 pb-4 pt-3 border-t border-card-border space-y-1">
                                {entry.degree && (
                                    <p className="text-xs text-text-muted">
                                        <span className="font-bold text-text-main">Bằng cấp: </span>
                                        {entry.degree}
                                    </p>
                                )}
                                {entry.fieldOfStudy && (
                                    <p className="text-xs text-text-muted">
                                        <span className="font-bold text-text-main">Chuyên ngành: </span>
                                        {entry.fieldOfStudy}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ResumeDetailContent = ({ cv }) => {
    const {
        surname, name, email, imgUrl,
        major, experienceYear, salaryExpectation,
        findJob, completion = 0, viewCount,
        careerGoal, resumeUploadUrl,
        createdAt, updatedAt, parsedData,
    } = cv;

    const parsed = getParsed(parsedData);
    const personal = parsed?.personal ?? null;
    const workExp = parsed?.workExperience ?? [];
    const education = parsed?.education ?? [];
    const skills = parsed?.skills ?? [];

    const fullName =
        `${surname ?? ""} ${name ?? ""}`.trim() ||
        personal?.fullName ||
        email;

    return (
        <div className="bg-card-bg rounded-[2rem] border border-card-border overflow-hidden shadow-sm">

            <div className="p-8 space-y-8">

                {/* ── Avatar + Info ── */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                        src={imgUrl || personal?.avatarUrl || "/images/avatar-placeholder.jpg"}
                        alt={fullName}
                        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#00c853]/20 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        {/* Tên + badge */}
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h2 className="text-2xl font-black text-text-main">{fullName}</h2>
                            {findJob && (
                                <span className="bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                    Đang tìm việc
                                </span>
                            )}
                        </div>

                        {/* Contact */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
                            {email && (
                                <a href={`mailto:${email}`}
                                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-[#00c853] transition-colors">
                                    <Mail size={13} /> {email}
                                </a>
                            )}
                            {personal?.phoneNumber && (
                                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                                    <Phone size={13} /> {personal.phoneNumber}
                                </span>
                            )}
                            {personal?.location && (
                                <span className="flex items-center gap-1.5 text-sm text-text-muted">
                                    <MapPin size={13} /> {personal.location}
                                </span>
                            )}
                            {personal?.linkedinUrl && (
                                <a
                                    href={personal.linkedinUrl.startsWith("http") ? personal.linkedinUrl : `https://${personal.linkedinUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-sky-400 transition-colors"
                                >
                                    <Link size={13} /> LinkedIn
                                </a>
                            )}
                        </div>

                        {/* Stats badges */}
                        <div className="flex flex-wrap gap-2">
                            {major && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border bg-white/5 border-white/10 text-text-muted">
                                    <GraduationCap size={12} /> {major}
                                </span>
                            )}
                            {experienceYear != null && experienceYear !== "" && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border bg-[#00c853]/10 border-[#00c853]/20 text-[#00c853]">
                                    <Briefcase size={12} /> {experienceYear} năm kinh nghiệm
                                </span>
                            )}
                            {salaryExpectation && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border bg-sky-500/10 border-sky-500/20 text-sky-400">
                                    <DollarSign size={12} /> {salaryExpectation}
                                </span>
                            )}
                            {viewCount !== undefined && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border bg-white/5 border-white/10 text-text-muted">
                                    <Eye size={12} /> {viewCount} lượt xem
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-card-border" />

                {/* ── Mục tiêu nghề nghiệp ── */}
                {careerGoal && (
                    <>
                        <div>
                            <SectionHeader icon={Target} title="Mục tiêu nghề nghiệp" />
                            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                                {careerGoal}
                            </p>
                        </div>
                        <div className="border-t border-card-border" />
                    </>
                )}

                {/* ── Kỹ năng ── */}
                {skills.length > 0 && (
                    <>
                        <div>
                            <SectionHeader icon={Code2} title="Kỹ năng" subtitle={`${skills.length} kỹ năng`} />
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i}
                                        className="inline-flex items-center gap-1.5 pl-3 pr-3 py-1 rounded-full text-xs font-bold bg-[#00c853]/10 text-[#00c853] border border-[#00c853]/25">
                                        <Code2 size={10} /> {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-card-border" />
                    </>
                )}

                {/* ── Kinh nghiệm làm việc ── */}
                {workExp.length > 0 && (
                    <>
                        <WorkExperienceSection entries={workExp} />
                        <div className="border-t border-card-border" />
                    </>
                )}

                {/* ── Học vấn ── */}
                {education.length > 0 && (
                    <>
                        <EducationSection entries={education} />
                        <div className="border-t border-card-border" />
                    </>
                )}

                {/* ── File CV đính kèm ── */}
                {resumeUploadUrl && (
                    <>
                        <div>
                            <SectionHeader icon={ExternalLink} title="File CV đính kèm" />
                            <a
                                href={resumeUploadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-[#00c853] hover:text-[#00a846] bg-[#00c853]/10 hover:bg-[#00c853]/20 border border-[#00c853]/20 px-4 py-2.5 rounded-xl transition-all"
                            >
                                <ExternalLink size={14} /> Xem / Tải CV đính kèm
                            </a>
                        </div>
                        <div className="border-t border-card-border" />
                    </>
                )}

                {/* ── Timestamps ── */}
                <div className="flex items-center gap-4">
                    {createdAt && (
                        <span className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Calendar size={11} /> Tạo: {formatDate(createdAt)}
                        </span>
                    )}
                    {updatedAt && (
                        <span className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Calendar size={11} /> Cập nhật: {formatDate(updatedAt)}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ResumeDetailContent;