"use client";
import React, { useState } from "react";
import {
  FaUserShield,
  FaUserEdit,
  FaCheck,
  FaTimes,
  FaTrashAlt,
  FaEnvelope,
  FaHourglassHalf,
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const TeamManager = () => {
  // ================= STATE =================
  const [currentUserRole, setCurrentUserRole] = useState("level1");
  const [activeTab, setActiveTab] = useState("members");

  // Fake Data: Danh sách thành viên hiện tại
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Trác (Bạn)",
      email: "trac@oneclick.tech",
      role: "level1",
      avatar: "TR",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      email: "nva@oneclick.tech",
      role: "level2",
      avatar: "NA",
    },
    {
      id: 3,
      name: "Trần Thị B",
      email: "ttb@oneclick.tech",
      role: "level2",
      avatar: "TB",
    },
  ]);

  // Fake Data: Danh sách yêu cầu chờ duyệt (Sửa người C thành level1 để test)
  const [requests, setRequests] = useState([
    {
      id: 101,
      name: "Lê Hoàng C",
      email: "lhc@oneclick.tech",
      requestedRole: "level1",
      date: "Hôm nay, 09:30",
    },
    {
      id: 102,
      name: "Phạm Văn D",
      email: "pvd@oneclick.tech",
      requestedRole: "level2",
      date: "Hôm qua, 15:45",
    },
  ]);

  const [activities, setActivities] = useState([
    {
      id: 201,
      type: "pending",
      name: "Lê Hoàng C",
      email: "lhc@oneclick.tech",
      role: "HR Tổng",
      time: "Hôm nay, 09:30",
      note: "Đang chờ Admin hệ thống phê duyệt",
    },
    {
      id: 202,
      type: "pending",
      name: "Phạm Văn D",
      email: "pvd@oneclick.tech",
      role: "HR Phụ",
      time: "Hôm qua, 15:45",
      note: "Đang chờ HR Tổng phê duyệt",
    },
  ]);

  // ĐẾM SỐ LƯỢNG HR TỔNG (LEVEL 1) HIỆN TẠI
  const level1Count = members.filter((m) => m.role === "level1").length;
  const MAX_LEVEL_1 = 2; // Giới hạn tối đa

  // ================= HÀM XỬ LÝ (HR Tổng) =================
  const handleApprove = (req) => {
    // Chặn logic bảo mật 2 lớp: Dù nút có bị disable mà user cố tình dùng tool gọi hàm thì vẫn bị chặn
    if (req.requestedRole === "level1" && level1Count >= MAX_LEVEL_1) {
      toast.error(`Công ty chỉ được phép có tối đa ${MAX_LEVEL_1} HR Tổng!`);
      return;
    }

    toast.success(`Đã cấp quyền cho ${req.name}`);
    setMembers([
      ...members,
      {
        id: req.id,
        name: req.name,
        email: req.email,
        role: req.requestedRole,
        avatar: req.name.substring(0, 2).toUpperCase(),
      },
    ]);
    setRequests(requests.filter((r) => r.id !== req.id));

    setActivities([
      {
        id: Date.now(),
        type: "approved",
        name: req.name,
        email: req.email,
        role: req.requestedRole === "level1" ? "HR Tổng" : "HR Phụ",
        time: "Vừa xong",
        note: "Đã được phê duyệt",
      },
      ...activities.filter((a) => a.name !== req.name),
    ]);
  };

  const handleReject = (id) => {
    toast.error("Đã từ chối yêu cầu gia nhập");
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleRemoveMember = (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi công ty?")
    ) {
      toast.success("Đã xóa thành viên");
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 🛠 DEV TOOL MÔ PHỎNG ROLE */}
      <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-2xl w-fit">
        <span className="text-[12px] font-bold text-indigo-600 uppercase tracking-widest px-2">
          Test Góc nhìn:
        </span>
        <button
          onClick={() => {
            setCurrentUserRole("level1");
            setActiveTab("members");
          }}
          className={`px-4 py-2 text-[12px] font-bold rounded-xl transition-all ${currentUserRole === "level1" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white text-indigo-600"}`}
        >
          HR Tổng (Level 1)
        </button>
        <button
          onClick={() => {
            setCurrentUserRole("level2");
            setActiveTab("members");
          }}
          className={`px-4 py-2 text-[12px] font-bold rounded-xl transition-all ${currentUserRole === "level2" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white text-indigo-600"}`}
        >
          HR Phụ (Level 2)
        </button>
      </div>

      <div className="bg-card-bg border-2 border-card-border rounded-[2rem] overflow-hidden shadow-sm">
        {/* ================= TABS NAVIGATION ================= */}
        <div className="flex items-center border-b-2 border-card-border px-6 pt-6 gap-8">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === "members" ? "text-indigo-600" : "text-text-muted hover:text-text-main"}`}
          >
            Thành viên ({members.length})
            {/* Hiển thị hạn mức HR Tổng cho mọi người thấy */}
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] flex items-center gap-1">
              <FaUserShield /> {level1Count}/{MAX_LEVEL_1}
            </span>
            {activeTab === "members" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>
            )}
          </button>

          {currentUserRole === "level1" && (
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
              {activeTab === "requests" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
          )}

          {currentUserRole === "level2" && (
            <button
              onClick={() => setActiveTab("activities")}
              className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === "activities" ? "text-indigo-600" : "text-text-muted hover:text-text-main"}`}
            >
              <FaHistory className="mb-0.5" /> Nhật ký & Trạng thái
              {activeTab === "activities" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
          )}
        </div>

        {/* ================= NỘI DUNG TABS ================= */}
        <div className="p-6">
          {/* TAB: THÀNH VIÊN */}
          {activeTab === "members" && (
            <div className="animate-in fade-in duration-300 space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-background border-2 border-card-border rounded-2xl hover:border-indigo-300 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-lg shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-text-main flex items-center gap-2">
                        {member.name}
                        {member.id === 1 && (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Bạn
                          </span>
                        )}
                      </h4>
                      <p className="text-[12px] text-text-muted font-medium flex items-center gap-1 mt-1">
                        <FaEnvelope className="text-slate-300 dark:text-slate-600" />{" "}
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${member.role === "level1" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"}`}
                    >
                      {member.role === "level1" ? (
                        <FaUserShield size={14} />
                      ) : (
                        <FaUserEdit size={14} />
                      )}
                      {member.role === "level1" ? "HR Tổng" : "HR Phụ"}
                    </div>
                    {currentUserRole === "level1" && member.id !== 1 && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: YÊU CẦU CHỜ DUYỆT */}
          {activeTab === "requests" && currentUserRole === "level1" && (
            <div className="animate-in fade-in duration-300 space-y-3">
              {requests.map((req) => {
                // Kiểm tra xem yêu cầu này có vi phạm giới hạn HR Tổng không
                const isLimitReached =
                  req.requestedRole === "level1" && level1Count >= MAX_LEVEL_1;

                return (
                  <div
                    key={req.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-2 rounded-2xl gap-4 transition-all ${isLimitReached ? "bg-rose-50/30 border-rose-200" : "bg-amber-50/30 border-amber-200/50"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-white border-2 flex items-center justify-center font-bold text-lg ${isLimitReached ? "border-rose-100 text-rose-500" : "border-amber-100 text-amber-500"}`}
                      >
                        {req.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-text-main">
                          {req.name}
                        </h4>
                        <p className="text-[12px] text-text-muted font-medium mb-1.5">
                          {req.email}
                        </p>
                        <p className="text-[11px] text-amber-600 font-medium">
                          Yêu cầu quyền:{" "}
                          <strong
                            className={
                              req.requestedRole === "level1"
                                ? "text-rose-600"
                                : ""
                            }
                          >
                            {req.requestedRole === "level1"
                              ? "HR Tổng"
                              : "HR Phụ"}
                          </strong>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                          {req.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-card-border text-rose-500 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center gap-1.5"
                        >
                          <FaTimes /> Từ chối
                        </button>

                        {/* Nút Phê duyệt - Nếu quá giới hạn thì bị Disable */}
                        <button
                          onClick={() => handleApprove(req)}
                          disabled={isLimitReached}
                          className={`flex-1 sm:flex-none px-4 py-2.5 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            isLimitReached
                              ? "bg-slate-300 cursor-not-allowed"
                              : "bg-[#00c853] hover:bg-[#00b04a] shadow-md shadow-green-500/20 active:scale-95"
                          }`}
                        >
                          <FaCheck /> Phê duyệt
                        </button>
                      </div>

                      {/* Dòng cảnh báo khi quá số lượng */}
                      {isLimitReached && (
                        <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 uppercase tracking-widest">
                          <FaExclamationTriangle /> Đã đạt giới hạn 2 HR Tổng
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: NHẬT KÝ & TRẠNG THÁI (CHỈ LEVEL 2) */}
          {/* ... (Đoạn này giữ nguyên như cũ) ... */}
          {activeTab === "activities" && currentUserRole === "level2" && (
            <div className="animate-in fade-in duration-300 space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-background border-2 border-card-border rounded-2xl"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${activity.type === "pending" ? "bg-amber-50 text-amber-500 border-amber-200" : "bg-green-50 text-[#00c853] border-green-200"}`}
                  >
                    {activity.type === "pending" ? (
                      <FaHourglassHalf size={14} className="animate-pulse" />
                    ) : (
                      <FaCheck size={14} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-bold text-text-main">
                      {activity.name}{" "}
                      <span className="text-[13px] font-normal text-text-muted">
                        yêu cầu quyền
                      </span>{" "}
                      {activity.role}
                    </h4>
                    <p className="text-[12px] text-text-muted font-medium mt-1 mb-2">
                      {activity.email}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${activity.type === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-green-50 text-green-700 border-green-100"}`}
                      >
                        {activity.note}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManager;
