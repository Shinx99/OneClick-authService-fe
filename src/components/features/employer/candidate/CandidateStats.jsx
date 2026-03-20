"use client";
import React from "react";
import {
  MdOutlinePeople,
  MdOutlinePersonAdd,
  MdOutlineAutoGraph,
  MdOutlineCalendarToday,
} from "react-icons/md";

const stats = [
  {
    label: "Total Candidates",
    value: "1,284",
    icon: MdOutlinePeople,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    change: "+12%",
    changeColor: "text-emerald-600",
  },
  {
    label: "New This Week",
    value: "42",
    icon: MdOutlinePersonAdd,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    change: "+8%",
    changeColor: "text-emerald-600",
  },
  {
    label: "Match Rate",
    value: "78%",
    icon: MdOutlineAutoGraph,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    change: "+3%",
    changeColor: "text-emerald-600",
  },
  {
    label: "Interviews",
    value: "12",
    icon: MdOutlineCalendarToday,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    change: "+5",
    changeColor: "text-emerald-600",
  },
];

const CandidateStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`text-xs font-semibold ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CandidateStats;
