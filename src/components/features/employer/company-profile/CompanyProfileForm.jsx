"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MdOutlineCameraAlt } from "react-icons/md";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { companyService } from "@/services/company.service";
import { INDUSTRIES } from "@/utils/Industries";

const SIZE_OPTIONS = [
  { value: "1-50", label: "1-50 nhân viên" },
  { value: "50-150", label: "50-150 nhân viên" },
  { value: "150-500", label: "150-500 nhân viên" },
  { value: "500-1000", label: "500-1000 nhân viên" },
  { value: "1000+", label: "1000+ nhân viên" },
];

const EMPTY_FORM = {
  companyName: "",
  taxCode: "",
  businessLicenseUrl: "",
  businessRepName: "",
  financialProofUrl: "",
  websiteUrl: "",
  provinceCode: "",
  industry: "",
  sizeRange: "",
  overview: "",
  address: "",
};

const CompanyProfileForm = () => {
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [original, setOriginal] = useState(EMPTY_FORM);
  const [logoUrl, setLogoUrl] = useState(null);
  const [bgUrl, setBgUrl] = useState(null);
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  // Fetch company info on mount
  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await companyService.getMyCompany();
      const c = res.data || {};
      const next = {
        companyName: c.companyName || "",
        taxCode: c.taxCode || "",
        businessLicenseUrl: c.businessLicenseUrl || "",
        businessRepName: c.businessRepName || "",
        financialProofUrl: c.financialProofUrl || "",
        websiteUrl: c.websiteUrl || "",
        provinceCode: c.provinceCode || "",
        industry: c.industry || "",
        sizeRange: c.sizeRange || "",
        overview: c.overview || "",
        address: c.address || "",
      };
      setForm(next);
      setOriginal(next);
      setLogoUrl(c.logoUrl || null);
      setBgUrl(c.backgroundUrl || null);
      setStatus(c.status || "");
    } catch (err) {
      console.error("Fetch company failed:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải thông tin công ty",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    setForm(original);
    setEditMode(false);
  };

  const handleSave = async () => {
    // Basic client-side validation
    if (!form.companyName.trim()) {
      toast.error("Tên công ty không được để trống");
      return;
    }
    if (!form.taxCode.trim()) {
      toast.error("Mã số thuế không được để trống");
      return;
    }
    if (!form.sizeRange) {
      toast.error("Vui lòng chọn quy mô công ty");
      return;
    }
    if (!form.overview.trim()) {
      toast.error("Mô tả công ty không được để trống");
      return;
    }

    setSaving(true);
    try {
      const res = await companyService.updateMyCompany(form);
      toast.success(res.message || "Cập nhật thông tin công ty thành công!");
      setOriginal(form);
      setEditMode(false);
    } catch (err) {
      console.error("Update company failed:", err);
      toast.error(
        err.response?.data?.message || "Không thể cập nhật thông tin công ty",
      );
    } finally {
      setSaving(false);
    }
  };

  // --- Logo Upload ---
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await companyService.uploadCompanyLogo(file);
      if (res.success) {
        setLogoUrl(res.data.logoUrl);
        toast.success("Đã cập nhật logo");
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
      toast.error("Tải logo thất bại");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  // --- Background Upload ---
  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    try {
      const res = await companyService.uploadCompanyBackground(file);
      if (res.success) {
        setBgUrl(res.data.backgroundUrl);
        toast.success("Đã cập nhật ảnh bìa");
      }
    } catch (err) {
      console.error("Background upload failed:", err);
      toast.error("Tải ảnh bìa thất bại");
    } finally {
      setUploadingBg(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
        <p className="text-slate-400 font-medium">
          Đang tải thông tin công ty...
        </p>
      </div>
    );
  }

  const statusBadge =
    {
      active: {
        label: "Đã duyệt",
        className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      },
      pending: {
        label: "Đang chờ duyệt",
        className: "bg-amber-50 text-amber-600 border-amber-200",
      },
      rejected: {
        label: "Đã bị từ chối",
        className: "bg-rose-50 text-rose-600 border-rose-200",
      },
    }[status] || null;

  const inputClass = (disabled) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${disabled
      ? "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed"
      : "bg-white border-slate-300 text-slate-700"
    }`;

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
      />
      <input
        ref={bgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBgUpload}
      />

      {/* Cover Image */}
      <div className="relative h-70 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-600 overflow-hidden">
        {bgUrl && (
          <Image
            src={bgUrl}
            alt="Company Background"
            fill
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.15"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        />
        <button
          onClick={() => bgInputRef.current?.click()}
          disabled={uploadingBg}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 text-white text-xs font-medium rounded-lg hover:bg-black/50 transition-all backdrop-blur-sm disabled:opacity-50"
        >
          <MdOutlineCameraAlt className="w-4 h-4" />
          {uploadingBg ? "Đang tải…" : "Đổi ảnh bìa"}
        </button>

        {/* Logo */}
        <div className="absolute -bottom-8 mb-10 left-6">
          <button
            onClick={() => logoInputRef.current?.click()}
            disabled={uploadingLogo}
            className="w-25 h-25 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative group cursor-pointer disabled:opacity-50"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Company Logo"
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <MdOutlineCameraAlt className="text-white w-6 h-6" />
            </div>
          </button>
          {uploadingLogo && (
            <p className="text-[10px] text-emerald-600 mt-1 text-center font-medium">
              Đang tải…
            </p>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-700">
            Thông tin chi tiết
          </h3>
          {statusBadge && (
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          )}
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-all"
          >
            <FiEdit2 size={14} /> Chỉnh sửa
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-all disabled:opacity-50"
            >
              <FiX size={14} /> Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
            >
              <FiSave size={14} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tên công ty *
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              disabled={!editMode}
              className={inputClass(!editMode)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Mã số thuế *
            </label>
            <input
              type="text"
              value={form.taxCode}
              onChange={(e) => handleChange("taxCode", e.target.value)}
              disabled={!editMode}
              maxLength={20}
              className={inputClass(!editMode)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Website
            </label>
            <input
              type="text"
              value={form.websiteUrl}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              disabled={!editMode}
              placeholder="https://..."
              className={inputClass(!editMode)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Người đại diện
            </label>
            <input
              type="text"
              value={form.businessRepName}
              onChange={(e) => handleChange("businessRepName", e.target.value)}
              disabled={!editMode}
              className={inputClass(!editMode)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Ngành nghề
            </label>
            <select
              value={form.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              disabled={!editMode}
              className={inputClass(!editMode)}
            >
              <option value="">-- Chọn ngành --</option>
              {INDUSTRIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Quy mô công ty *
            </label>
            <select
              value={form.sizeRange}
              onChange={(e) => handleChange("sizeRange", e.target.value)}
              disabled={!editMode}
              className={inputClass(!editMode)}
            >
              <option value="">-- Chọn quy mô --</option>
              {SIZE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Mã tỉnh/thành
            </label>
            <input
              type="text"
              value={form.provinceCode}
              onChange={(e) => handleChange("provinceCode", e.target.value)}
              disabled={!editMode}
              className={inputClass(!editMode)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Địa chỉ
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!editMode}
              className={inputClass(!editMode)}
            />
          </div>

          {/* <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Giấy phép kinh doanh (URL)
            </label>
            <input
              type="text"
              value={form.businessLicenseUrl}
              onChange={(e) =>
                handleChange("businessLicenseUrl", e.target.value)
              }
              disabled={!editMode}
              className={inputClass(!editMode)}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Chứng minh tài chính (URL)
            </label>
            <input
              type="text"
              value={form.financialProofUrl}
              onChange={(e) =>
                handleChange("financialProofUrl", e.target.value)
              }
              disabled={!editMode}
              className={inputClass(!editMode)}
            />
          </div> */}

          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Mô tả công ty *
            </label>
            <textarea
              value={form.overview}
              onChange={(e) => handleChange("overview", e.target.value)}
              disabled={!editMode}
              rows={4}
              className={inputClass(!editMode) + " resize-none"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
