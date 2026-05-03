"use client";
import React, { useState } from "react";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { adminCompanyService } from "@/services/adminCompany.service";

export default function CompanyTable({ data, onActionComplete }) {
  const [loadingId, setLoadingId] = useState(null);

  // Trạng thái badge styles — dùng opacity để tương thích cả light/dark
  const statusConfig = {
    pending: {
      label: "Đang chờ",
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    active: {
      label: "Đã duyệt",
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    rejected: {
      label: "Từ chối",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  };

  // Duyệt công ty
  const handleApprove = async (companyId, companyName) => {
    if (!confirm(`Bạn chắc chắn muốn duyệt công ty "${companyName}"?`)) return;
    setLoadingId(companyId);
    try {
      await adminCompanyService.approveCompany(companyId);
      toast.success(`Đã duyệt công ty "${companyName}" thành công!`);
      onActionComplete?.();
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error.response?.data?.message || "Có lỗi khi duyệt công ty");
    } finally {
      setLoadingId(null);
    }
  };

  // Từ chối công ty
  const handleReject = async (companyId, companyName) => {
    if (!confirm(`Bạn chắc chắn muốn từ chối công ty "${companyName}"?`)) return;
    setLoadingId(companyId);
    try {
      await adminCompanyService.rejectCompany(companyId);
      toast.success(`Đã từ chối công ty "${companyName}"`);
      onActionComplete?.();
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(error.response?.data?.message || "Có lỗi khi từ chối công ty");
    } finally {
      setLoadingId(null);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center text-text-muted font-medium italic">
        Không có công ty nào...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-card-border">
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
              Công ty
            </th>
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
              Ngành nghề
            </th>
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
              Quy mô
            </th>
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
              Địa điểm
            </th>
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
              Ngày tạo
            </th>
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
              Trạng thái
            </th>
            <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border">
          {data.map((item) => {
            const status = (item.status || "pending").toLowerCase();
            const isLoading = loadingId === item.companyId;
            const badge = statusConfig[status] || statusConfig.pending;

            return (
              <tr
                key={item.companyId}
                className="group hover:bg-foreground/5 transition-all"
              >
                {/* Tên công ty + logo */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.companyName}
                        className="w-9 h-9 rounded-full object-cover border border-card-border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#00c853]/10 flex items-center justify-center font-black text-[#00c853] text-xs uppercase">
                        {(item.companyName || "C").charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-text-main text-sm truncate">
                        {item.companyName}
                      </p>
                      <p className="text-[11px] text-text-muted font-medium truncate">
                        {item.ownerEmail || item.email || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Ngành nghề */}
                <td className="py-4 text-sm font-medium text-text-muted">
                  {item.industry || "—"}
                </td>

                {/* Quy mô */}
                <td className="py-4 text-sm font-medium text-text-muted">
                  {item.sizeRange || "—"}
                </td>

                {/* Địa điểm */}
                <td className="py-4 text-sm font-medium text-text-muted max-w-[140px] truncate">
                  {item.provinceName || item.provinceCode || "—"}
                </td>

                {/* Ngày tạo */}
                <td className="py-4 text-sm text-text-muted font-medium">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </td>

                {/* Trạng thái */}
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </td>

                {/* Thao tác */}
                <td className="py-4">
                  <div className="flex justify-end gap-1">
                    {isLoading ? (
                      <div className="p-2 text-text-muted animate-spin">
                        <FaSpinner size={14} />
                      </div>
                    ) : (
                      <>
                        {status === "pending" && (
                          <button
                            onClick={() =>
                              handleApprove(item.companyId, item.companyName)
                            }
                            className="p-2 rounded-lg text-text-muted hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                            title="Duyệt"
                          >
                            <FaCheck size={13} />
                          </button>
                        )}
                        {status === "pending" && (
                          <button
                            onClick={() =>
                              handleReject(item.companyId, item.companyName)
                            }
                            className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Từ chối"
                          >
                            <FaTimes size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
