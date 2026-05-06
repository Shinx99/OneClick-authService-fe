"use client";
import React, { useState, useEffect } from "react";
import {
  FaMagic,
  FaTimes,
  FaRobot,
  FaUpload,
  FaRegFilePdf,
  FaFileAlt,
  FaSpinner,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { resumeService } from "@/services/resume.service";
import { aiMatchService } from "@/services/ai-match.service";
import toast from "react-hot-toast";
import AIAnalysisDashboard from "./AIAnalysisDashboard";
import AIConsultantChat from "./AIConsultantChat";
import { useAuth } from "@/context/AuthContext";

const AIMatchButton = ({ jobId, jobTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("idle"); // idle | select | scanning | result
  const [cvOption, setCvOption] = useState("existing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("Đang phân tích CV...");
  const { isAuthenticated, isCandidate, isRecruiter } = useAuth();

  // State cho danh sách CV (giống hệt ApplyModal)
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // State cho preview (áp dụng từ DocumentSidebar)
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Kết quả match
  const [matchResult, setMatchResult] = useState(null);

  // Load danh sách CV (GIỐNG HỆT ApplyModal)
  useEffect(() => {
    const loadResumes = async () => {
      setIsLoading(true);
      try {
        const resumesList = await resumeService.getResumes();
        console.log("Loaded resumes:", resumesList);

        const activeResumes = resumesList?.filter(cv => cv.status === 'active') || [];
        setResumes(activeResumes || []);

        // Chọn CV mặc định nếu có
        const defaultCv = resumesList?.find(cv => cv.isDefault);
        if (defaultCv) {
          setSelectedId(defaultCv.id);
        } else if (resumesList?.length > 0) {
          setSelectedId(resumesList[0].id);
        }
      } catch (err) {
        console.error("Load resumes error:", err);
        toast.error("Không thể tải danh sách CV");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadResumes();
    }
  }, [isOpen]);

  // Hàm xem nhanh CV (áp dụng từ DocumentSidebar)
  const handlePreview = async (fileName) => {
    if (!fileName) {
      toast.error("Không thể xem trước CV: thiếu tên file");
      return;
    }

    try {
      setIsPreviewLoading(true);
      toast.loading("Đang tải CV...", { id: "preview" });

      const { blob } = await resumeService.previewResume(fileName);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      toast.dismiss("preview");
      toast.success("Đã tải CV thành công!");
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Không thể xem trước CV!");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Xử lý upload CV mới (GIỐNG HỆT ApplyModal)
  const handleUploadCV = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file PDF');
      return;
    }

    // Kiểm tra dung lượng (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await resumeService.uploadResume(file);
      if (result?.success) {
        toast.success('Tải lên CV thành công!');
        // Reload danh sách CV
        const updatedResumes = await resumeService.getResumes();
        setResumes(updatedResumes || []);
        if (updatedResumes?.length > 0) {
          setSelectedId(updatedResumes[0].id);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || 'Tải lên CV thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAnalyze = async () => {
    if (cvOption === "existing" && !selectedId) {
      toast.error("Vui lòng chọn CV để phân tích!");
      return;
    }

    if (cvOption === "upload" && !uploadedFile) {
      toast.error("Vui lòng tải file CV lên!");
      return;
    }

    setStep("scanning");
    setScanProgress(0);
    setScanMessage("Đang kết nối AI...");

    try {
      let result;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      if (cvOption === "existing" && selectedId) {
        setScanMessage("Đang phân tích CV từ hệ thống...");
        result = await aiMatchService.matchWithResume(selectedId, jobId);
      } else if (cvOption === "upload" && uploadedFile) {
        setScanMessage("Đang tải file lên server...");
        result = await aiMatchService.matchWithNewFile(jobId, uploadedFile);
      } else {
        throw new Error("No CV selected");
      }

      clearInterval(progressInterval);
      setScanProgress(100);
      setMatchResult(result);

      setTimeout(() => {
        setStep("result");
      }, 500);

    } catch (error) {
      console.error("Match error:", error);
      toast.error(error.response?.data?.message || error.message || "Có lỗi xảy ra khi phân tích CV");
      setStep("select");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep("idle");
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setMatchResult(null);
    setScanProgress(0);
  };

  const handleBackToSelect = () => {
    setStep("select");
    setScanProgress(0);
    setMatchResult(null);
  };

  const handlePreviewUploadedFile = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    }
  };

  // Guard
  if (!isAuthenticated || !isCandidate) return null;
  if (isRecruiter) return null;

  return (
    <>
      {/* NÚT BẤM */}
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

      {/* MODAL: Chọn CV + Scanning (GIỮ NGUYÊN GIAO DIỆN CŨ) */}
      {(step === "select" || step === "scanning") && (
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
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${cvOption === "upload" ? "bg-card-bg text-[#00c853] shadow-sm" : "text-text-muted"}`}
                  >
                    Tải file mới
                  </button>
                </div>

                <div className="min-h-[200px]">
                  {cvOption === "existing" ? (
                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                      {isLoading ? (
                        <div className="py-10 text-center">
                          <FaSpinner className="animate-spin mx-auto text-green-500 text-2xl" />
                          <p className="text-xs text-text-muted mt-2">Đang tải danh sách CV...</p>
                        </div>
                      ) : resumes.length > 0 ? (
                        resumes.map((cv) => (
                          <div
                            key={cv.id}
                            onClick={() => setSelectedId(cv.id)}
                            className={`group p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between
                              ${selectedId === cv.id ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : "border-card-border bg-background hover:border-card-border"}`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedId === cv.id ? "bg-green-500 text-white" : "bg-card-bg text-text-muted shadow-sm"}`}
                              >
                                <FaRegFilePdf size={18} />
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-bold transition-colors ${selectedId === cv.id ? "text-green-700 dark:text-green-400" : "text-text-main"}`}
                                >
                                  {cv.name || "CV không tên"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                  {cv.updateAt || "Vừa xong"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreview(cv.fileName);
                                }}
                                disabled={isPreviewLoading}
                                className="p-2 text-slate-400 hover:text-[#00c853] transition-colors disabled:opacity-50"
                              >
                                {isPreviewLoading ? (
                                  <FaSpinner className="animate-spin" size={16} />
                                ) : (
                                  <FaEye size={16} />
                                )}
                              </button>
                              {selectedId === cv.id && (
                                <FaCheckCircle className="text-green-500 animate-in zoom-in" />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center border-2 border-dashed border-card-border rounded-[1.5rem] bg-background">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            Bạn chưa có CV nào
                          </p>
                          <label className="mt-3 inline-block cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleUploadCV}
                              disabled={isUploading}
                              className="hidden"
                            />
                            <span className="text-green-600 font-black text-[10px] uppercase hover:underline">
                              {isUploading ? "Đang tải lên..." : "Tải lên ngay"}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
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

                      {uploadedFile && (
                        <div className="p-4 rounded-2xl border border-[#00c853] bg-green-50/30 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FaRegFilePdf className="text-rose-500 shrink-0" size={24} />
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
                  disabled={(cvOption === "existing" && resumes.length === 0) || (cvOption === "upload" && !uploadedFile)}
                  className="w-full py-4 rounded-2xl font-black text-white bg-slate-900 mt-6 hover:bg-[#00c853] transition-all uppercase text-xs tracking-widest shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-xs text-text-muted mb-4">{scanMessage}</p>
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

      {/* MODAL FULL SCREEN: Kết quả AI (Dashboard + Chat) */}
      {isOpen && step === "result" && matchResult && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in fade-in duration-300">
          {/* Header */}
          <header className="bg-card-bg/80 backdrop-blur-md border-b border-card-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
              <button
                onClick={handleBackToSelect}
                className="flex items-center gap-2 text-text-muted hover:text-[#00c853] font-bold transition-all group text-sm"
              >
                <FaChevronLeft
                  className="group-hover:-translate-x-1 transition-transform"
                  size={12}
                />
                Quét lại
              </button>

              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                <FaRobot className="animate-pulse" size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Độ phù hợp: {Math.round(matchResult.matchScore)}%
                </span>
              </div>

              <button
                onClick={closeModal}
                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </header>

          {/* Content: 2 cột */}
          <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Match Summary */}
            {/* <div className="mb-8 bg-gradient-to-r from-green-50 to-indigo-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-black text-text-main mb-2">
                    Kết quả phân tích CV
                  </h2>
                  <p className="text-text-muted text-sm">
                    {matchResult.matchReason}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#00c853]">
                    {Math.round(matchResult.matchScore)}%
                  </div>
                  <div className="text-xs text-text-muted uppercase font-bold tracking-wider">
                    Match Score
                  </div>
                </div>
              </div> */}

            {/* Skills Match */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4">
                  <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Kỹ năng phù hợp
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matchedSkills?.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                    <FaExclamationTriangle className="text-orange-500" />
                    Kỹ năng còn thiếu
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingSkills?.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div> */}

            {/* Improvement Tips */}
            {/* {matchResult.improvementTips && matchResult.improvementTips.length > 0 && (
                <div className="mt-4 bg-blue-50 rounded-xl p-4">
                  <h3 className="text-sm font-black mb-2 text-blue-800">💡 Gợi ý cải thiện</h3>
                  <ul className="space-y-1">
                    {matchResult.improvementTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-blue-700">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>  */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Trái: Dashboard phân tích */}
              <div className="lg:col-span-8">
                <AIAnalysisDashboard
                  jobId={jobId}
                  matchResult={matchResult} />
              </div>

              {/* Phải: Chat AI tư vấn */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <AIConsultantChat
                    jobId={jobId}
                    matchResult={matchResult} />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* POPUP XEM NHANH PDF - FIXED */}
      {previewUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-card-bg w-full max-w-6xl h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Header của popup */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4 pointer-events-none">
              <div className="flex justify-end pointer-events-auto">
                <button
                  onClick={() => {
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(null);
                    setIsPreviewLoading(false);
                  }}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Đóng"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Nội dung PDF */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="CV Preview"
                style={{ position: 'relative', zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIMatchButton;