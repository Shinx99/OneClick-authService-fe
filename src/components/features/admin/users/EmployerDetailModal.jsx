"use client";
import React, { useEffect, useState } from "react";
import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaBuilding, FaShieldAlt } from "react-icons/fa";
import adminService from "@/services/admin.service";

const EmployerDetailModal = ({ isOpen, onClose, employerId }) => {
    const [employer, setEmployer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !employerId) return;
        setIsLoading(true);
        adminService.getEmployerDetail(employerId)
            .then(setEmployer)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [isOpen, employerId]);

    if (!isOpen) return null;

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "N/A";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center px-8 py-5 border-b">
                    <h2 className="text-xl font-black">Chi tiết nhà tuyển dụng</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><FaTimes /></button>
                </div>
                <div className="overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00c853]"></div></div>
                    ) : employer ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2"><FaEnvelope className="text-gray-400" /><span>{employer.email}</span></div>
                                <div className="flex items-center gap-2"><FaPhone className="text-gray-400" /><span>{employer.phone || "N/A"}</span></div>
                                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /><span>{[employer.commune, employer.province].filter(Boolean).join(", ") || "N/A"}</span></div>
                                <div className="flex items-center gap-2"><FaBirthdayCake className="text-gray-400" /><span>{formatDate(employer.birthday)}</span></div>
                                <div className="flex items-center gap-2"><FaShieldAlt className="text-gray-400" /><span>CCCD: {employer.cccd || "N/A"}</span></div>
                                <div className="flex items-center gap-2"><span>Trạng thái: {employer.status}</span></div>
                            </div>
                            {employer.companyName && (
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="font-bold mb-2 flex items-center gap-2"><FaBuilding /> Công ty</h3>
                                    <p>{employer.companyName} (MST: {employer.companyTaxCode || "N/A"})</p>
                                </div>
                            )}
                        </div>
                    ) : <p className="text-center text-gray-500">Không thể tải thông tin</p>}
                </div>
            </div>
        </div>
    );
};

export default EmployerDetailModal;