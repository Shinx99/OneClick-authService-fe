"use client";
import React, { useEffect, useState } from "react";
import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaShieldAlt, FaCalendarCheck, FaUserClock } from "react-icons/fa";
import adminService from "@/services/admin.service";

const CandidateDetailModal = ({ isOpen, onClose, candidateId }) => {
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !candidateId) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await adminService.getCandidateDetail(candidateId);
        setCandidate(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết ứng viên:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [isOpen, candidateId]);

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const renderStatusBadge = (status) => {
    let color = "";
    switch (status?.toLowerCase()) {
      case "active": color = "bg-green-100 text-green-700 border-green-200"; break;
      case "inactive": color = "bg-red-100 text-red-700 border-red-200"; break;
      default: color = "bg-gray-100 text-gray-600 border-gray-200";
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
        {status === "active" ? "Hoạt động" : status === "inactive" ? "Đã khóa" : status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-800">Chi tiết ứng viên</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00c853]"></div>
            </div>
          ) : candidate ? (
            <div className="space-y-6">
              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-600">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <span className="text-gray-600">{candidate.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-gray-600">{[candidate.commune, candidate.province].filter(Boolean).join(", ") || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaBirthdayCake className="text-gray-400" />
                  <span className="text-gray-600">{candidate.birthday ? formatDate(candidate.birthday) : "N/A"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-gray-400" />
                  <span className="text-gray-600">CCCD: {candidate.cccd || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarCheck className="text-gray-400" />
                  <span className="text-gray-600">Tham gia: {formatDate(candidate.createdAt)}</span>
                </div>
              </div>

              <div>{renderStatusBadge(candidate.status)}</div>

              {/* Kỹ năng */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm text-gray-800 mb-2">Kỹ năng</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Học vấn */}
              {candidate.educations && candidate.educations.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm text-gray-800 mb-2">Học vấn</h3>
                  <div className="space-y-2">
                    {candidate.educations.map((edu) => (
                      <div key={edu.educationId} className="bg-gray-50 p-3 rounded-xl">
                        <p className="font-medium text-sm">{edu.schoolName} {edu.degree && `- ${edu.degree}`}</p>
                        <p className="text-xs text-gray-500">{edu.fieldOfStudy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kinh nghiệm */}
              {candidate.experiences && candidate.experiences.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm text-gray-800 mb-2">Kinh nghiệm</h3>
                  <div className="space-y-2">
                    {candidate.experiences.map((exp) => (
                      <div key={exp.experienceId} className="bg-gray-50 p-3 rounded-xl">
                        <p className="font-medium text-sm">{exp.headline} tại {exp.companyName || exp.customCompanyName}</p>
                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.isCurrent ? "Hiện tại" : exp.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">Không thể tải thông tin</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;