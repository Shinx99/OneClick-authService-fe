"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaMagic,
  FaTimes,
  FaRobot,
  FaUpload,
  FaRegFilePdf,
  FaFileAlt,
  FaCheckCircle,
  FaSpinner,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { resumeService } from "@/services/resume.service";
import toast from "react-hot-toast";

const AIMatchButton = ({ jobId, jobTitle }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("idle");
  const [cvOption, setCvOption] = useState("existing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const [resumes, setResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isOpen && cvOption === "existing") {
      const fetchResumes = async () => {
        setIsLoadingResumes(true);
        try {
          const data = await resumeService.getResumes();
          setResumes(data);
        } catch (error) {
          toast.error("Không thể tải danh sách CV");
        } finally {
          setIsLoadingResumes(false);
        }
      };
      fetchResumes();
    }
  }, [isOpen, cvOption]);

  const defaultResume = resumes.find((cv) => cv.isDefault) || resumes[0];

  // Xem nhanh file từ máy tính
  const handlePreviewUploadedFile = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    }
  };

  const handleStartAnalyze = () => {
    if (cvOption === "upload" && !uploadedFile) {
      toast.error("Vui lòng tải file CV lên!");
      return;
    }
    setStep("scanning");
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 150);
    setTimeout(() => {
      clearInterval(interval);
      router.push(`/jobs/${jobId}/ai-report`);
    }, 2000);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep("idle");
    setUploadedFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setStep("select");
        }}
        className="w-full group relative flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-black text-white overflow-hidden shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 uppercase text-xs tracking-widest"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 background-animate"></div>
        <FaMagic className="relative z-10 animate-pulse" />
        <span className="relative z-10">AI Phân tích hồ sơ</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card-bg w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-text-muted p-2 hover:bg-background rounded-full z-10"
            >
              <FaTimes />
            </button>

            {step === "select" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6 font-black text-text-main uppercase tracking-tighter">
                  <FaRobot size={20} className="text-[#00c853]" /> AI Matching
                </div>

                <div className="flex bg-background p-1 rounded-2xl mb-6">
                  <button
                    onClick={() => setCvOption("existing")}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${cvOption === "existing" ? "bg-card-bg text-[#00c853] shadow-sm" : "text-text-muted"}`}
                  >
                    CV Đã lưu
                  </button>
                  <button
                    onClick={() => setCvOption("upload")}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${cvOption === "upload" ? "bg-white dark:bg-gray-700 text-[#00c853] shadow-sm" : "text-slate-500"}`}
                  >
                    Tải file mới
                  </button>
                </div>

                <div className="min-h-[200px]">
                  {cvOption === "existing" ? (
                    <div className="flex flex-col justify-center min-h-[200px]">
                      {isLoadingResumes ? (
                        <div className="flex justify-center">
                          <FaSpinner className="animate-spin text-[#00c853] text-2xl" />
                        </div>
                      ) : defaultResume ? (
                        <div className="p-5 rounded-2xl border-2 border-[#00c853] bg-green-50/30 flex items-center gap-4 relative">
                          <div className="p-3 bg-white rounded-xl text-[#00c853] shadow-sm">
                            <FaRegFilePdf size={28} />
                          </div>
                          <div className="flex-1 overflow-hidden text-left">
                            <p className="font-black text-sm text-text-main truncate">
                              {defaultResume.name}
                            </p>
                            <span className="px-2 py-0.5 bg-[#00c853] text-[8px] font-black text-white rounded-md uppercase">
                              Mặc định
                            </span>
                          </div>
                          <button
                            onClick={() => setPreviewUrl(defaultResume.url)}
                            className="p-2 text-slate-400 hover:text-[#00c853] transition-colors"
                          >
                            <FaEye size={20} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-center text-xs text-slate-400 italic">
                          Kho CV trống
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* KHUNG UPLOAD LUÔN GIỮ NGUYÊN */}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/10 hover:bg-indigo-50 cursor-pointer transition-all group">
                        <FaUpload className="w-6 h-6 mb-2 text-indigo-300 group-hover:text-indigo-600 transition-colors" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          Nhấn để tải CV mới (PDF)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => setUploadedFile(e.target.files[0])}
                        />
                      </label>

                      {/* HIỂN THỊ FILE ĐÃ CHỌN Ở BÊN DƯỚI */}
                      {uploadedFile && (
                        <div className="p-4 rounded-2xl border border-[#00c853] bg-green-50/30 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FaRegFilePdf
                              className="text-rose-500 shrink-0"
                              size={24}
                            />
                            <div className="overflow-hidden">
                              <p className="text-xs font-black text-text-main truncate max-w-[150px]">
                                {uploadedFile.name}
                              </p>
                              <p className="text-[9px] text-[#00c853] font-bold uppercase">
                                Sẵn sàng phân tích
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handlePreviewUploadedFile}
                              className="p-2 text-[#00c853] hover:bg-white rounded-lg transition-all"
                              title="Xem nhanh"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => setUploadedFile(null)}
                              className="p-2 text-rose-400 hover:text-rose-600"
                              title="Xóa file"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartAnalyze}
                  className="w-full py-4 rounded-2xl font-black text-white bg-slate-900 mt-6 hover:bg-[#00c853] transition-all uppercase text-xs tracking-widest shadow-xl active:scale-95"
                >
                  Quét độ phù hợp ngay
                </button>
              </div>
            )}

            {step === "scanning" && (
              <div className="p-12 text-center min-h-[380px] flex flex-col items-center justify-center">
                <div className="relative w-24 h-32 bg-green-50 rounded-2xl mb-8 flex items-center justify-center overflow-hidden border-2 border-green-100">
                  <FaFileAlt className="text-6xl text-[#00c853] opacity-20" />
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00c853] animate-scan shadow-[0_5px_15px_rgba(0,200,83,0.5)]"></div>
                </div>
                <h4 className="text-lg font-black text-text-main mb-2 uppercase tracking-tighter">
                  OneClick AI Scanning
                </h4>
                <div className="w-full max-w-[200px] bg-slate-100 h-1.5 rounded-full overflow-hidden mx-auto">
                  <div
                    className="bg-[#00c853] h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL XEM NHANH PDF (DÙNG CHUNG) */}
      {previewUrl && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-card-bg w-full max-w-4xl h-[85vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
            <button
              onClick={() => {
                if (previewUrl.startsWith("blob:"))
                  URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }}
              className="absolute top-4 right-4 z-[160] p-4 bg-slate-900 text-white rounded-full hover:scale-110 shadow-xl transition-transform"
            >
              <FaTimes />
            </button>
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="Preview"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIMatchButton;
