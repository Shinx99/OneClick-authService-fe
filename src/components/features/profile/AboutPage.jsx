"use client";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import React, { useState, useRef, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";

const AboutSection = () => {
  const { profile } = useCandidateProfile();
  const displayAbout = profile?.about || "";

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Kiểm tra xem nội dung có bị tràn (cao hơn 3 dòng) không
      const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 3; // 3 dòng
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [displayAbout]);

  return (
    <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
        <FaUserTie className="text-[#00c853]" />
        Giới thiệu bản thân
      </h2>

      <div className="relative">
        <p
          ref={contentRef}
          className={`text-text-muted break-words whitespace-pre-wrap ${
            !isExpanded ? "line-clamp-3" : ""
          }`}
        >
          {displayAbout}
        </p>

        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-[#00c853] hover:underline focus:outline-none"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutSection;