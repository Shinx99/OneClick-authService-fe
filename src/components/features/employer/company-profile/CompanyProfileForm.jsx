"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { MdOutlineCameraAlt } from "react-icons/md";
import { companyService } from "@/services/company.service";

const CompanyProfileForm = () => {
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);

  const [logoUrl, setLogoUrl] = useState(null);
  const [bgUrl, setBgUrl] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [error, setError] = useState(null);

  // --- Logo Upload ---
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setError(null);
    try {
      const res = await companyService.uploadCompanyLogo(file);
      if (res.success) {
        setLogoUrl(res.data.logoUrl);
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
      setError("Tải logo thất bại. Vui lòng thử lại.");
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
    setError(null);
    try {
      const res = await companyService.uploadCompanyBackground(file);
      if (res.success) {
        setBgUrl(res.data.backgroundUrl);
      }
    } catch (err) {
      console.error("Background upload failed:", err);
      setError("Tải ảnh bìa thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingBg(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {/* Hidden file inputs */}
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
      <div className="relative h-44 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-600 overflow-hidden">
        {bgUrl && (
          <Image src={bgUrl} alt="Company Background" fill className="object-cover" />
        )}
        {/* Decorative overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.15\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
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
        <div className="absolute -bottom-8 left-6">
          <button
            onClick={() => logoInputRef.current?.click()}
            disabled={uploadingLogo}
            className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative group cursor-pointer disabled:opacity-50"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Company Logo"
                fill
                className="object-contain p-2"
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
            {/* Hover overlay */}
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

      {/* Error message */}
      {error && (
        <div className="mx-6 mt-12 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-500 text-xs">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className={`${error ? "pt-4" : "pt-14"} px-6 pb-6`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tên công ty
            </label>
            <input
              type="text"
              defaultValue="One-Click Technologies"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Website
            </label>
            <input
              type="text"
              defaultValue="https://one-click.tech"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Ngành nghề
            </label>
            <select
              defaultValue="software"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="software">Phát triển phần mềm</option>
              <option value="finance">Tài chính &amp; Ngân hàng</option>
              <option value="marketing">Marketing</option>
              <option value="healthcare">Y tế</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Quy mô công ty
            </label>
            <select
              defaultValue="201-500"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="1-50">1-50 nhân viên</option>
              <option value="51-200">51-200 nhân viên</option>
              <option value="201-500">201-500 nhân viên</option>
              <option value="500+">500+ nhân viên</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
