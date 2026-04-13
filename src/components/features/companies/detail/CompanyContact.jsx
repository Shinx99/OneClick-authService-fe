import React from "react";
import { FaGlobe, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

// Chuyển thành Server Component (Xóa "use client")
// Component này nhận object contact từ trang cha thông qua props
const CompanyContact = ({ contact = {} }) => {
  return (
    <div className="bg-card-bg p-6 rounded-3xl border border-card-border space-y-6 transition-all shadow-sm hover:shadow-md">
      <h3 className="font-bold text-lg text-text-main">Thông tin liên hệ</h3>

      <div className="space-y-4">
        {/* Website */}
        <div className="flex items-start gap-4 group">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-[#00c853] transition-colors group-hover:bg-[#00c853] group-hover:text-white">
            <FaGlobe />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
              Website
            </p>
            {contact.websiteUrl ? (
              <a
                href={`https://${contact.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#00c853] font-bold hover:underline block truncate"
              >
                {contact.websiteUrl}
              </a>
            ) : (
              <p className="text-sm text-gray-400 italic">Đang cập nhật...</p>
            )}
          </div>
        </div>

        {/* Quy mô nhân sự */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-[#00c853]">
            <FaUsers />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
              Quy mô
            </p>
            <p className="text-sm font-bold text-text-main">
              {contact.size || "Chưa xác định"}
            </p>
          </div>
        </div>

        {/* Địa chỉ trụ sở */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-[#00c853]">
            <FaMapMarkerAlt />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
              Địa chỉ
            </p>
            <p className="text-sm font-medium text-text-muted leading-snug">
              {contact.address || "Đang cập nhật địa chỉ..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyContact;
