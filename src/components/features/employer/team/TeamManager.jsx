"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FaUserShield, FaUserEdit, FaCheck, FaTimes, FaTrashAlt,
  FaEnvelope, FaHourglassHalf, FaHistory, FaExclamationTriangle, FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { companyService } from "@/services/company.service";
import { useTeam } from "@/hooks/useTeam";

const MAX_LEVEL_1 = 1;

const TeamManager = ({ currentEmployerId, currentEmployerLevel }) => {
  const [activeTab, setActiveTab] = useState("members");
  const [requests, setRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Dùng hook thay vì fetchMembers thủ công
  const { members, isLoading: isLoadingMembers, removeMember, refreshTeam } = useTeam();

  const isOwner = currentEmployerLevel === "level1";
  const level1Count = members.filter((m) => m.level === "level1").length;


  // ============ FETCH JOIN REQUESTS (chỉ owner) ============
  const fetchRequests = useCallback(async () => {
    if (!isOwner) return;
    setIsLoadingRequests(true);
    try {
      const res = await companyService.getJoinRequests({ page: 0, size: 20 });
      if (res.success) setRequests(res.data?.content || []);
    } catch (err) {
      toast.error("Không thể tải danh sách yêu cầu");
    } finally {
      setIsLoadingRequests(false);
    }
  }, [isOwner]);

  useEffect(() => {
    if (activeTab === "requests") fetchRequests();
    else setRequests([]);
  }, [activeTab, fetchRequests]);


  // ============ APPROVE ============
  const handleApprove = async (req) => {
    if (req.requestedRole === "level1" && level1Count >= MAX_LEVEL_1) {
      toast.error(`Công ty chỉ được phép có tối đa ${MAX_LEVEL_1} HR Tổng!`);
      return;
    }
    setProcessingId(req.id);
    const toastId = toast.loading("Đang xử lý...");
    try {
      const res = await companyService.approveJoinRequest(req.id);
      if (res.success) {
        toast.success(`Đã cấp quyền cho ${req.employerName || req.name}`, { id: toastId });
        setRequests((prev) => prev.filter((r) => r.id !== req.id));
        refreshTeam(); // ← thay fetchMembers()
      } else {
        toast.error(res.message || "Duyệt thất bại!", { id: toastId });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };


  // ============ REJECT ============
  const handleReject = async (id) => {
    setProcessingId(id);
    const toastId = toast.loading("Đang từ chối...");
    try {
      const res = await companyService.rejectJoinRequest(id);
      if (res.success) {
        toast.success("Đã từ chối yêu cầu gia nhập", { id: toastId });
        setRequests((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error(res.message || "Từ chối thất bại!", { id: toastId });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };


  // ============ REMOVE MEMBER ============
  const handleRemoveMember = async (employerId, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${name} khỏi công ty?`)) return;
    setProcessingId(employerId);
    const toastId = toast.loading("Đang xóa thành viên...");
    try {
      const res = await removeMember(employerId); // dùng từ hook
      toast.success("Đã xóa thành viên", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name) =>
    (name ?? "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="bg-card-bg border-2 border-card-border rounded-[2rem] overflow-hidden shadow-sm">

        {/* TABS */}
        <div className="flex items-center border-b-2 border-card-border px-6 pt-6 gap-8">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === "members" ? "text-indigo-600" : "text-text-muted hover:text-text-main"}`}
          >
            Thành viên ({members.length})
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] flex items-center gap-1">
              <FaUserShield /> {level1Count}/{MAX_LEVEL_1}
            </span>
            {activeTab === "members" && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />}
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === "requests" ? "text-indigo-600" : "text-text-muted hover:text-text-main"}`}
            >
              Yêu cầu chờ duyệt
              {requests.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
              {activeTab === "requests" && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />}
            </button>
          )}

          {!isOwner && (
            <button
              onClick={() => setActiveTab("activities")}
              className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === "activities" ? "text-indigo-600" : "text-text-muted hover:text-text-main"}`}
            >
              <FaHistory className="mb-0.5" /> Nhật ký & Trạng thái
              {activeTab === "activities" && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />}
            </button>
          )}
        </div>

        {/* NỘI DUNG TABS */}
        <div className="p-6">

          {/* TAB: THÀNH VIÊN */}
          {activeTab === "members" && (
            <div className="animate-in fade-in duration-300 space-y-3">
              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-indigo-500 text-2xl mr-3" />
                  <span className="text-[14px] text-text-muted">Đang tải thành viên...</span>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 text-text-muted text-[14px]">Chưa có thành viên nào</div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.employerId}
                    className="flex items-center justify-between p-4 bg-background border-2 border-card-border rounded-2xl hover:border-indigo-300 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-lg shadow-sm border border-indigo-100 dark:border-indigo-500/20 overflow-hidden">
                        {member.avatarUrl
                          ? <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          : getInitials(member.name)}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-text-main flex items-center gap-2">
                          {member.name}
                          {member.employerId === currentEmployerId && (
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Bạn</span>
                          )}
                        </h4>
                        <p className="text-[12px] text-text-muted font-medium flex items-center gap-1 mt-1">
                          <FaEnvelope className="text-slate-300 dark:text-slate-600" /> {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${member.level === "level1" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"}`}>
                        {member.level === "level1" ? <FaUserShield size={14} /> : <FaUserEdit size={14} />}
                        {member.level === "level1" ? "HR Tổng" : "HR Phụ"}
                      </div>

                      {isOwner && member.employerId !== currentEmployerId && (
                        <button
                          onClick={() => handleRemoveMember(member.employerId, member.name)}
                          disabled={processingId === member.employerId}
                          className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          {processingId === member.employerId
                            ? <FaSpinner className="animate-spin" />
                            : <FaTrashAlt />}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}


          {/* TAB: YÊU CẦU CHỜ DUYỆT */}
          {activeTab === "requests" && isOwner && (
            <div className="animate-in fade-in duration-300 space-y-3">
              {isLoadingRequests ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-amber-500 text-2xl mr-3" />
                  <span className="text-[14px] text-text-muted">Đang tải yêu cầu...</span>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12 text-text-muted text-[14px]">Không có yêu cầu nào đang chờ duyệt</div>
              ) : (
                requests.map((req) => {
                  const isLimitReached = req.requestedRole === "level1" && level1Count >= MAX_LEVEL_1;
                  const isProcessing = processingId === req.id;

                  return (
                    <div
                      key={req.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-2 rounded-2xl gap-4 transition-all ${isLimitReached ? "bg-rose-50/30 border-rose-200" : "bg-amber-50/30 border-amber-200/50"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-white border-2 flex items-center justify-center font-bold text-lg ${isLimitReached ? "border-rose-100 text-rose-500" : "border-amber-100 text-amber-500"}`}>
                          {getInitials(req.employerName || req.name || "?")}
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-text-main">{req.employerName || req.name}</h4>
                          <p className="text-[12px] text-text-muted font-medium mb-1.5">{req.employerEmail || req.email}</p>
                          <p className="text-[11px] text-amber-600 font-medium">
                            Yêu cầu quyền:{" "}
                            <strong className={req.requestedRole === "level1" ? "text-rose-600" : ""}>
                              {req.requestedRole === "level1" ? "HR Tổng" : "HR Phụ"}
                            </strong>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                            {req.createdAt ? new Date(req.createdAt).toLocaleString("vi-VN") : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-card-border text-rose-500 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {isProcessing ? <FaSpinner className="animate-spin" /> : <FaTimes />} Từ chối
                          </button>
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={isLimitReached || isProcessing}
                            className={`flex-1 sm:flex-none px-4 py-2.5 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 ${isLimitReached || isProcessing ? "bg-slate-300 cursor-not-allowed" : "bg-[#00c853] hover:bg-[#00b04a] shadow-md shadow-green-500/20 active:scale-95"}`}
                          >
                            {isProcessing ? <FaSpinner className="animate-spin" /> : <FaCheck />} Phê duyệt
                          </button>
                        </div>
                        {isLimitReached && (
                          <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 uppercase tracking-widest">
                            <FaExclamationTriangle /> Đã đạt giới hạn 2 HR Tổng
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}


          {/* TAB: NHẬT KÝ (level2) */}
          {activeTab === "activities" && !isOwner && (
            <MyJoinStatus />
          )}
        </div>
      </div>
    </div>
  );
};


// Component nhỏ cho level2 xem trạng thái join request của chính mình
const MyJoinStatus = () => {
  const [joinRequest, setJoinRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJoinRequest = async () => {
      try {
        const res = await companyService.getMyJoinRequest();
        if (res.success) setJoinRequest(res.data);
      } catch {
        setJoinRequest(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadJoinRequest();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <FaSpinner className="animate-spin text-2xl text-indigo-500 mr-3" />
      <span className="text-[14px] text-text-muted">Đang tải trạng thái...</span>
    </div>
  );

  if (!joinRequest) return (
    <div className="text-center py-12 text-text-muted text-[14px]">Không tìm thấy thông tin yêu cầu gia nhập</div>
  );

  const isPending = joinRequest.status?.toUpperCase() === "PENDING";

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-start gap-4 p-4 bg-background border-2 border-card-border rounded-2xl">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${isPending ? "bg-amber-50 text-amber-500 border-amber-200" : "bg-green-50 text-[#00c853] border-green-200"}`}>
          {isPending
            ? <FaHourglassHalf size={14} className="animate-pulse" />
            : <FaCheck size={14} />}
        </div>
        <div className="flex-1">
          <h4 className="text-[14px] font-bold text-text-main">
            Yêu cầu gia nhập{" "}
            <span className="font-normal text-text-muted">công ty</span>{" "}
            {joinRequest.companyName}
          </h4>
          <p className="text-[12px] text-text-muted font-medium mt-1 mb-2">
            {joinRequest.createdAt ? new Date(joinRequest.createdAt).toLocaleString("vi-VN") : ""}
          </p>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${isPending ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-green-50 text-green-700 border-green-100"}`}>
              {isPending ? "Đang chờ Owner duyệt" : "Đã được phê duyệt"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManager;