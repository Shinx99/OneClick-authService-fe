"use client";
import React from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

const ExperienceList = ({ experiences = [] }) => {
  return (
    <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-text-main">
          <span className="w-1.5 h-6 bg-[#00c853] rounded-full"></span>
          Kinh nghiệm làm việc
        </h2>
        {/* Nút thêm nhanh - Giữ nguyên logic UI của bạn */}
        <button className="p-2 text-[#00c853] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors active:scale-90">
          <FaPlus />
        </button>
      </div>

      <div className="space-y-8 relative">
        {/* Đường kẻ dọc nối các mốc thời gian (Timeline) */}
        {experiences.length > 1 && (
          <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-card-border"></div>
        )}

        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div key={exp.id} className="relative flex gap-6 group">
              {/* Logo công ty - z-10 để nằm đè lên timeline */}
              <div className="relative w-14 h-14 flex-shrink-0 bg-card-bg rounded-xl border border-card-border p-2 z-10 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src={exp.logo || "/images/company-placeholder.png"}
                  alt={exp.company}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-text-main text-lg group-hover:text-[#00c853] transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-[#00c853] font-semibold text-sm">
                      {exp.company}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 italic">
                      {exp.time}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-text-muted mt-3 leading-relaxed">
                  {exp.desc}
                </p>

                {/* Hiển thị thành tựu nếu có dữ liệu */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {exp.achievements.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-text-muted flex items-start gap-2"
                      >
                        <span className="text-[#00c853] mt-1 flex-shrink-0">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center border border-dashed border-card-border rounded-2xl">
            <p className="text-sm text-gray-400 italic">
              Chưa có thông tin kinh nghiệm làm việc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceList;
