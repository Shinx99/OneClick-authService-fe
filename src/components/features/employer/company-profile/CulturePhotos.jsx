"use client";
import React from "react";
import { MdOutlineCloudUpload, MdOutlineInfo } from "react-icons/md";

const demoPhotos = [
  { id: 1, bg: "from-emerald-700 to-emerald-900" },
  { id: 2, bg: "from-teal-600 to-emerald-700" },
  { id: 3, bg: "from-emerald-600 to-teal-500" },
];

const CulturePhotos = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-5">Company Culture & Office Photos</h3>

      <div className="flex gap-3">
        {/* Demo photos */}
        {demoPhotos.map((p) => (
          <div key={p.id} className={`w-36 h-28 rounded-xl bg-gradient-to-br ${p.bg} flex items-center justify-center shadow-sm`}>
            <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        ))}

        {/* Upload area */}
        <div className="flex-1 min-w-[140px] h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer">
          <MdOutlineCloudUpload className="w-6 h-6 text-slate-400" />
          <p className="text-xs font-medium text-slate-400">Drag and drop</p>
          <p className="text-[10px] text-slate-300">or click to upload</p>
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
        <MdOutlineInfo className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span>Tip: Profiles with at least 3 office photos receive 43% more candidate engagement.</span>
      </div>
    </div>
  );
};

export default CulturePhotos;
