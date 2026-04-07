import React from "react";

const CompanyJobs = ({ jobs = [] }) => {
  return (
    <div className="bg-card-bg p-6 rounded-3xl border border-card-border transition-all shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-text-main">
          Vị trí đang tuyển
        </h3>
        {jobs.length > 0 && (
          <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-[#00c853] px-2 py-0.5 rounded-full font-bold uppercase">
            {jobs.length} MỚI
          </span>
        )}
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-card-border hover:border-[#00c853] transition-all cursor-pointer group"
            >
              <h4 className="font-bold text-sm text-text-main group-hover:text-[#00c853] transition-colors">
                {job.title}
              </h4>
              <div className="flex justify-between mt-2 font-medium">
                <span className="text-xs text-gray-400">💰 {job.salary}</span>
                <span className="text-xs text-gray-400">🕒 {job.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-400 italic">
              Hiện chưa có vị trí nào đang tuyển.
            </p>
          </div>
        )}
      </div>

      <button className="w-full mt-6 py-3 border border-card-border rounded-xl text-sm font-bold text-text-muted hover:text-[#00c853] hover:border-[#00c853] transition-all active:scale-95">
        Xem tất cả công việc
      </button>
    </div>
  );
};

export default CompanyJobs;
