"use client";
import React from "react";
import Link from "next/link";
import { FaLink, FaGithub, FaLinkedin, FaGlobe, FaExternalLinkAlt } from "react-icons/fa";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";

const ReferenceLink = () => {
    const { profile } = useCandidateProfile();

    // referenceLink có thể là string URL hoặc array 
    // Nếu là string đơn, wrap thành array để render
    const rawLink = profile?.referenceLink;
    const links = rawLink
        ? Array.isArray(rawLink)
            ? rawLink
            : [{ url: rawLink, title: "Trang cá nhân" }]
        : [];

    const getIconForUrl = (url) => {
        if (!url) return <FaLink className="w-5 h-5" />;
        const lower = url.toLowerCase();
        if (lower.includes("github.com")) return <FaGithub className="w-5 h-5 text-gray-800 dark:text-white" />;
        if (lower.includes("linkedin.com")) return <FaLinkedin className="w-5 h-5 text-[#0a66c2]" />;
        return <FaGlobe className="w-5 h-5 text-gray-500" />;
    };

    const formatUrlDisplay = (url) => {
        if (!url) return "";
        return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    };

    const normalizeUrl = (url) => {
        if (!url) return "#";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    return (
        <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
                <FaLink className="text-[#00c853]" />
                Liên kết cá nhân
            </h2>

            <div className="space-y-4">
                {links.length > 0 ? (
                    links.map((link, index) => (
                        <Link
                            key={index}
                            href={normalizeUrl(link.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl bg-background hover:bg-green-50 dark:hover:bg-green-900/20 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-card-bg rounded-full flex items-center justify-center shadow-sm border border-card-border group-hover:scale-110 transition-transform">
                                {getIconForUrl(link.url)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-text-main text-sm">
                                    {link.title || "Trang cá nhân"}
                                </p>
                                <p className="text-text-muted text-xs truncate group-hover:text-[#00c853] transition-colors">
                                    {formatUrlDisplay(link.url)}
                                </p>
                            </div>
                            <FaExternalLinkAlt className="w-3 h-3 text-gray-300 dark:text-gray-600 group-hover:text-[#00c853] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                    ))
                ) : (
                    <div className="py-2 text-center">
                        <p className="text-gray-400 text-sm italic uppercase tracking-tighter">
                            Chưa cập nhật liên kết
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferenceLink;