"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Tháng 1", value: 400 },
  { name: "Tháng 2", value: 1200 },
  { name: "Tháng 3", value: 900 },
  { name: "Tháng 4", value: 2000 },
  { name: "Tháng 5", value: 1800 },
  { name: "Tháng 6", value: 2800 },
  { name: "Tháng 7", value: 2500 },
  { name: "Tháng 8", value: 2300 },
  { name: "Tháng 9", value: 2000 },
  { name: "Tháng 10", value: 2900 },
  { name: "Tháng 11", value: 3000 },
  { name: "Tháng 12", value: 3800 },
];

export default function GrowthChart() {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-lg font-black text-gray-800">
            Tăng trưởng người dùng 6 tháng qua
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Hiệu suất thu hút người dùng mới theo tháng
          </p>
        </div>
        <button className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
          Tải báo cáo
        </button>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00c853" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
              dy={15}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00c853"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 6, fill: "#00c853", strokeWidth: 3, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
