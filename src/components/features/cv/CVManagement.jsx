"use client";

import React, { useEffect, useState, useRef } from "react";
import { useResume } from "@/hooks/useResume";
import toast from "react-hot-toast";
import {
    GraduationCap, Clock, DollarSign, FileText,
    ImageIcon, Target, Eye, CheckCircle2, Circle,
    Briefcase, Save, AlertCircle,
    Award, Code2, Calendar, Building2,
    ChevronRight, X, Plus, Trash2, Upload,
} from "lucide-react";
import { FaCamera, FaTimes, FaUpload, FaTrash } from "react-icons/fa";
import Image from "next/image";



// ─── Shared ───────────────────────────────────────────────────────────────────
const COMPLETION_FIELDS = [
    { key: "imgUrl", label: "Ảnh hồ sơ" },
    { key: "major", label: "Chuyên ngành" },
    { key: "salaryExpectation", label: "Mức lương" },
    { key: "experienceYear", label: "Kinh nghiệm" },
    { key: "careerGoal", label: "Mục tiêu nghề nghiệp" },
    //{ key: "resumeUploadUrl", label: "Link CV" },

];

const calcCompletion = (data) => {
    const filled = COMPLETION_FIELDS.filter(
        ({ key }) => data[key] !== "" && data[key] !== null && data[key] !== undefined
    ).length;
    return Math.round((filled / COMPLETION_FIELDS.length) * 100);
};

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-card-border bg-background text-text-main font-medium text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[#00c853]/40 focus:border-[#00c853] transition-all";

// Dùng counter thay Math.random() để tránh hydration mismatch
let _idCounter = 0;
const genId = () => `entry-${++_idCounter}`;

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#00c853]/10 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-[#00c853]" />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-text-main leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
        {action}
    </div>
);

const FieldLabel = ({ children, required }) => (
    <label className="block text-xs font-black text-text-muted uppercase tracking-wide mb-2">
        {children}
        {required && <span className="text-[#00c853] ml-1">*</span>}
    </label>
);

// ─── Skills Section ───────────────────────────────────────────────────────────
const SkillsSection = ({ initialSkills, onChange }) => {
    const [skills, setSkills] = useState(initialSkills ?? []);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (initialSkills && initialSkills.length > 0) {
            setSkills(initialSkills);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialSkills)]);

    const commit = (newSkills) => {
        setSkills(newSkills);
        onChange?.(newSkills);
    };

    const addSkill = () => {
        const trimmed = input.trim();
        if (!trimmed || skills.includes(trimmed)) return;
        commit([...skills, trimmed]);
        setInput("");
        inputRef.current?.focus();
    };

    const removeSkill = (skill) => commit(skills.filter((s) => s !== skill));

    const handleKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); addSkill(); }
        else if (e.key === "Backspace" && input === "" && skills.length > 0) {
            commit(skills.slice(0, -1));
        }
    };

    return (
        <div>
            <SectionHeader icon={Code2} title="Kỹ năng" subtitle="Nhập kỹ năng và nhấn Enter để thêm" />
            <div
                className="min-h-[52px] flex flex-wrap gap-2 p-3 rounded-xl border border-card-border bg-background focus-within:ring-2 focus-within:ring-[#00c853]/40 focus-within:border-[#00c853] transition-all cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {skills.map((skill) => (
                    <span key={skill}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-bold bg-[#00c853]/10 text-[#00c853] border border-[#00c853]/25">
                        <Code2 size={10} />
                        {skill}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#00c853]/20 transition-colors"
                            aria-label={`Xóa ${skill}`}
                        >
                            <X size={9} />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={skills.length === 0 ? "VD: React, TypeScript, Node.js..." : "Thêm kỹ năng..."}
                    className="flex-1 min-w-[160px] bg-transparent text-sm font-medium text-text-main placeholder:text-text-muted/50 focus:outline-none py-1"
                />
            </div>
            {input.trim() && (
                <button type="button" onClick={addSkill}
                    className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#00c853] hover:underline">
                    <Plus size={12} /> Thêm "{input.trim()}"
                </button>
            )}
            {skills.length > 0 && (
                <p className="mt-2 text-xs text-text-muted">{skills.length} kỹ năng đã thêm</p>
            )}
        </div>
    );
};

