"use client";
import React from "react";
import {
  FaBuilding,
  FaIdCard,
  FaUsers,
  FaFilePdf,
  FaTimes,
  FaGlobe,
  FaMapMarkerAlt,
  FaImage,
  FaUserTie,
  FaIndustry,
  FaInfoCircle,
} from "react-icons/fa";
import PROVINCES from "@/constants/vn-provinces.json";
import { useCreateCompany } from "./useCreateCompany";

// ============ Sub-components nội bộ ============

const FieldLabel = ({ children, tone = "muted" }) => (
  <label
    className={`block text-[11px] font-medium uppercase tracking-widest mb-2 ${
      tone === "indigo"
        ? "text-indigo-700 dark:text-indigo-400"
        : "text-text-muted"
    }`}
  >
    {children}
  </label>
);

const IconInput = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
      {icon}
    </span>
    <input
      type="text"
      {...props}
      className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
    />
  </div>
);

const IconSelect = ({ icon, children, ...props }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
      {icon}
    </span>
    <select
      {...props}
      className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none appearance-none cursor-pointer"
    >
      {children}
    </select>
  </div>
);

const FileUpload = ({
  file,
  setFile,
  inputRef,
  onDrop,
  type,
  accept,
  icon,
  accent, // 'indigo' | 'green'
  title,
  hint,
}) => {
  const borders =
    accent === "green"
      ? "hover:border-[#00c853] hover:bg-green-50/50"
      : "hover:border-indigo-500 hover:bg-indigo-50/50";
  const filled =
    accent === "green"
      ? "border-[#00c853] bg-green-50/50 dark:bg-green-500/10"
      : "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10";
  const iconColor = accent === "green" ? "text-rose-500" : "text-indigo-500";

  if (file) {
    return (
      <div
        className={`p-4 border-2 ${filled} rounded-2xl flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <span className={iconColor}>{icon}</span>
          </div>
          <span className="text-[13px] font-medium truncate max-w-[120px]">
            {file.name}
          </span>
        </div>
        <button
          onClick={() => setFile(null)}
          className="text-text-muted hover:text-rose-500 p-1"
          type="button"
        >
          <FaTimes />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, type)}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed border-card-border ${borders} bg-background rounded-2xl p-6 text-center cursor-pointer transition-all group`}
    >
      <span className="block w-8 h-8 mx-auto text-text-muted mb-3 text-2xl">
        {icon}
      </span>
      <p className="text-[13px] font-medium text-text-main mb-1">{title}</p>
      <p className="text-[11px] text-text-muted font-normal">{hint}</p>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
  );
};

// ============ Main component ============

export default function CreateCompanyScreen({ onCancel, onSuccess }) {
  const {
    formData,
    setField,
    logoFile,
    setLogoFile,
    docFile,
    setDocFile,
    logoInputRef,
    docInputRef,
    isLoading,
    handleDrop,
    handleSubmit,
  } = useCreateCompany({ onSuccess });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-8">
        <div>
          <h2 className="text-2xl font-medium text-text-main mb-2">
            Thông tin pháp lý công ty
          </h2>
          <p className="text-[13px] text-text-muted font-normal mb-8">
            Thông tin này phải khớp hoàn toàn với Giấy phép Đăng ký kinh doanh
            của bạn.
          </p>

          {/* Nhóm pháp lý */}
          <div className="bg-indigo-50/30 dark:bg-indigo-500/5 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-[20px] p-6 mb-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <FieldLabel tone="indigo">Tên công ty đầy đủ *</FieldLabel>
                <IconInput
                  icon={<FaBuilding />}
                  placeholder="Công ty Cổ phần..."
                  value={formData.company_name}
                  onChange={(e) => setField("company_name", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel tone="indigo">Mã số thuế *</FieldLabel>
                <IconInput
                  icon={<FaIdCard />}
                  placeholder="Mã số doanh nghiệp"
                  value={formData.tax_code}
                  onChange={(e) => setField("tax_code", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel tone="indigo">Người đại diện pháp luật</FieldLabel>
                <IconInput
                  icon={<FaUserTie />}
                  placeholder="Họ và tên..."
                  value={formData.business_rep_name}
                  onChange={(e) =>
                    setField("business_rep_name", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Nhóm thông tin thêm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <FieldLabel>Ngành nghề (Industry)</FieldLabel>
              <IconSelect
                icon={<FaIndustry />}
                value={formData.industry}
                onChange={(e) => setField("industry", e.target.value)}
              >
                <option value="IT Services">Công nghệ thông tin</option>
                <option value="Finance">Tài chính - Ngân hàng</option>
                <option value="E-commerce">Thương mại điện tử</option>
                <option value="AI/ML">AI & Machine Learning</option>
              </IconSelect>
            </div>
            <div>
              <FieldLabel>Quy mô (Size) *</FieldLabel>
              <IconSelect
                icon={<FaUsers />}
                value={formData.size_range}
                onChange={(e) => setField("size_range", e.target.value)}
              >
                <option value="1-50">1-50 nhân viên</option>
                <option value="50-150">50-150 nhân viên</option>
                <option value="150-500">150-500 nhân viên</option>
                <option value="500-1000">500-1000 nhân viên</option>
                <option value="1000+">1000+ nhân viên</option>
              </IconSelect>
            </div>
            <div>
              <FieldLabel>Tỉnh/Thành phố</FieldLabel>
              <IconSelect
                icon={<FaMapMarkerAlt />}
                value={formData.province_code}
                onChange={(e) => setField("province_code", e.target.value)}
              >
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </IconSelect>
            </div>
            <div>
              <FieldLabel>Website</FieldLabel>
              <IconInput
                icon={<FaGlobe />}
                placeholder="https://"
                value={formData.website_url}
                onChange={(e) => setField("website_url", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Địa chỉ chi tiết</FieldLabel>
              <input
                type="text"
                placeholder="Số nhà, Phường/Xã, Quận/Huyện..."
                value={formData.address}
                onChange={(e) => setField("address", e.target.value)}
                className="w-full px-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Giới thiệu tổng quan (Overview) *</FieldLabel>
              <div className="relative">
                <FaInfoCircle className="absolute left-4 top-4 text-text-muted" />
                <textarea
                  rows="4"
                  placeholder="Giới thiệu ngắn gọn về công ty, sứ mệnh và văn hóa..."
                  value={formData.overview}
                  onChange={(e) => setField("overview", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <FieldLabel>Logo công ty (Tùy chọn)</FieldLabel>
              <FileUpload
                file={logoFile}
                setFile={setLogoFile}
                inputRef={logoInputRef}
                onDrop={handleDrop}
                type="logo"
                accept="image/*"
                icon={<FaImage />}
                accent="indigo"
                title="Tải lên logo hoặc kéo thả"
                hint="PNG, JPG, JPEG tối đa 5MB"
              />
            </div>
            <div>
              <FieldLabel>Giấy phép ĐKKD *</FieldLabel>
              <FileUpload
                file={docFile}
                setFile={setDocFile}
                inputRef={docInputRef}
                onDrop={handleDrop}
                type="doc"
                accept=".pdf,.doc,.docx,.jpg,.png"
                icon={<FaFilePdf />}
                accent="green"
                title="Tải lên tài liệu hoặc kéo thả"
                hint="PDF, DOC, DOCX, JPG, PNG (Tối đa 5MB)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-6 md:px-12 md:py-6 border-t-2 border-card-border bg-card-bg flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-8 py-3.5 bg-background border-2 border-card-border text-text-main text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-slate-50 transition-all active:scale-95"
        >
          Hủy
        </button>
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="px-8 py-3.5 bg-indigo-600 text-white text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? "Đang xử lý..." : "Gửi hồ sơ duyệt"}
        </button>
      </div>
    </div>
  );
}
