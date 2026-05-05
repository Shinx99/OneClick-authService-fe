// components/features/admin/content/CompanyDetailModal.jsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  Users,
  Award,
  Heart,
  ExternalLink,
} from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: CheckCircle,
        text: "Đã duyệt",
      };
    case "pending":
      return {
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: Clock,
        text: "Chờ duyệt",
      };
    case "rejected":
      return {
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        icon: XCircle,
        text: "Từ chối",
      };
    default:
      return {
        color: "text-gray-500",
        bg: "bg-gray-500/10",
        border: "border-gray-500/20",
        icon: Clock,
        text: status || "Không xác định",
      };
  }
};

// Component Banner - Fix background và logo
const ModalBanner = ({ company, onClose, statusConfig, StatusIcon }) => {
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [coverLoading, setCoverLoading] = useState(true);
  const hasCover = company.cover && company.cover.trim() !== "" && !coverError;

  return (
    <div className="relative w-full h-80 rounded-t-2xl overflow-hidden">
      {/* Background - Luôn có gradient hoặc ảnh */}
      <div className="absolute inset-0">
        {hasCover ? (
          <>
            {coverLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
              src={company.cover}
              alt={`${company.name} cover`}
              className="w-full h-full object-cover"
              onError={() => setCoverError(true)}
              onLoad={() => setCoverLoading(false)}
            />
          </>
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          />
        )}
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      
      {/* Pattern trang trí khi không có ảnh */}
      {!hasCover && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}
      
      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white transition-all"
      >
        <X size={18} />
      </button>

      {/* Content - Logo và thông tin */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          {/* Logo */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white flex-shrink-0">
            {company.logo && !logoError ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Building2 size={48} className="text-emerald-500" />
            )}
          </div>

          {/* Thông tin công ty */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg">
              {company.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} backdrop-blur-sm`}
              >
                <StatusIcon size={12} />
                {statusConfig.text}
              </span>
              
              {company.slogan && (
                <span className="text-xs sm:text-sm text-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/30">
                  {company.slogan}
                </span>
              )}
              
              {company.industry && (
                <span className="text-xs sm:text-sm text-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/30">
                  {company.industry}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Component Overview
const ModalOverview = ({ description }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
      <Building2 size={18} className="text-emerald-500 sm:w-5 sm:h-5" />
      Giới thiệu công ty
    </h3>
    <div className="prose prose-sm max-w-none">
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
        {description || "Chưa có thông tin giới thiệu"}
      </p>
    </div>
  </div>
);

// Component Contact
const ModalContact = ({ company }) => {
  const hasContactInfo = company.website || company.email || company.phone || company.address || company.size || company.taxCode;
  
  if (!hasContactInfo) return null;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        Thông tin liên hệ
      </h3>
      
      <div className="space-y-3 sm:space-y-4">

        {company.email && (
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
              <a href={`mailto:${company.email}`} className="text-sm text-gray-700 hover:text-emerald-600 break-all">
                {company.email}
              </a>
            </div>
          </div>
        )}

        {company.phone && (
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">Số điện thoại</p>
              <a href={`tel:${company.phone}`} className="text-sm text-gray-700 hover:text-emerald-600">
                {company.phone}
              </a>
            </div>
          </div>
        )}

        {company.address && (
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">Địa chỉ</p>
              <p className="text-sm text-gray-700">{company.address}</p>
            </div>
          </div>
        )}

        {company.size && (
          <div className="flex items-start gap-3">
            <Users size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">Quy mô</p>
              <p className="text-sm text-gray-700">{company.size}</p>
            </div>
          </div>
        )}

        {company.taxCode && (
          <div className="flex items-start gap-3">
            <Award size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">Mã số thuế</p>
              <p className="text-sm text-gray-700 font-mono">{company.taxCode}</p>
            </div>
          </div>
        )}

        {company.website && (
          <div className="flex items-start gap-3">
            <Globe size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">Website</p>
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-600 hover:underline flex items-center gap-1 break-all"
              >
                {company.website}
                <ExternalLink size={12} className="flex-shrink-0" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component Stats
const ModalStats = ({ company }) => {
  const hasStats = (company.totalJobs > 0) || (company.activeJobs > 0) || (company.totalEmployees > 0) || (company.yearsActive > 0);
  
  if (!hasStats) return null;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <Heart size={18} className="text-emerald-500 sm:w-5 sm:h-5" />
        Thống kê hoạt động
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {company.totalJobs > 0 && (
          <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
            <Briefcase size={16} className="mx-auto mb-1 text-blue-500 sm:w-5 sm:h-5" />
            <p className="text-base sm:text-xl font-black text-blue-600">{company.totalJobs}</p>
            <p className="text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase">Tin tuyển dụng</p>
          </div>
        )}
        {company.activeJobs > 0 && (
          <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
            <Heart size={16} className="mx-auto mb-1 text-emerald-500 sm:w-5 sm:h-5" />
            <p className="text-base sm:text-xl font-black text-emerald-600">{company.activeJobs}</p>
            <p className="text-[8px] sm:text-[10px] font-bold text-emerald-500 uppercase">Đang tuyển</p>
          </div>
        )}
        {company.totalEmployees > 0 && (
          <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
            <Users size={16} className="mx-auto mb-1 text-purple-500 sm:w-5 sm:h-5" />
            <p className="text-base sm:text-xl font-black text-purple-600">{company.totalEmployees}</p>
            <p className="text-[8px] sm:text-[10px] font-bold text-purple-500 uppercase">Nhân sự</p>
          </div>
        )}
        {company.yearsActive > 0 && (
          <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl">
            <Calendar size={16} className="mx-auto mb-1 text-amber-500 sm:w-5 sm:h-5" />
            <p className="text-base sm:text-xl font-black text-amber-600">{company.yearsActive}</p>
            <p className="text-[8px] sm:text-[10px] font-bold text-amber-500 uppercase">Năm hoạt động</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component Representative
const ModalRepresentative = ({ company }) => {
  if (!company.representative) return null;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <User size={18} className="text-emerald-500 sm:w-5 sm:h-5" />
        Người đại diện
      </h3>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-emerald-500 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm sm:text-base">{company.representative}</p>
          {company.representativeTitle && (
            <p className="text-xs text-gray-500">{company.representativeTitle}</p>
          )}
          {company.representativeEmail && (
            <a href={`mailto:${company.representativeEmail}`} className="text-xs text-emerald-600 hover:underline break-all">
              {company.representativeEmail}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Component Date Info
const ModalDateInfo = ({ company }) => (
  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100">
    {company.createdAt && (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar size={11} />
        <span>Tham gia: {formatDate(company.createdAt)}</span>
      </div>
    )}
    {company.updatedAt && (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar size={11} />
        <span>Cập nhật: {formatDate(company.updatedAt)}</span>
      </div>
    )}
  </div>
);

// MAIN MODAL COMPONENT
const CompanyDetailModal = ({ company, onClose, onApprove, onReject }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!company) return null;

  // Map dữ liệu company
  const mappedCompany = {
    ...company,
    name: company.companyName || company.name,
    cover: company.backgroundUrl || company.coverImage || company.cover,
    logo: company.logoUrl || company.logoImage || company.logo,
    website: company.websiteUrl || company.website, 
    industry: company.industry || company.sector || company.field,
    size: company.sizeRange || company.employeeSize || company.size,
    description: company.overview || company.about || company.description,
    slogan: company.slogan || company.tagline || company.quote,
    representative: company.businessRepName || company.representative, 
    totalJobs: company.totalJobs || company.jobCount || 0,
    activeJobs: company.activeJobs || company.activeJobCount || 0,
    totalEmployees: company.totalEmployees || company.employeeCount || 0,
    yearsActive: company.yearsActive || company.foundedYear ? new Date().getFullYear() - company.foundedYear : 0,
    email: company.email || company.contactEmail, 
    phone: company.phone || company.contactPhone,  
    address: company.address || company.location,  
    taxCode: company.taxCode, 
  };

  const statusConfig = getStatusConfig(company.status);
  const StatusIcon = statusConfig.icon;
  const isPending = company.status?.toLowerCase() === "pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gray-50 rounded-xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner với Background và Logo */}
        <ModalBanner 
          company={mappedCompany} 
          onClose={onClose}
          statusConfig={statusConfig}
          StatusIcon={StatusIcon}
        />

        {/* Nội dung chính */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <ModalOverview description={mappedCompany.description} />
              <ModalStats company={mappedCompany} />
              {mappedCompany.representative && (
                <ModalRepresentative company={mappedCompany} />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <ModalContact company={mappedCompany} />
            </div>
          </div>

          {/* Date Info */}
          <ModalDateInfo company={company} />
        </div>

        {/* Footer Actions */}
        {isPending && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-2 sm:gap-3 rounded-b-xl sm:rounded-b-2xl">
            <button
              onClick={() => onReject(company.companyId, company.companyName)}
              className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              Từ chối
            </button>
            <button
              onClick={() => onApprove(company.companyId, company.companyName)}
              className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Duyệt công ty
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailModal;