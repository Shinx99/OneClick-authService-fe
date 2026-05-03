"use client";
import React, { useState } from "react";
import UserListTable from "@/components/features/admin/users/UserListTable";
import UserFilter from "@/components/features/admin/users/UserFilter";
import UserSearch from "@/components/features/admin/users/UserSearch";
import Pagination from "@/components/features/admin/users/Pagination";
import CandidateDetailModal from "@/components/features/admin/users/CandidateDetailModal";
import { useAdminCandidates } from "@/hooks/useAdminCandidates";
import toast from "react-hot-toast";
import adminService from "@/services/admin.service";

export default function CandidatesPage() {
  const {
    candidates,
    isLoading,
    page,
    totalPages,
    totalElements,
    status,
    keyword,
    changeStatus,
    changeKeyword,
    changePage,
    refetch,
  } = useAdminCandidates();

  // State cho modal chi tiết
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (candidateId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await adminService.updateCandidateStatus(candidateId, newStatus);
      toast.success(`Đã ${newStatus === "active" ? "mở khóa" : "khóa"} tài khoản`);
      refetch();
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Ứng viên</h1>
          <p className="text-sm text-gray-400 mt-1">Tổng cộng: {totalElements} ứng viên</p>
        </div>
        <div className="flex gap-3">
          <UserSearch searchTerm={keyword} onSearchChange={changeKeyword} />
          <UserFilter currentStatus={status} onFilterChange={changeStatus} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c853]"></div>
          </div>
        ) : (
          <>
            <UserListTable
              data={candidates}
              type="candidate"
              onView={handleView}
              onToggleStatus={handleToggleStatus}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
          </>
        )}
      </div>

      {/* Modal chi tiết */}
      <CandidateDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidateId={selectedCandidateId}
      />
    </div>
  );
}