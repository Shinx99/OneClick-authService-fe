"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaMagic,
  FaTimes,
  FaRobot,
  FaUpload,
  FaRegFilePdf,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

const AIMatchButton = ({ jobId, jobTitle }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("idle");
  const [cvOption, setCvOption] = useState("existing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Giả lập danh sách CV lấy từ Profile [cite: 27, 28]
  const existingResumes = [
    {
      id: 1,
      name: "CV_Frontend_Developer.pdf",
      isDefault: true,
      date: "2 ngày trước",
    },
    {
      id: 2,
      name: "CV_ReactJS_Senior.pdf",
      isDefault: false,
      date: "1 tuần trước",
    },
  ];

  // Logic: Chỉ lấy CV mặc định để phân tích [cite: 27]
  const defaultResume =
    existingResumes.find((cv) => cv.isDefault) || existingResumes[0];

  const handleStartAnalyze = () => {
    if (cvOption === "upload" && !uploadedFile) {
      alert("Vui lòng tải file CV lên!");
      return;
    }

    setStep("scanning");
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      // Chuyển hướng sang trang báo cáo AI [cite: 12, 26]
      router.push(`/jobs/${jobId}/ai-report`);
    }, 2000);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep("idle");
    setUploadedFile(null);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 p-2 hover:bg-gray-100 rounded-full z-10"
            >
              <FaTimes />
            </button>

            {step === "select" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6 font-black text-slate-800 uppercase tracking-tighter">
                  <FaRobot size={20} className="text-indigo-600" /> AI Matching
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                  <button
                    onClick={() => setCvOption("existing")}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${cvOption === "existing" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                  >
                    CV Đã lưu
                  </button>
                  <button
                    onClick={() => setCvOption("upload")}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${cvOption === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                  >
                    Tải file mới
                  </button>
                </div>

                <div className="min-h-[180px]">
                  {cvOption === "existing" ? (
                    <div className="space-y-4 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
                        Hệ thống sử dụng CV mặc định trong hồ sơ
                      </p>
                      <div className="p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 flex items-start gap-4 shadow-lg shadow-indigo-100/50">
                        <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                          <FaRegFilePdf size={28} />
                        </div>
                        <div className="flex-1 overflow-hidden text-left">
                          <p className="font-black text-sm text-slate-800 truncate">
                            {defaultResume.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-indigo-600 text-[8px] font-black text-white rounded-md uppercase">
                              Default
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {defaultResume.date}
                            </span>
                          </div>
                        </div>
                        <FaCheckCircle className="text-indigo-600 mt-1" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/20 hover:bg-indigo-50 transition-all cursor-pointer group">
                        <FaUpload className="w-8 h-8 mb-3 text-indigo-300 group-hover:text-indigo-600 transition-colors" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          Tải CV lên (PDF)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => setUploadedFile(e.target.files[0])}
                        />
                      </label>
                      {uploadedFile && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                          <FaCheckCircle /> Đã chọn: {uploadedFile.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartAnalyze}
                  className="w-full py-4 rounded-2xl font-black text-white bg-slate-900 mt-8 hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
                >
                  Quét độ phù hợp ngay
                </button>
              </div>
            )}

            {step === "scanning" && (
              <div className="p-12 text-center min-h-[380px] flex flex-col items-center justify-center">
                <div className="relative w-24 h-32 bg-indigo-50 rounded-2xl mb-8 flex items-center justify-center overflow-hidden border-2 border-indigo-100 mx-auto">
                  <FaFileAlt className="text-6xl text-indigo-200" />
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 animate-scan shadow-[0_5px_15px_rgba(99,102,241,0.5)]"></div>
                </div>
                <h4 className="text-lg font-black text-slate-800 mb-2 tracking-tighter uppercase leading-none">
                  OneClick AI Analysis
                </h4>
                <p className="text-[10px] font-bold text-indigo-600 animate-pulse mb-8 uppercase tracking-widest leading-none">
                  Đang đối soát dữ liệu hồ sơ...
                </p>
                <div className="w-full max-w-[200px] bg-slate-100 h-1.5 rounded-full overflow-hidden mx-auto">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIMatchButton;
