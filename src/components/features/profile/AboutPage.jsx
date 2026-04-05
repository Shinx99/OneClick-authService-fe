"use client";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import React, { useEffect } from "react";
import { FaUserTie } from "react-icons/fa";

const AboutSection = () => {

    const { profile } = useCandidateProfile();

    const displayAbout = profile?.about || "";

    return (
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <FaUserTie className="text-[#00c853]" />
                Giới thiệu bản thân
            </h2>

            <p className="text-gray-700 dark:text-gray-300 break-words">
                {displayAbout}
            </p>
        </div>
    );
};

export default AboutSection;