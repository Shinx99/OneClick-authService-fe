"use client";
import React from "react";
import Link from "next/link";
import {
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiCalendar,
  FiEye,
  FiXCircle,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";

const STATUS_CONFIG = {
  pending: { text: "Đang xem xét", color: "text-yellow-600", bg: "bg-yellow-50", icon: FiLoader, progress: 25 },
  reviewed: { text: "Đã xem", color: "text-blue-600", bg: "bg-blue-50", icon: FiEye, progress: 50 },
  interview: { text: "Phỏng vấn", color: "text-purple-600", bg: "bg-purple-50", icon: HiOutlineStatusOnline, progress: 75 },
  accepted: { text: "Được nhận", color: "text-green-600", bg: "bg-green-50", icon: FiCheckCircle, progress: 100 },
  rejected: { text: "Từ chối", color: "text-red-600", bg: "bg-red-50", icon: FiXCircle, progress: 0 },
};

const ApplicationCard = ({ application, job, onCancel }) => {
  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatSalary = (min, max) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `Từ ${formatter.format(min)}`;
    if (max) return `Tới ${formatter.format(max)}`;
    return "Thỏa thuận";
  };

  return (
    <div className="bg-card-bg rounded-2xl border border-card-border hover:shadow-lg transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/jobs/${application.jobId}`} className="block group">
              <h2 className="text-lg font-bold text-text-main group-hover:text-green-500 transition-colors line-clamp-1">
                {job?.title || "Đã bị xóa"}
              </h2>
            </Link>
            <p className="text-text-muted text-sm mt-1">{job?.companyName || "Công ty"}</p>
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-muted">
              {job?.province && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={14} /> {job.province}
                </span>
              )}
              {job?.salaryMin && (
                <span className="flex items-center gap-1">
                  <FiDollarSign size={14} /> {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              )}
              {job?.jobType && (
                <span className="flex items-center gap-1">
                  <FiBriefcase size={14} /> {job.jobType}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <StatusIcon className={`text-sm ${statusConfig.color}`} />
              </div>
              <span className={`text-sm font-bold ${statusConfig.color}`}>{statusConfig.text}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <FiCalendar size={12} />
              <span>Ứng tuyển: {formatDate(application.appliedAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${statusConfig.progress}%`,
                backgroundColor: statusConfig.color.replace("text-", "").replace("-600", ""),
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4 pt-4 border-t border-card-border">
          <Link
            href={`/jobs/${application.jobId}`}
            className="flex-1 text-center px-4 py-2 rounded-xl border border-card-border text-text-main font-medium hover:border-green-500 hover:text-green-500 transition-colors text-sm"
          >
            Xem chi tiết
          </Link>
          {application.status === "pending" && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors text-sm"
            >
              Hủy ứng tuyển
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;