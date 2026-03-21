"use client";
import React from "react";
import { MdOutlineEdit, MdOutlineCameraAlt } from "react-icons/md";

const CompanyProfileForm = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-44 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-600">
        {/* Decorative overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.15\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
        <button className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 text-white text-xs font-medium rounded-lg hover:bg-black/50 transition-all backdrop-blur-sm">
          <MdOutlineCameraAlt className="w-4 h-4" />
          Đổi ảnh bìa
        </button>
        {/* Logo */}
        <div className="absolute -bottom-8 left-6">
          <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="pt-14 px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tên công ty</label>
            <input type="text" defaultValue="One-Click Technologies" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Website</label>
            <input type="text" defaultValue="https://one-click.tech" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ngành nghề</label>
            <select defaultValue="software" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              <option value="software">Phát triển phần mềm</option>
              <option value="finance">Tài chính & Ngân hàng</option>
              <option value="marketing">Marketing</option>
              <option value="healthcare">Y tế</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quy mô công ty</label>
            <select defaultValue="201-500" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
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
