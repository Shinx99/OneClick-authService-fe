"use client";
import React from "react";
import { MdOutlineLocationOn, MdOutlineWork, MdOutlineAttachMoney } from "react-icons/md";

const CandidateCard = ({ candidate }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200 group">
      {/* Top Row: Avatar + Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
          {candidate.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
            {candidate.name}
          </h4>
          <p className="text-sm text-slate-500 mt-0.5">{candidate.role}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {candidate.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
            candidate.matchLevel === "High"
              ? "bg-emerald-50 text-emerald-700"
              : candidate.matchLevel === "Medium"
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          {candidate.matchLevel}
        </span>
      </div>

      {/* Details Row */}
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
        <span className="flex items-center gap-1">
          <MdOutlineLocationOn className="w-4 h-4" />
          {candidate.location}
        </span>
        <span className="flex items-center gap-1">
          <MdOutlineWork className="w-4 h-4" />
          {candidate.experience}
        </span>
        <span className="flex items-center gap-1">
          <MdOutlineAttachMoney className="w-4 h-4" />
          {candidate.salary}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all">
          View Resume & Proceed
        </button>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all">
          Save
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
