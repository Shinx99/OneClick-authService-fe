"use client";
import React from "react";
import {
  MdOutlineDescription,
  MdOutlineWorkOutline,
  MdOutlineVisibility,
} from "react-icons/md";

const stats = [
  {
    label: "TOTAL CVS RECEIVED",
    value: "2,150",
    change: "+5%",
    icon: MdOutlineDescription,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    barColor: "bg-emerald-500",
    barWidth: "w-3/5",
  },
  {
    label: "ACTIVE JOB POSTS",
    value: "18",
    change: "+5%",
    icon: MdOutlineWorkOutline,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    barColor: "bg-emerald-500",
    barWidth: "w-2/5",
  },
  {
    label: "RESUME VIEWS",
    value: "5,600",
    change: "+8%",
    icon: MdOutlineVisibility,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    barColor: "bg-emerald-500",
    barWidth: "w-4/5",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l4-4-4-4m6 8l4-4-4-4" />
                </svg>
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-slate-800 mb-3">{stat.value}</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${stat.barColor} ${stat.barWidth} transition-all duration-500`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
