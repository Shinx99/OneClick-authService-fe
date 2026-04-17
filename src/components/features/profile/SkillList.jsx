"use client";
import React from "react";
import { FaLightbulb } from "react-icons/fa";

const SkillList = ({ skills = [] }) => {
  return (
    <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2 mb-6">
        <FaLightbulb className="text-[#00c853]" />
        <h2 className="text-xl font-bold text-text-main">Kỹ năng</h2>
      </div>

      {/* Danh sách kỹ năng */}
      <div className="flex flex-wrap gap-3">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold border border-blue-100 dark:border-blue-900/30 shadow-sm"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">
            Chưa có thông tin kỹ năng.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillList;