"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiLoader,
} from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { applicationService } from "@/services/application.service";
import { jobService } from "@/services/job.service";
import ApplicationCard from "./ApplicationCard";  // ← Import từ file riêng
import toast from "react-hot-toast";

// Status configuration (chỉ giữ lại để dùng cho stats, không cần progress ở đây)
const STATUS_CONFIG = {
  pending: { text: "Đang xem xét", color: "text-yellow-600", icon: FiLoader },
  reviewed: { text: "Đã xem", color: "text-blue-600", icon: FiEye },
  interview: { text: "Phỏng vấn", color: "text-purple-600", icon: HiOutlineStatusOnline },
  accepted: { text: "Được nhận", color: "text-green-600", icon: FiCheckCircle },
  rejected: { text: "Từ chối", color: "text-red-600", icon: FiXCircle },
};

// Helper functions
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// StatCard component
const StatCard = ({ label, count, color, icon: Icon }) => (
  <div className={`bg-card-bg rounded-2xl p-4 border border-card-border`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-text-muted text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold text-text-main mt-1">{count}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
        <Icon className={`text-xl ${color}`} />
      </div>
    </div>
  </div>
);

// Main Component
const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      console.log("Applications data:", data);
      
      // Fetch job details for each application
      const applicationsWithJobs = await Promise.all(
        (data || []).map(async (app) => {
          try {
            const jobDetail = await jobService.getJobById(app.jobId);
            return {
              ...app,
              job: jobDetail,
            };
          } catch (error) {
            console.error(`Failed to load job ${app.jobId}:`, error);
            return {
              ...app,
              job: null,
            };
          }
        })
      );
      
      setApplications(applicationsWithJobs);
      
      // Calculate stats
      const newStats = {
        total: applicationsWithJobs.length,
        pending: applicationsWithJobs.filter((a) => a.status === "pending").length,
        reviewed: applicationsWithJobs.filter((a) => a.status === "reviewed").length,
        interview: applicationsWithJobs.filter((a) => a.status === "interview").length,
        accepted: applicationsWithJobs.filter((a) => a.status === "accepted").length,
        rejected: applicationsWithJobs.filter((a) => a.status === "rejected").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Load applications error:", error);
      toast.error("Không thể tải danh sách đã ứng tuyển");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (jobId) => {
    if (confirm("Bạn có chắc muốn hủy ứng tuyển này?")) {
      try {
        await applicationService.cancelApplication(jobId);
        toast.success("Đã hủy ứng tuyển");
        loadApplications(); // Refresh list
      } catch (error) {
        toast.error("Hủy ứng tuyển thất bại");
      }
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getFilteredApplications = () => {
    if (filter === "all") return applications;
    return applications.filter((app) => app.status === filter);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-text-muted mt-4">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  const filteredApps = getFilteredApplications();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">Việc làm đã ứng tuyển</h1>
        <p className="text-text-muted mt-2">Theo dõi trạng thái hồ sơ của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Tổng số" count={stats.total} color="text-gray-600" icon={FiBriefcase} />
        <StatCard label="Đang xem xét" count={stats.pending} color="text-yellow-600" icon={FiLoader} />
        <StatCard label="Đã xem" count={stats.reviewed} color="text-blue-600" icon={FiEye} />
        <StatCard label="Phỏng vấn" count={stats.interview} color="text-purple-600" icon={HiOutlineStatusOnline} />
        <StatCard label="Được nhận" count={stats.accepted} color="text-green-600" icon={FiCheckCircle} />
        <StatCard label="Từ chối" count={stats.rejected} color="text-red-600" icon={FiXCircle} />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-card-border pb-4">
        {["all", "pending", "reviewed", "interview", "accepted", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab
                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                : "bg-card-bg text-text-muted hover:bg-card-border"
            }`}
          >
            {tab === "all" && "Tất cả"}
            {tab === "pending" && "Đang xem xét"}
            {tab === "reviewed" && "Đã xem"}
            {tab === "interview" && "Phỏng vấn"}
            {tab === "accepted" && "Được nhận"}
            {tab === "rejected" && "Từ chối"}
            <span className="ml-2 px-1.5 py-0.5 rounded-md text-xs bg-white/20">
              {applications.filter((a) => (tab === "all" ? true : a.status === tab)).length}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List - SỬ DỤNG ApplicationCard TỪ FILE RIÊNG */}
      {filteredApps.length === 0 ? (
        <div className="bg-card-bg rounded-2xl p-12 text-center border-2 border-card-border">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiBriefcase className="text-3xl text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">Chưa có đơn ứng tuyển nào</h3>
          <p className="text-text-muted mb-6">Bạn chưa ứng tuyển công việc nào. Hãy khám phá và ứng tuyển ngay!</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            <FiBriefcase /> Tìm việc ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((application) => (
            <ApplicationCard
              key={`${application.jobId}-${application.candidateId}`}
              application={application}
              job={application.job}
              onCancel={() => handleCancel(application.jobId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;