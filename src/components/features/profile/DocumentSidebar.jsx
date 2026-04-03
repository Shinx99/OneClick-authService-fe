"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaRegFilePdf,
  FaCheckCircle,
  FaArrowRight,
  FaSpinner,
  FaEye,
  FaDownload,
  FaTimes,
} from "react-icons/fa";
import { resumeService } from "@/services/resume.service";

const DocumentSidebar = ({ isPublicView = false, candidateId = null }) => {
  const [defaultCV, setDefaultCV] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý việc mở pop-up xem nhanh PDF
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchDefaultCV = async () => {
      try {
        const data =
          isPublicView && candidateId
            ? await resumeService.getCandidateDefaultCV(candidateId)
            : await resumeService.getResumes();

        const currentDefault = Array.isArray(data)
          ? data.find((doc) => doc.isDefault)
          : data;
        setDefaultCV(currentDefault || null);
      } catch (error) {
        console.error("Lỗi khi lấy CV:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDefaultCV();
  }, [isPublicView, candidateId]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] shadow-sm border border-gray-100 flex justify-center py-10">
        <FaSpinner className="animate-spin text-[#00c853] text-2xl" />
      </div>
    );
  }

  // Ẩn luôn nếu là NTD xem mà ứng viên không có CV
  if (isPublicView && !defaultCV) return null;

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white uppercase text-xs tracking-widest">
        <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span>
        {isPublicView ? "Hồ sơ đính kèm" : "CV Mặc Định"}
      </h3>

      {defaultCV ? (
        <div className="relative flex flex-col p-4 border-2 border-[#00c853] bg-green-50/50 dark:bg-green-900/10 rounded-2xl shadow-sm">
          {/* Thông tin CV */}
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-[#00c853] text-white mr-3 shadow-md">
              <FaRegFilePdf size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                {defaultCV.name}
              </p>
              {!isPublicView && (
                <span className="flex items-center gap-1 text-[10px] text-[#00c853] font-black uppercase tracking-tighter mt-1">
                  <FaCheckCircle size={8} /> Đang dùng để ứng tuyển
                </span>
              )}
            </div>
          </div>

          {/* Cụm nút hành động: Xem & Tải */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-green-200 dark:border-green-800/50">
            <button
              onClick={() => setPreviewUrl(defaultCV.url)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-[#252525] border border-[#00c853] text-[#00c853] font-bold rounded-xl text-xs hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors active:scale-95"
            >
              <FaEye size={14} /> Xem ngay
            </button>
            <a
              href={defaultCV.url}
              download
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#00c853] text-white font-bold rounded-xl text-xs hover:bg-[#00b04a] shadow-md shadow-green-500/20 transition-all active:scale-95"
            >
              <FaDownload size={14} /> Tải xuống
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-[#252525] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 font-medium">
            Bạn chưa thiết lập CV mặc định.
          </p>
        </div>
      )}

      {/* Chỉ hiển thị nút "Quản lý" ở góc nhìn Ứng viên */}
      {!isPublicView && (
        <Link
          href="/cv/mine"
          className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#00c853] hover:border-[#00c853] font-bold rounded-xl transition-all text-sm active:scale-95"
        >
          Quản lý kho CV <FaArrowRight size={12} />
        </Link>
      )}

      {/* Modal / Pop-up Xem nhanh PDF */}
      {previewUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-5xl h-[92vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/20">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-6 right-6 z-50 p-4 bg-slate-900/80 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              <FaTimes size={20} />
            </button>
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSidebar;
