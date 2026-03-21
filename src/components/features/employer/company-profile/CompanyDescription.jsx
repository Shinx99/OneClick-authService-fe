"use client";
import React from "react";
import { MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdInsertLink, MdCode } from "react-icons/md";

const CompanyDescription = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Mô tả công ty</h3>
        <span className="text-xs text-slate-400">Đã tự động lưu</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-3 pb-3 border-b border-slate-100">
        {[MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdInsertLink, MdCode].map((Icon, i) => (
          <button key={i} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        rows={5}
        defaultValue="One-Click Technologies là công ty phát triển phần mềm hàng đầu. Tại One-Click, chúng tôi đề cao sự đổi mới, minh bạch và phát triển bền vững."
        className="w-full px-0 py-2 text-sm text-slate-600 leading-relaxed bg-transparent border-none focus:outline-none resize-none"
      />

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">T</div>
          <button className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors">
            Xem hồ sơ công khai
          </button>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
          Lưu thay đổi hồ sơ
        </button>
      </div>
    </div>
  );
};

export default CompanyDescription;
