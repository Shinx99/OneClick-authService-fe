"use client";
import React from "react";
import { FaBriefcase } from "react-icons/fa";

const ExperienceList = ({ experiences = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { month: "numeric", year: "numeric" });
  };

  return (
    <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
        <FaBriefcase className="text-[#00c853]" />
        Kinh nghiệm làm việc
      </h2>

      <div className="space-y-5">
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div
              key={exp.experienceId}
              className="p-4 bg-background rounded-2xl border border-card-border"
            >
              <h3 className="font-bold text-text-main text-lg">{exp.headline}</h3>
              <p className="text-[#00c853] font-medium text-sm mt-1">
                {exp.companyName || exp.customCompanyName}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {exp.startDate && formatDate(exp.startDate)}
                {exp.startDate && (exp.endDate || exp.isCurrent) && " — "}
                {exp.isCurrent
                  ? "Hiện tại"
                  : exp.endDate
                  ? formatDate(exp.endDate)
                  : ""}
                {exp.employmentType && ` • ${exp.employmentType}`}
                {exp.employmentLocation && ` • ${exp.employmentLocation}`}
              </p>
              {exp.description && (
                <p className="text-sm text-text-muted mt-3 border-t border-card-border pt-3">
                  {exp.description}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-400 text-sm italic">
              Chưa cập nhật kinh nghiệm làm việc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceList;