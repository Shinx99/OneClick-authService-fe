"use client";
import React from "react";
import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";

const EducationList = ({ education = [] }) => {
  return (
    <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
        <FaGraduationCap className="text-[#00c853]" />
        Học vấn
      </h2>

      <div className="space-y-6">
        {education.length > 0 ? (
          education.map((edu) => (
            <div key={edu.id} className="flex gap-6 items-start">
              {/* Logo trường học */}
              <div className="relative w-14 h-14 flex-shrink-0 bg-background rounded-xl overflow-hidden border border-card-border p-2">
                <Image
                  src={edu.logo || "/images/school-placeholder.png"}
                  alt={edu.school}
                  fill
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-text-main text-lg">
                      {edu.school}
                    </h3>
                    <p className="text-text-muted text-sm">
                      {edu.major}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 italic">
                      {edu.time} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Hiển thị khi chưa có dữ liệu học vấn */
          <div className="py-4 text-center">
            <p className="text-gray-400 text-sm italic uppercase tracking-tighter">
              Chưa cập nhật thông tin học vấn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationList;
