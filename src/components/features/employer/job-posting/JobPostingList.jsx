"use client";
import React, { useState } from "react";
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
import { FaUsers } from "react-icons/fa"; // Thêm icon Users
import { useJobs } from "@/hooks/useJobs";
import { jobService } from "@/services/job.service";
import Link from "next/link"; // Quan trọng: Thêm Link

// ===== STATUS MAPPING =====
const STATUS_MAP = {
  active: {
    label: "Đang tuyển",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Chờ duyệt",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  closed: {
    label: "Đã đóng",
    cls: "bg-slate-100 text-slate-500 border-slate-200",
  },
  deleted: { label: "Đã xóa", cls: "bg-red-50 text-red-500 border-red-200" },
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
      toast.error(err.response?.data?.message || "Không thể xóa bài đăng");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Header Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b-2 border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <MdOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm chức danh..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang tuyển</option>
              <option value="pending">Chờ duyệt</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm text-rose-500 font-bold">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
              <MdOutlineSearch size={32} />
            </div>
            <p className="text-[15px] font-bold text-slate-600">
              Chưa có tin tuyển dụng nào
            </p>
            <p className="text-[13px] text-slate-400">
              Hãy tạo tin tuyển dụng đầu tiên của bạn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/30 border-b-2 border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Vị trí tuyển dụng
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Loại hình
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Hồ sơ ứng viên
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50 dark:divide-slate-800/50">
                {jobs.map((job) => {
                  const status =
                    STATUS_MAP[job.status?.toLowerCase()] || STATUS_MAP.active;
                  const totalApp = job.applicationCount ?? 0;

                  return (
                    <tr
                      key={job.jobId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      {/* Cột 1: Thông tin Job */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {job.imgUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={job.imgUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              // eslint-disable-next-line react/jsx-no-undef
                              <FaBriefcase className="text-emerald-500 text-lg" />
                            )}
                          </div>
                          <div>
                            <p
                              onClick={() =>
                                router.push(
                                  `/employer/job-posting/edit/${job.jobId}`,
                                )
                              }
                              className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1"
                            >
                              {job.title}
                            </p>
                            <p className="text-[12px] text-slate-500 mt-1 font-medium">
                              Đăng ngày: {formatDate(job.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-[13px] font-medium text-slate-600">
                        {JOB_TYPE_LABELS[job.jobType?.toLowerCase()] ||
                          job.jobType ||
                          "—"}
                      </td>

                      <td className="px-6 py-5 text-[13px] font-medium text-slate-600">
                        {job.province || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-lg text-[11px] font-bold border ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* CỘT QUAN TRỌNG: LINK SANG KANBAN BOARD */}
                      <td className="px-6 py-5 text-center">
                        <Link
                          href={`/employer/candidate?jobId=${job.jobId}`}
                          onClick={(e) => e.stopPropagation()} // Chặn click lan ra dòng
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-xl text-[13px] font-bold transition-all hover:scale-105"
                        >
                          <FaUsers size={16} /> {totalApp} CV
                          {/* Highlight nếu có CV */}
                          {totalApp > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1"></span>
                          )}
                        </Link>
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              window.open(`/jobs/${job.jobId}`, "_blank")
                            }
                            title="Xem trang công khai"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <MdOutlineVisibility className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/employer/job-posting/edit/${job.jobId}`,
                              )
                            }
                            title="Chỉnh sửa"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <MdOutlineEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(job)}
                            title="Xóa"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <MdOutlineDelete className="w-5 h-5" />
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
          <div className="flex items-center justify-between p-6 border-t-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
            <p className="text-[13px] font-medium text-slate-500">
              Trang {pagination.page + 1} / {pagination.totalPages} · Tổng{" "}
              {pagination.totalElements} tin
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={pagination.page === 0}
                className="flex items-center gap-1 px-4 py-2 text-[13px] font-bold text-slate-600 bg-white border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdChevronLeft className="w-5 h-5" /> Trước
              </button>

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages - 1, p + 1))
                }
                disabled={pagination.page >= pagination.totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 text-[13px] font-bold text-slate-600 bg-white border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Tiếp <MdChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL XÓA (Giữ nguyên logic của bạn) ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdOutlineDelete size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Xác nhận xóa tin
            </h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Bạn có chắc muốn xóa bài đăng <br />
              <strong className="text-slate-800">{deleteTarget.title}</strong>?
              <br /> Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-[14px] font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-[14px] font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors flex justify-center items-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
