"use client";
import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import Button from "@/components/ui/Button";
import { resumeService } from "@/services/resume.service";
import { applicationService } from "@/services/application.service";
import toast from "react-hot-toast";

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await resumeService.getMyResumes();
        setResumes(res.data || []);
        if (res.data?.length > 0) setSelectedId(res.data[0].id);
      } catch (err) {
        toast.error("Không thể tải danh sách CV");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleConfirm = async () => {
    if (!selectedId) return toast.error("Vui lòng chọn 1 hồ sơ");
    setIsSubmitting(true);
    try {
      await applicationService.applyJob(job.id, selectedId);
      toast.success("Ứng tuyển thành công! Chúc bạn may mắn.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi gửi đơn ứng tuyển");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            Ứng tuyển ngay
          </h3>
          <p className="text-sm text-slate-500 mt-1 italic">{job.company}</p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">
            Hồ sơ ứng tuyển của bạn
          </p>

          {isLoading ? (
            <div className="py-10 text-center">
              <FaSpinner className="animate-spin mx-auto text-green-500 text-2xl" />
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {resumes.map((cv) => (
                <div
                  key={cv.id}
                  onClick={() => setSelectedId(cv.id)}
                  className={`group p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between
                    ${selectedId === cv.id ? "border-green-500 bg-green-50/50" : "border-slate-50 bg-slate-50/50 hover:border-slate-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedId === cv.id ? "bg-green-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
                    >
                      <FaFilePdf size={18} />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold transition-colors ${selectedId === cv.id ? "text-green-700" : "text-slate-700"}`}
                      >
                        {cv.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                        Mới cập nhật
                      </p>
                    </div>
                  </div>
                  {selectedId === cv.id && (
                    <FaCheckCircle className="text-green-500 animate-in zoom-in" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-slate-50/50">
              <FaCloudUploadAlt className="mx-auto text-slate-300 text-3xl mb-3" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Bạn chưa có CV nào
              </p>
              <button className="mt-3 text-green-600 font-black text-[10px] uppercase hover:underline">
                Tải lên ngay
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
          >
            Để sau
          </button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || resumes.length === 0}
            className="flex-1 !rounded-[1.25rem] h-[54px] bg-[#10B94F] hover:bg-green-600 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin text-lg" />
            ) : (
              "Xác nhận nộp"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
