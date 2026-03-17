import React from "react";
import JobTable from "@/components/features/admin/content/JobTable";

export default async function ApproveJobsPage() {
  const jobs = [
    {
      id: "JOB-2023-01",
      title: "Lập trình viên Frontend Cấp cao (React/Tailwind)",
      company: "Giải pháp Công nghệ TechCorp",
      salary: "25 - 35tr",
      postDate: "24/10/2023",
      status: "Pending",
    },
    {
      id: "JOB-2023-02",
      title: "Trưởng phòng Marketing",
      company: "Công ty Truyền thông Toàn cầu",
      salary: "20 - 30tr",
      postDate: "23/10/2023",
      status: "Pending",
    },
  ];

  return (
    <div className="p-8 bg-white rounded-[2.5rem] border-2 border-dashed border-blue-100 shadow-sm">
      <JobTable data={jobs} />
    </div>
  );
}
