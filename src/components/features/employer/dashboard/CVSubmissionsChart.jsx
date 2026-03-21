"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "T1", submissions: 45, fill: "#6ee7b7" },
  { name: "T2", submissions: 130, fill: "#34d399" },
  { name: "T3", submissions: 200, fill: "#10b981" },
  { name: "T4", submissions: 95, fill: "#6ee7b7" },
  { name: "T5", submissions: 160, fill: "#5e34d3ff" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-emerald-300">{payload[0].value} hồ sơ nộp</p>
      </div>
    );
  }
  return null;
};

const CVSubmissionsChart = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-lg font-bold text-slate-800">CV đã nộp</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Báo cáo hoạt động từ 01/10 - 30/10
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          30 ngày qua
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 13 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} />
            <Bar dataKey="submissions" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CVSubmissionsChart;
