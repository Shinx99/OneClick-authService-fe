"use client";
import React from "react";

// Nhận mảng jobs từ trang [slug]/page.jsx truyền xuống
const CompanyJobs = ({ jobs = [] }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          Vị trí đang tuyển
        </h3>
        {jobs.length > 0 && (
          <span className="text-[10px] bg-green-50 text-[#00c853] px-2 py-0.5 rounded-full font-bold">
            {jobs.length} MỚI
          </span>
        )}
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:border-[#00c853] transition-all cursor-pointer group"
            >
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-[#00c853] transition-colors">
                {job.title}
              </h4>
              <div className="flex justify-between mt-2 font-medium">
                <span className="text-xs text-gray-400">💰 {job.salary}</span>
                <span className="text-xs text-gray-400">🕒 {job.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4 italic">
            Hiện chưa có vị trí nào đang tuyển.
          </p>
        )}
      </div>

      <button className="w-full mt-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-500 hover:text-[#00c853] hover:border-[#00c853] transition-all active:scale-95">
        Xem tất cả công việc
      </button>
    </div>
  );
};

export default CompanyJobs;
