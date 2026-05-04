"use client";

import { useState, useEffect } from "react";
import { Briefcase, Building2, CheckCircle2 } from "lucide-react";
import { applicationService } from "@/services/application.service";

const JobCard = ({ job, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border cursor-pointer transition-all ${
      selected
        ? "border-[#00c853]/40 bg-[#00c853]/8"
        : "border-gray-200 bg-white hover:border-[#00c853]/30 hover:bg-gray-50"
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          selected ? "bg-[#00c853]/15" : "bg-gray-100"
        }`}
      >
        <Building2 size={15} className={selected ? "text-[#00c853]" : "text-gray-400"} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-black truncate ${
            selected ? "text-[#00c853]" : "text-gray-800"
          }`}
        >
          {job.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{job.department || "—"}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {job.salary && (
            <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
              {job.salary}
            </span>
          )}
          {job.location && (
            <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
              {job.location}
            </span>
          )}
        </div>
      </div>
      {selected && <CheckCircle2 size={15} className="text-[#00c853] flex-shrink-0 mt-0.5" />}
    </div>
  </div>
);

const JobSelectorPanel = ({ selectedJob, onSelectJob }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    applicationService
      .getMyJobs()
      .then((data) => {
        // Log dữ liệu để kiểm tra cấu trúc (xóa sau khi debug)
        console.log("Raw jobs data:", data);
        
        // Normalize: đảm bảo mỗi job có trường 'id'
        const normalizedJobs = (data || []).map((job, index) => {
          // Nếu job đã có id thì giữ nguyên, nếu không thì dùng _id hoặc tạo fallback
          const jobId = job.jobId ?? job.id ?? job._id;
          if (jobId) {
            console.warn("Job missing id:", job);
          }
          return { ...job, id: jobId };
        });
        
        setJobs(normalizedJobs);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
        setJobs([]);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#00c853]/10 flex items-center justify-center">
          <Briefcase size={14} className="text-[#00c853]" />
        </div>
        <h2 className="text-sm font-black text-gray-800">Vị trí của bạn</h2>
        <span className="ml-auto text-xs text-gray-400">{jobs.length} vị trí</span>
      </div>

      {/* List - luôn có key */}
      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {jobs.map((job) => (
          <JobCard
            key={job.id} // bây giờ job.id luôn tồn tại
            job={job}
            selected={selectedJob?.id === job.id}
            onClick={() => onSelectJob(job)}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSelectorPanel;