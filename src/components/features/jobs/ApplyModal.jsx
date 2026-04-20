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
  const [isUploading, setIsUploading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const loadResumes = async () => {
      setIsLoading(true);
      try {
        // Gọi đúng hàm getResumes từ resumeService
        const resumesList = await resumeService.getResumes();
        console.log("Loaded resumes:", resumesList);

        const activeResumes = resumesList?.filter(cv => cv.status === 'active') || [];
        
        setResumes(activeResumes || []);
        // Chọn CV mặc định nếu có
        const defaultCv = resumesList?.find(cv => cv.isDefault);
        if (defaultCv) {
          setSelectedId(defaultCv.id);s
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
    
    loadResumes();
  }, []);

  // Xử lý upload CV mới
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

   // Xử lý nộp đơn
  const handleConfirm = async () => {
    if (!selectedId) {
      toast.error("Vui lòng chọn 1 hồ sơ");
      return;
    }
    
    // Log để kiểm tra
    console.log('🔍 Submitting application:', {
      jobId: job?.id,
      resumeId: selectedId,
      note: note
    });
    
    if (!job?.id) {
      toast.error("Không tìm thấy ID công việc");
      console.error('Job ID is missing!', job);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Gọi API ứng tuyển - tạo applicationService.applyJob
      // truyền object
      await applicationService.applyJob({
        jobId: job.id,
        resumeId: selectedId,
        note: note || ''
      });
          toast.success("Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.");
      
      // Gọi callback success nếu có
      if (onSuccess) {
        onSuccess();
      }
      
      // Đóng modal
      onClose();
    } catch (err) {
      console.error("Apply error:", err);
      toast.error(err.response?.data?.message || err.message || "Lỗi khi gửi đơn ứng tuyển");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card-bg w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-text-main transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold text-text-main tracking-tight">
            Ứng tuyển ngay
          </h3>
          <p className="text-sm text-text-muted mt-1 italic">{job.company}</p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] px-2">
            Hồ sơ ứng tuyển của bạn
          </p>

          {isLoading ? (
            <div className="py-10 text-center">
              <FaSpinner className="animate-spin mx-auto text-green-500 text-2xl" />
              <p className="text-xs text-text-muted mt-2">Đang tải danh sách CV...</p>
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {resumes.map((cv) => (
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
                      <FaFilePdf size={18} />
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
                  {selectedId === cv.id && (
                    <FaCheckCircle className="text-green-500 animate-in zoom-in" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-card-border rounded-[1.5rem] bg-background">
              <FaCloudUploadAlt className="mx-auto text-slate-300 text-3xl mb-3" />
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

          {/* Thêm phần ghi chú */}
        <div className="mt-4">
          <label className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] px-2">
            Thư giới thiệu
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-card-border bg-background text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp với vị trí này..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-main transition-all"
          >
            Để sau
          </button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || resumes.length === 0|| isLoading}
            className="flex-1 !rounded-[1.25rem] h-[54px] bg-[#10B94F] hover:bg-green-600 shadow-lg shadow-green-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
