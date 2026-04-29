"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiLoader,
  FiBell,
} from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { applicationService } from "@/services/application.service";
import { jobService } from "@/services/job.service";
import ApplicationCard from "./ApplicationCard";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  pending: { text: "Đang xử lý", color: "text-yellow-600", icon: FiLoader },
  reviewed: { text: "Đã xem", color: "text-blue-600", icon: FiEye },
  interview: { text: "Phỏng vấn", color: "text-purple-600", icon: HiOutlineStatusOnline },
  accepted: { text: "Được nhận", color: "text-green-600", icon: FiCheckCircle },
  rejected: { text: "Từ chối", color: "text-red-600", icon: FiXCircle },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const intervalRef = useRef(null);

  const getStats = (apps) => {
    return {
      total: apps.length,
      pending: apps.filter((a) => a.status === "pending").length,
      reviewed: apps.filter((a) => a.status === "reviewed").length,
      interview: apps.filter((a) => a.status === "interview").length,
      accepted: apps.filter((a) => a.status === "accepted").length,
      rejected: apps.filter((a) => a.status === "rejected").length,
    };
  };

  const loadApplications = async (showToast = false) => {
    try {
      const data = await applicationService.getMyApplications();
      
      const applicationsWithJobs = await Promise.all(
        (data || []).map(async (app) => {
          try {
            const jobDetail = await jobService.getJobById(app.jobId);
            if (jobDetail && jobDetail.status === 'active') {
              return {
                ...app,
                job: jobDetail,
              };
            }
            return null; // Job không active → bỏ qua
          } catch (error) {
            console.error(`Failed to load job ${app.jobId}:`, error);
            return null; // Lỗi → bỏ qua
          }
        })
      );

      // Lọc bỏ các null
      const activeApplications = applicationsWithJobs.filter(app => app !== null);
      
      // Kiểm tra thay đổi
      if (applications.length > 0 && showToast) {
        const hasChanges = JSON.stringify(activeApplications) !== JSON.stringify(applications);
        if (hasChanges) {
          setHasNewUpdates(true);
          toast.success("Có cập nhật mới về trạng thái hồ sơ!");
        }
      }
      
      setApplications(activeApplications);
      setHasNewUpdates(false);
    } catch (error) {
      console.error("Load applications error:", error);
      if (showToast) {
        toast.error("Không thể tải danh sách đã ứng tuyển");
      }
    }
  };

  const initialLoad = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      
      const applicationsWithJobs = await Promise.all(
        (data || []).map(async (app) => {
          try {
            const jobDetail = await jobService.getJobById(app.jobId);
            if (jobDetail && jobDetail.status === 'active') {
              return {
                ...app,
                job: jobDetail,
              };
            }
            return null;
          } catch (error) {
            return null;
          }
        })
      );
      
      const activeApplications = applicationsWithJobs.filter(app => app !== null);
      setApplications(activeApplications);
    } catch (error) {
      console.error("Initial load failed:", error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling: 30 giây 1 lần
  useEffect(() => {
    initialLoad();
    
    intervalRef.current = setInterval(() => {
      loadApplications(true); // silent refresh, có toast khi có thay đổi
    }, 30000); // 30 giây
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleCancel = async (jobId) => {
    if (confirm("Bạn có chắc muốn hủy ứng tuyển này?")) {
      try {
        await applicationService.cancelApplication(jobId);
        toast.success("Đã hủy ứng tuyển");
        await loadApplications(false);
      } catch (error) {
        toast.error("Hủy ứng tuyển thất bại");
      }
    }
  };

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
  const stats = getStats(applications);

  return (
    <div>
      {/* Header với thông báo */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Việc làm đã ứng tuyển</h1>
          <p className="text-text-muted mt-2">Theo dõi trạng thái hồ sơ của bạn</p>
        </div>
        {hasNewUpdates && (
          <button
            onClick={() => loadApplications(false)}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold animate-pulse"
          >
            <FiBell /> Có cập nhật mới
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Tổng số" count={stats.total} color="text-gray-600" icon={FiBriefcase} />
        <StatCard label="Đang xử lý" count={stats.pending} color="text-yellow-600" icon={FiLoader} />
        <StatCard label="Đã xem" count={stats.reviewed} color="text-blue-600" icon={FiEye} />
        <StatCard label="Phỏng vấn" count={stats.interview} color="text-purple-600" icon={HiOutlineStatusOnline} />
        <StatCard label="Được nhận" count={stats.accepted} color="text-green-600" icon={FiCheckCircle} />
        <StatCard label="Từ chối" count={stats.rejected} color="text-red-600" icon={FiXCircle} />
      </div>        

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-card-border pb-4">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Đang xử lý" },
          { key: "reviewed", label: "Đã xem" },
          { key: "interview", label: "Phỏng vấn" },
          { key: "accepted", label: "Được nhận" },
          { key: "rejected", label: "Từ chối" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                : "bg-card-bg text-text-muted hover:bg-card-border"
            }`}
          >
            {tab.label}
            <span className="ml-2 px-1.5 py-0.5 rounded-md text-xs bg-white/20">
              {tab.key === "all" 
                ? applications.length 
                : applications.filter((a) => a.status === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
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