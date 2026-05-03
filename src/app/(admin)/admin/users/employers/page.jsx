"use client";
import React, { useState } from "react";
import UserListTable from "@/components/features/admin/users/UserListTable";
import UserFilter from "@/components/features/admin/users/UserFilter";
import UserSearch from "@/components/features/admin/users/UserSearch";
import Pagination from "@/components/features/admin/users/Pagination";
import EmployerDetailModal from "@/components/features/admin/users/EmployerDetailModal";
import { useAdminEmployers } from "@/hooks/useAdminEmployers";
import toast from "react-hot-toast";
import adminService from "@/services/admin.service";

export default function EmployersPage() {
    const { employers, isLoading, page, totalPages, totalElements, status, keyword, changeStatus, changeKeyword, changePage, refetch } = useAdminEmployers();
    const [selectedEmployerId, setSelectedEmployerId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleView = (id) => { setSelectedEmployerId(id); setIsModalOpen(true); };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            await adminService.updateEmployerStatus(id, newStatus);
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
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhà tuyển dụng</h1>
                    <p className="text-sm text-gray-400">Tổng cộng: {totalElements} nhà tuyển dụng</p>
                </div>
                <div className="flex gap-3">
                    <UserSearch searchTerm={keyword} onSearchChange={changeKeyword} />
                    <UserFilter currentStatus={status} onFilterChange={changeStatus} />
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c853]"></div></div>
                ) : (
                    <>
                        <UserListTable data={employers} type="employer" onView={handleView} onToggleStatus={handleToggleStatus} />
                        <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
                    </>
                )}
            </div>
            <EmployerDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} employerId={selectedEmployerId} />
        </div>
    );
}