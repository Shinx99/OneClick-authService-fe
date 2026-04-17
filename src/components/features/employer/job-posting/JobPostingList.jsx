"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineVisibility,
  MdOutlineSearch,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useJobs } from "@/hooks/useJobs";
import { jobService } from "@/services/job.service";

// ===== STATUS MAPPING =====
const STATUS_MAP = {
  active: { label: "Đang tuyển", cls: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Chờ duyệt", cls: "bg-amber-50 text-amber-700" },
  closed: { label: "Đã đóng", cls: "bg-slate-100 text-slate-500" },
  deleted: { label: "Đã xóa", cls: "bg-red-50 text-red-500" },
};

const JOB_TYPE_LABELS = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  remote: "Từ xa",
  freelance: "Freelance",
  contract: "Hợp đồng",
  hybrid: "Hybrid",
  internship: "Thực tập",
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const JobPostingList = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filters = {
    keyword: keyword || undefined,
    status: statusFilter || undefined,
    page,
    size: 10,
    sortBy: "createdAt",
    sortDir: "desc",
  };

  const { jobs, pagination, isLoading, error, refetch } = useJobs(filters);

  // ===== DELETE =====
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await jobService.deleteJob(deleteTarget.jobId);
      toast.success("Đã xóa bài đăng thành công!");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.message || "Không thể xóa bài đăng"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ===== SEARCH DEBOUNCE =====
  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Tất cả tin tuyển dụng
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Quản lý và theo dõi tất cả các vị trí đã đăng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm tin đăng..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-56"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang tuyển</option>
              <option value="pending">Chờ duyệt</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm text-slate-400">
              Không tìm thấy bài đăng nào
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Vị trí tuyển dụng
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Loại hình
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Địa điểm
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Trạng thái
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Lượt ứng tuyển
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Ngày đăng
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => {
                  const status =
                    STATUS_MAP[job.status?.toLowerCase()] || STATUS_MAP.active;
                  return (
                    <tr
                      key={job.jobId}
                      onClick={() =>
                        router.push(
                          `/employer/job-posting/edit/${job.jobId}`
                        )
                      }
                      className={`border-b border-slate-50 hover:bg-emerald-50/40 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {job.imgUrl && (
                            <img
                              src={job.imgUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <p className="text-sm font-semibold text-slate-700 line-clamp-1">
                            {job.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-500">
                          {JOB_TYPE_LABELS[job.jobType?.toLowerCase()] ||
                            job.jobType ||
                            "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-500">
                          {job.province || "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {job.applicationCount ?? 0}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-400">
                          {formatDate(job.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              window.open(`/jobs/${job.jobId}`, "_blank")
                            }
                            title="Xem trang công khai"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <MdOutlineVisibility className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/employer/job-posting/edit/${job.jobId}`
                              )
                            }
                            title="Chỉnh sửa"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <MdOutlineEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(job)}
                            title="Xóa"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <MdOutlineDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        {!isLoading && !error && jobs.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Trang {pagination.page + 1} / {pagination.totalPages} · Tổng{" "}
              {pagination.totalElements} tin
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={pagination.page === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdChevronLeft className="w-5 h-5" /> Trước
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i;
                } else if (pagination.page < 3) {
                  pageNum = i;
                } else if (pagination.page > pagination.totalPages - 4) {
                  pageNum = pagination.totalPages - 5 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      pageNum === pagination.page
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages - 1, p + 1))
                }
                disabled={pagination.page >= pagination.totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Tiếp <MdChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Bạn có chắc muốn xóa bài đăng{" "}
              <strong className="text-slate-700">
                &ldquo;{deleteTarget.title}&rdquo;
              </strong>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa bài đăng"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobPostingList;