// ─── Work Experience Section ──────────────────────────────────────────────────
const WorkExperienceSection = ({ initialEntries, onChange }) => {
    const hydrate = (arr) => arr.map((e) => ({ ...e, id: e.id ?? genId() }));

    const [entries, setEntries] = useState([]);
    const [expanded, setExpanded] = useState(null);

    // Chỉ seed 1 lần sau mount để tránh hydration mismatch (genId dùng counter)
    useEffect(() => {
        if (initialEntries && initialEntries.length > 0) {
            setEntries(hydrate(initialEntries));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialEntries)]);

    const commit = (newEntries) => {
        setEntries(newEntries);
        // Strip UI-only `id` trước khi trả về onChange
        onChange?.(newEntries.map(({ id, ...rest }) => rest));
    };

    const addEntry = () => {
        const id = genId();
        const newEntry = { id, company: "", position: "", startDate: "", endDate: "", description: "" };
        const updated = [...entries, newEntry];
        setEntries(updated);
        setExpanded(id);
    };

    const removeEntry = (id) => {
        commit(entries.filter((e) => e.id !== id));
        if (expanded === id) setExpanded(null);
    };

    const update = (id, field, value) => {
        commit(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    return (
        <div>
            <SectionHeader
                icon={Briefcase}
                title="Kinh nghiệm làm việc"
                subtitle={entries.length > 0 ? `${entries.length} vị trí` : "Thêm kinh nghiệm làm việc"}
                action={
                    <button type="button" onClick={addEntry}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00c853]/10 text-[#00c853] text-xs font-black border border-[#00c853]/20 hover:bg-[#00c853]/20 transition-colors flex-shrink-0">
                        <Plus size={12} /> Thêm
                    </button>
                }
            />

            {entries.length === 0 ? (
                <div
                    onClick={addEntry}
                    className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-card-border text-text-muted hover:border-[#00c853]/40 hover:text-[#00c853] transition-all cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-card-border/60 group-hover:bg-[#00c853]/10 flex items-center justify-center transition-colors">
                        <Briefcase size={18} />
                    </div>
                    <p className="text-sm font-bold">Chưa có kinh nghiệm làm việc</p>
                    <p className="text-xs">Nhấn để thêm vị trí đầu tiên</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry, idx) => (
                        <div key={entry.id} className="rounded-xl border border-card-border bg-background overflow-hidden">
                            {/* Header accordion */}
                            <div
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-card-border/20 transition-colors"
                                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                            >
                                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00c853]" />
                                    {idx < entries.length - 1 && <div className="w-px h-4 bg-[#00c853]/20" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-text-main truncate">
                                        {entry.position || <span className="text-text-muted/60 font-normal">Chức danh...</span>}
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
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                                        aria-label="Xóa"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    <ChevronRight size={15}
                                        className={`text-text-muted transition-transform ${expanded === entry.id ? "rotate-90" : ""}`} />
                                </div>
                            </div>

                            {/* Body accordion */}
                            {expanded === entry.id && (
                                <div className="px-4 pb-4 pt-1 border-t border-card-border space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <FieldLabel>Chức danh / Vị trí</FieldLabel>
                                            <div className="relative">
                                                <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="text" placeholder="VD: Frontend Developer"
                                                    value={entry.position ?? ""}
                                                    onChange={(e) => update(entry.id, "position", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Công ty</FieldLabel>
                                            <div className="relative">
                                                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="text" placeholder="VD: FPT Software"
                                                    value={entry.company ?? ""}
                                                    onChange={(e) => update(entry.id, "company", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Ngày bắt đầu</FieldLabel>
                                            <div className="relative">
                                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="month" value={entry.startDate ?? ""}
                                                    onChange={(e) => update(entry.id, "startDate", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Ngày kết thúc</FieldLabel>
                                            <div className="relative">
                                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="month" value={entry.endDate ?? ""}
                                                    onChange={(e) => update(entry.id, "endDate", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <FieldLabel>Mô tả công việc</FieldLabel>
                                        <textarea
                                            rows={3}
                                            placeholder="Mô tả trách nhiệm, thành tích nổi bật..."
                                            value={entry.description ?? ""}
                                            onChange={(e) => update(entry.id, "description", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-text-main font-medium text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[#00c853]/40 focus:border-[#00c853] transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Education Section ────────────────────────────────────────────────────────
const EducationSection = ({ initialEntries, onChange }) => {
    const hydrate = (arr) => arr.map((e) => ({ ...e, id: e.id ?? genId() }));

    const [entries, setEntries] = useState([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        if (initialEntries && initialEntries.length > 0) {
            setEntries(hydrate(initialEntries));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialEntries)]);

    const commit = (newEntries) => {
        setEntries(newEntries);
        onChange?.(newEntries.map(({ id, ...rest }) => rest));
    };

    const addEntry = () => {
        const id = genId();
        const newEntry = { id, schoolName: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", isCurrent: false };
        setEntries((prev) => [...prev, newEntry]);
        setExpanded(id);
    };

    const removeEntry = (id) => {
        commit(entries.filter((e) => e.id !== id));
        if (expanded === id) setExpanded(null);
    };

    const update = (id, field, value) => {
        commit(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    return (
        <div>
            <SectionHeader
                icon={GraduationCap}
                title="Học vấn"
                subtitle={entries.length > 0 ? `${entries.length} bằng cấp / trường học` : "Thêm thông tin học vấn"}
                action={
                    <button type="button" onClick={addEntry}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00c853]/10 text-[#00c853] text-xs font-black border border-[#00c853]/20 hover:bg-[#00c853]/20 transition-colors flex-shrink-0">
                        <Plus size={12} /> Thêm
                    </button>
                }
            />

            {entries.length === 0 ? (
                <div
                    onClick={addEntry}
                    className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-card-border text-text-muted hover:border-[#00c853]/40 hover:text-[#00c853] transition-all cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-card-border/60 group-hover:bg-[#00c853]/10 flex items-center justify-center transition-colors">
                        <GraduationCap size={18} />
                    </div>
                    <p className="text-sm font-bold">Chưa có thông tin học vấn</p>
                    <p className="text-xs">Nhấn để thêm trường học / bằng cấp</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry, idx) => (
                        <div key={entry.id} className="rounded-xl border border-card-border bg-background overflow-hidden">
                            {/* Header accordion */}
                            <div
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-card-border/20 transition-colors"
                                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                            >
                                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00c853]" />
                                    {idx < entries.length - 1 && <div className="w-px h-4 bg-[#00c853]/20" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-text-main truncate">
                                        {entry.degree
                                            ? `${entry.degree}${entry.fieldOfStudy ? ` – ${entry.fieldOfStudy}` : ""}`
                                            : entry.fieldOfStudy
                                            || <span className="text-text-muted/60 font-normal">Bằng cấp / Chuyên ngành...</span>
                                        }
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
                                        {entry.startDate}{entry.isCurrent ? " – nay" : entry.endDate ? ` – ${entry.endDate}` : ""}
                                    </span>
                                )}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                                        aria-label="Xóa"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    <ChevronRight size={15}
                                        className={`text-text-muted transition-transform ${expanded === entry.id ? "rotate-90" : ""}`} />
                                </div>
                            </div>

                            {/* Body accordion */}
                            {expanded === entry.id && (
                                <div className="px-4 pb-4 pt-1 border-t border-card-border space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <FieldLabel>Bằng cấp</FieldLabel>
                                            <div className="relative">
                                                <Award size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="text" placeholder="VD: Bachelor's Degree"
                                                    value={entry.degree ?? ""}
                                                    onChange={(e) => update(entry.id, "degree", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Chuyên ngành</FieldLabel>
                                            <div className="relative">
                                                <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="text" placeholder="VD: Software Development"
                                                    value={entry.fieldOfStudy ?? ""}
                                                    onChange={(e) => update(entry.id, "fieldOfStudy", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Trường / Cơ sở đào tạo</FieldLabel>
                                            <div className="relative">
                                                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="text" placeholder="VD: FPT Polytechnic College"
                                                    value={entry.schoolName ?? ""}
                                                    onChange={(e) => update(entry.id, "schoolName", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Năm bắt đầu</FieldLabel>
                                            <div className="relative">
                                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input type="text" placeholder="VD: 2024"
                                                    value={entry.startDate ?? ""}
                                                    onChange={(e) => update(entry.id, "startDate", e.target.value)}
                                                    className={`${inputCls} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Năm tốt nghiệp</FieldLabel>
                                            <div className="relative">
                                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                <input
                                                    type="text"
                                                    placeholder="VD: 2027 (để trống nếu đang học)"
                                                    value={entry.endDate ?? ""}
                                                    disabled={entry.isCurrent}
                                                    onChange={(e) => update(entry.id, "endDate", e.target.value)}
                                                    className={`${inputCls} pl-10 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                                <div
                                                    onClick={() => update(entry.id, "isCurrent", !entry.isCurrent)}
                                                    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${entry.isCurrent ? "bg-[#00c853]" : "bg-card-border"}`}
                                                >
                                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${entry.isCurrent ? "translate-x-5" : "translate-x-0.5"}`} />
                                                </div>
                                                <span className="text-xs font-bold text-text-muted">Đang theo học</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// -------------------------------------------------------------------------
// MODAL XEM / THAY ẢNH
// -------------------------------------------------------------------------
const ImageModal = ({ isOpen, onClose, imageUrl, title, onUpload, onDelete, isUpdating }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-card-bg rounded-3xl overflow-hidden shadow-2xl w-[95vw] max-w-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
                    <h3 className="font-black text-text-main text-lg">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-card-border transition-all"
                    >
                        <FaTimes className="text-text-muted w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Ảnh full */}
                <div className="relative w-full aspect-video min-h-[400px] bg-background">
                    <Image
                        src={imageUrl || "/images/avatar-placeholder.jpg"}
                        alt={title}
                        fill
                        className="object-contain"
                        // optional chaining tránh crash khi imageUrl undefined
                        unoptimized={imageUrl?.startsWith("blob:") ?? false}
                    />
                    {isUpdating && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="px-6 py-5 flex items-center justify-between gap-4 border-t border-card-border">
                    <p className="text-sm text-text-muted">
                        Hỗ trợ JPG, PNG, WEBP. Tối đa 2MB.
                    </p>
                    <div className="flex items-center gap-2">
                        {imageUrl && imageUrl !== "/images/avatar-placeholder.jpg" && (
                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => onDelete?.()}
                                className="flex items-center gap-2 px-4 py-2.5 border border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-black rounded-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                            >
                                <FaTrash className="w-3.5 h-3.5" />
                                Xóa ảnh
                            </button>
                        )}
                        <button
                            disabled={isUpdating}
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#00c853] hover:bg-[#00a846] text-white font-black rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                        >
                            <FaUpload className="w-4 h-4" />
                            {isUpdating ? "Đang tải lên..." : "Thay đổi ảnh"}
                        </button>
                    </div>

                    {/*THÊM input bị thiếu */}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) onUpload(file);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};



// ─── Main Component ───────────────────────────────────────────────────────────
const ResumeInfoForm = () => {
    const { resume, isLoading, isUpdating, updateCover, deleteCover, updateResume } = useResume();

    const [avatarDragging, setAvatarDragging] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("/images/avatar-placeholder.jpg");
    const prevAvatarRef = useRef(avatarPreview);
    const activeBlobRef = useRef(null);
    const seeded = useRef(false);

    const [formData, setFormData] = useState({
        careerGoal: "",
        major: "",
        experienceYear: "",
        salaryExpectation: "",
        imgUrl: "",
        findJob: true,
    });

    const [modal, setModal] = useState({ open: false, type: null });

    const [skills, setSkills] = useState([]);
    const [workExperience, setWorkExperience] = useState([]);
    const [education, setEducation] = useState([]);

    // Sync từ server
    useEffect(() => {
        if (resume) {
            if (resume.imgUrl) {
                setAvatarPreview(resume.imgUrl);
                prevAvatarRef.current = resume.imgUrl;
            }
        }
    }, [resume]);

    // Cleanup blob URLs
    useEffect(() => {
        return () => {
            if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    // Handle Avatar Upload
    const handleAvatarUpload = async (file) => {
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ảnh không được vượt quá 2MB");
            return;
        }

        if (activeBlobRef.current) {
            URL.revokeObjectURL(activeBlobRef.current);
            activeBlobRef.current = null;
        }

        const objectUrl = URL.createObjectURL(file);
        activeBlobRef.current = objectUrl;
        prevAvatarRef.current = avatarPreview;

        setAvatarPreview(objectUrl);
        setFormData((prev) => ({ ...prev, imgUrl: objectUrl }));

        try {

            const result = await updateCover(file);

            if (result?.success && result.url) {
                setAvatarPreview(result.url);
                setFormData((prev) => ({ ...prev, imgUrl: result.url }));
                URL.revokeObjectURL(objectUrl);
                activeBlobRef.current = null;
                // đóng modal sau khi upload thành công (để spinner kịp hiển thị)
                setModal({ open: false, type: null });
                toast.success("Tải ảnh lên thành công");
            } else {
                setAvatarPreview(prevAvatarRef.current);
                setFormData((prev) => ({ ...prev, imgUrl: prevAvatarRef.current }));
                URL.revokeObjectURL(objectUrl);
                activeBlobRef.current = null;
                toast.error("Tải ảnh thất bại, thử lại sau");
            }
        } catch (err) {
            setAvatarPreview(prevAvatarRef.current);
            setFormData((prev) => ({ ...prev, imgUrl: prevAvatarRef.current }));
            URL.revokeObjectURL(objectUrl);
            activeBlobRef.current = null;
            toast.error("Lỗi không xác định khi tải ảnh");
            console.error(err);
        }
    };


    // Handle Avatar Delete
    const handleAvatarDelete = async () => {

        const result = await deleteCover();

        if (result?.success) {
            setAvatarPreview("/images/avatar-placeholder.jpg");
            setFormData((prev) => ({ ...prev, imgUrl: "" }));
            setModal({ open: false, type: null });
            toast.success("Đã xóa ảnh đại diện");
        } else {
            toast.error("Xóa ảnh thất bại, thử lại sau");
        }
    }

    // Seed state từ API response
    useEffect(() => {
        if (!resume || seeded.current) return;
        seeded.current = true;

        setFormData({
            careerGoal: resume.careerGoal ?? "",
            major: resume.major ?? "",
            experienceYear: resume.experienceYear ?? "",
            salaryExpectation: resume.salaryExpectation ?? "",
            imgUrl: resume.imgUrl ?? "",
            findJob: resume.findJob ?? false,
        });

        const pd = resume.parsedData ?? {};
        if (pd.skills?.length) setSkills(pd.skills);
        const validWork = (pd.workExperience ?? []).filter(
            (w) => w.company || w.position || w.description
        );
        setWorkExperience(validWork);
        setEducation(pd.education ?? []);
    }, [resume]);

    const handleChange = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleStatusChange = (value) =>
        setFormData((prev) => ({ ...prev, findJob: value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            careerGoal: formData.careerGoal || null,
            major: formData.major || null,
            experienceYear: formData.experienceYear !== "" ? Number(formData.experienceYear) : null,
            salaryExpectation: formData.salaryExpectation || null,
            imgUrl: formData.imgUrl || null,
            findJob: formData.findJob ?? false,
            parsedData: {
                ...(resume?.parsedData ?? {}),
                skills,
                workExperience,
                education,
            },
        };
        const result = await updateResume(payload);
        if (result?.success) toast.success("Cập nhật hồ sơ thành công!");
    };

    const completion = calcCompletion({ ...formData, resumeUploadUrl: resume?.resumeUploadUrl });

    if (isLoading) {
        return (
            <div className="bg-card-bg rounded-[2rem] border border-card-border overflow-hidden">
                <div className="h-1.5 bg-card-border w-full" />
                <div className="p-8 space-y-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-14 rounded-xl bg-card-border/60" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Modal xem avatar */}
            <ImageModal
                isOpen={modal.open && modal.type === "avatar"}
                onClose={() => setModal({ open: false, type: null })}
                imageUrl={avatarPreview || "/images/avatar-placeholder.jpg"}
                title="Ảnh đại diện"
                onUpload={handleAvatarUpload}
                onDelete={handleAvatarDelete}
                isUpdating={isUpdating}
            />

            <form onSubmit={onSubmit}
                className="bg-card-bg rounded-[2rem] border border-card-border overflow-hidden shadow-sm">

                {/* Progress bar */}
                <div className="h-1.5 bg-card-border w-full">
                    <div
                        className="h-full bg-gradient-to-r from-[#00c853] to-[#00e676] transition-all duration-700"
                        style={{ width: `${completion}%` }}
                    />
                </div>

                <div className="p-8">

                    {/* ── Top bar ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-text-main tracking-tight">Hồ sơ ứng viên</h2>
                            <p className="text-sm text-text-muted mt-0.5">
                                Thông tin được sử dụng để matching với nhà tuyển dụng
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00c853]/10 border border-[#00c853]/20">
                                {completion === 100
                                    ? <CheckCircle2 size={14} className="text-[#00c853]" />
                                    : <Circle size={14} className="text-[#00c853]" />}
                                <span className="text-xs font-black text-[#00c853]">{completion}% hoàn thiện</span>
                            </div>
                            {resume?.viewCount !== undefined && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-card-border">
                                    <Eye size={14} className="text-text-muted" />
                                    <span className="text-xs font-black text-text-muted">{resume.viewCount}</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#00c853] text-white text-sm font-black rounded-xl hover:bg-[#00a846] transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Save size={15} />
                                {isUpdating ? "Đang lưu..." : "Lưu hồ sơ"}
                            </button>
                        </div>
                    </div>

                    {/* ── Completion checklist ── */}
                    <div className="flex flex-wrap gap-2 mb-8 p-4 rounded-2xl bg-background border border-card-border">
                        {COMPLETION_FIELDS.map(({ key, label }) => {
                            const val = key === "resumeUploadUrl" ? resume?.resumeUploadUrl : formData[key];
                            const done = val !== "" && val !== null && val !== undefined;
                            return (
                                <span key={key}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${done
                                        ? "bg-[#00c853]/10 text-[#00c853] border border-[#00c853]/20"
                                        : "bg-card-border/40 text-text-muted border border-card-border"
                                        }`}>
                                    {done ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                                    {label}
                                </span>
                            );
                        })}
                    </div>

                    {/* ══ SECTION 0 — Image ══ */}
                    <div className="mb-8">
                        <SectionHeader
                            icon={FileText}
                            title="Ảnh đại diện hồ sơ"
                            subtitle="Ảnh đại diện hiển thị trên hồ sơ"
                        />

                        <div className="flex items-center gap-6">
                            <div
                                className={`relative w-36 h-36 lg:w-52 lg:h-52 xl:w-56 xl:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-white/50 cursor-pointer transition-all flex-shrink-0
                ${avatarDragging ? "ring-[#00c853]/50 scale-105" : ""}
                ${isUpdating ? "opacity-70 pointer-events-none" : ""}`}
                                onClick={() => setModal({ open: true, type: "avatar" })}
                                onDragOver={(e) => { e.preventDefault(); setAvatarDragging(true); }}
                                onDragLeave={() => setAvatarDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setAvatarDragging(false);
                                    handleAvatarUpload(e.dataTransfer.files[0]);
                                }}
                            >
                                <Image
                                    src={avatarPreview || "/images/avatar-placeholder.jpg"}
                                    alt="Avatar"
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-300"
                                    unoptimized={avatarPreview?.startsWith("blob:")}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-end p-2 opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="bg-[#00c853] p-1.5 rounded-full border-2 border-white">
                                        <FaCamera className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-sm text-text-muted">
                                <p className="font-semibold text-text-main">Ảnh đại diện hồ sơ</p>
                                <p>Nhấn vào ảnh để xem hoặc thay đổi</p>
                                <p>Kéo thả ảnh trực tiếp vào khung</p>
                                <p className="text-xs text-text-muted/60">PNG, JPG, WebP · Tối đa 2MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-card-border mb-8" />

                    {/* ══ SECTION 1 — Chuyên môn ══ */}
                    <div className="mb-8">
                        <SectionHeader icon={Briefcase} title="Thông tin chuyên môn"
                            subtitle="Nền tảng học vấn và kinh nghiệm làm việc" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel>Chuyên ngành</FieldLabel>
                                <div className="relative">
                                    <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                    <input type="text" placeholder="VD: Công nghệ thông tin"
                                        value={formData.major} onChange={handleChange("major")}
                                        className={`${inputCls} pl-10`} />
                                </div>
                            </div>
                            <div>
                                <FieldLabel>Số năm kinh nghiệm</FieldLabel>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                    <input type="number" min="0" max="99" step="0.5" placeholder="VD: 2.5"
                                        value={formData.experienceYear} onChange={handleChange("experienceYear")}
                                        className={`${inputCls} pl-10`} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-card-border mb-8" />

                    {/* ══ SECTION 2 — Kỳ vọng ══ */}
                    <div className="mb-8">
                        <SectionHeader icon={Target} title="Kỳ vọng & Trạng thái hồ sơ"
                            subtitle="Nhà tuyển dụng dùng thông tin này để lọc ứng viên phù hợp" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel>Mức lương kỳ vọng</FieldLabel>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                    <input type="text" placeholder="VD: 15 - 20 triệu VNĐ"
                                        value={formData.salaryExpectation} onChange={handleChange("salaryExpectation")}
                                        className={`${inputCls} pl-10`} />
                                </div>
                            </div>
                            <div>
                                <FieldLabel>Cho phép nhà tuyển dụng tìm thấy hồ sơ này</FieldLabel>
                                <div className="flex gap-2">
                                    {[
                                        { label: "Cho phép", value: true, dot: "bg-[#00c853]", activeClass: "bg-[#00c853]/10 border-[#00c853] text-[#00c853]" },
                                        { label: "Không cho phép", value: false, dot: "bg-gray-400", activeClass: "bg-gray-100 border-gray-400 text-gray-600" },
                                    ].map(({ label, value, dot, activeClass }) => {
                                        const isSelected = formData.findJob === value;
                                        return (
                                            <button key={value} type="button" onClick={() => handleStatusChange(value)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black border-2 transition-all active:scale-95 ${isSelected ? activeClass : "bg-background text-text-muted border-card-border hover:border-card-border/80"}`}>
                                                <span className={`w-2 h-2 rounded-full ${isSelected ? dot : "bg-text-muted/30"}`} />
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-card-border mb-8" />

                    <div className="border-t border-card-border mb-8" />

                    {/* ══ SECTION 3 — Kỹ năng ══ */}
                    <div className="mb-8">
                        <SkillsSection initialSkills={skills} onChange={setSkills} />
                    </div>
                    <div className="border-t border-card-border mb-8" />

                    {/* ══ SECTION 4 — Kinh nghiệm làm việc ══ */}
                    <div className="mb-8">
                        <WorkExperienceSection initialEntries={workExperience} onChange={setWorkExperience} />
                    </div>
                    <div className="border-t border-card-border mb-8" />

                    {/* ══ SECTION 5 — Học vấn ══ */}
                    <div className="mb-8">
                        <EducationSection initialEntries={education} onChange={setEducation} />
                    </div>
                    <div className="border-t border-card-border mb-8" />

                    {/* ══ SECTION 6 — Mục tiêu nghề nghiệp ══ */}
                    <div>
                        <SectionHeader icon={Target} title="Mục tiêu nghề nghiệp"
                            subtitle="Hiển thị nổi bật đầu tiên khi nhà tuyển dụng xem hồ sơ" />
                        <textarea
                            rows={6}
                            value={formData.careerGoal}
                            onChange={handleChange("careerGoal")}
                            maxLength={1000}
                            placeholder="Nêu rõ mục tiêu ngắn hạn, dài hạn và định hướng phát triển của bạn..."
                            className="w-full px-4 py-4 rounded-xl border border-card-border bg-background text-text-main font-medium text-sm leading-relaxed placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[#00c853]/40 focus:border-[#00c853] transition-all resize-none min-h-[160px]"
                        />
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-text-muted flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-[#00c853]" />
                                Mục tiêu rõ ràng giúp tăng 3× cơ hội được nhà tuyển dụng liên hệ
                            </p>
                            <span className={`text-xs font-bold tabular-nums ${(formData.careerGoal?.length ?? 0) > 900 ? "text-red-500" : "text-text-muted"}`}>
                                {formData.careerGoal?.length ?? 0}/1000
                            </span>
                        </div>
                    </div>

                </div>
            </form>
        </>
    );
};

export default ResumeInfoForm;
