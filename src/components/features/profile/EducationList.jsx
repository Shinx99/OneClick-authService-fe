"use client";
import React, { useState } from "react";
import { FaGraduationCap, FaExternalLinkAlt, FaImage, FaTimes } from "react-icons/fa";

const EducationList = ({ educations = [] }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.getFullYear();
  };

  return (
    <>
      <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border transition-all">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
          <FaGraduationCap className="text-[#00c853]" />
          Học vấn
        </h2>

        <div className="space-y-5">
          {educations.length > 0 ? (
            educations.map((edu) => (
              <div
                key={edu.educationId}
                className="p-4 bg-background rounded-2xl border border-card-border flex flex-col sm:flex-row gap-4"
              >
                {/* Cột trái: Thông tin học vấn */}
                <div className="flex-1">
                  <h3 className="font-bold text-text-main text-lg">
                    {edu.schoolName}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">
                    {edu.degree && `${edu.degree} • `}{edu.fieldOfStudy}
                  </p>
                  <p className="text-gray-400 text-xs mt-2 italic">
                    {edu.startDate && formatDate(edu.startDate)}
                    {edu.startDate && (edu.endDate || edu.isCurrent) && " — "}
                    {edu.isCurrent
                      ? "Đang theo học"
                      : edu.endDate
                      ? formatDate(edu.endDate)
                      : ""}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-text-muted mt-3 border-t border-card-border pt-3">
                      {edu.description}
                    </p>
                  )}
                </div>

                {/* Cột phải: Ảnh và link tham khảo */}
                <div className="flex flex-col items-end justify-between gap-3 sm:w-32">
                  {/* Ảnh bằng cấp */}
                  {edu.imageUrl ? (
                    <div
                      onClick={() => setPreviewImage(edu.imageUrl)}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-card-border cursor-pointer hover:opacity-80 transition-opacity shadow-sm flex-shrink-0"
                    >
                      <img
                        src={edu.imageUrl}
                        alt="Bằng cấp"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-dashed border-card-border flex items-center justify-center text-gray-400 text-xs">
                      <FaImage size={24} />
                    </div>
                  )}

                  {/* Liên kết tham khảo */}
                  {edu.referenceLink && (
                    <a
                      href={edu.referenceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:underline bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full transition-colors whitespace-nowrap"
                    >
                      <FaExternalLinkAlt size={10} />
                      Liên kết
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-400 text-sm italic">
                Chưa cập nhật thông tin học vấn
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal xem ảnh toàn màn hình */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage}
              alt="Ảnh bằng cấp"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EducationList;