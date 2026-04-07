import React from "react";
import Link from "next/link";
import { FiFigma, FiMonitor, FiPenTool } from "react-icons/fi"; // Dùng icon giả lập logo

const SimilarJobs = () => {
  // Dữ liệu giả lập chuẩn Figma
  const similarJobs = [
    {
      id: 1,
      title: "Product Designer",
      company: "Creative Studio Inc.",
      salary: "$2000 - $3500",
      location: "Hà Nội",
      type: "Full-time",
      icon: <FiFigma className="text-orange-500 text-xl" />,
      bgIcon: "bg-orange-50",
    },
    {
      id: 2,
      title: "UI/UX Lead",
      company: "TechFlow Systems",
      salary: "$3000 - $5000",
      location: "TP. HCM",
      type: "Remote",
      icon: <FiMonitor className="text-blue-500 text-xl" />,
      bgIcon: "bg-blue-50",
    },
    {
      id: 3,
      title: "Visual Designer",
      company: "Art & Soul Agency",
      salary: "$1500 - $2500",
      location: "Đà Nẵng",
      type: "Hybrid",
      icon: <FiPenTool className="text-purple-500 text-xl" />,
      bgIcon: "bg-purple-50",
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-[22px] font-bold text-text-main mb-6">
        Việc làm tương tự
      </h2>

      {/* Grid 3 cột cho Desktop, 1 cột cho Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {similarJobs.map((job) => (
          <Link
            href={`/jobs/${job.id}`}
            key={job.id}
            className="bg-card-bg rounded-2xl p-5 border border-card-border hover:border-green-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all group flex flex-col justify-between"
          >
            {/* Header Card: Icon & Tag */}
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${job.bgIcon} transition-transform group-hover:scale-110`}
              >
                {job.icon}
              </div>
              <span className="bg-background text-text-muted text-[11px] font-semibold px-3 py-1.5 rounded-full border border-card-border">
                {job.type}
              </span>
            </div>

            {/* Middle Card: Title & Company */}
            <div className="mb-6">
              <h3 className="font-bold text-text-main text-[16px] mb-1 group-hover:text-[#10B94F] transition-colors leading-tight">
                {job.title}
              </h3>
              <p className="text-[13px] text-text-muted font-medium">
                {job.company}
              </p>
            </div>

            {/* Bottom Card: Salary & Location */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-card-border">
              <span className="font-bold text-text-main text-[14px]">
                {job.salary}
              </span>
              <span className="text-[12px] text-gray-400 font-medium">
                {job.location}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;
