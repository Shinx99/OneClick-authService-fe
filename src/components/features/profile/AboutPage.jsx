"use client";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import React, { useEffect } from "react";
import { FaUserTie } from "react-icons/fa";

const AboutSection = () => {

    const { profile } = useCandidateProfile();

    const displayAbout = profile?.about || "";

    return (
        <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
                <FaUserTie className="text-[#00c853]" />
                Giới thiệu bản thân
            </h2>

            <p className="text-text-muted break-words">
                {displayAbout}
            </p>
        </div>
    );
};

export default AboutSection;