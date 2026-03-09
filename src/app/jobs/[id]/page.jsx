import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import JobContent from "@/components/features/jobs/JobContent";
import JobSidebar from "@/components/features/jobs/JobSidebar";
import SimilarJobs from "@/components/features/jobs/SimilarJobs";

const JobDetailPage = () => {
  // DỮ LIỆU GIẢ (Mock Data) - Bám sát 100% thiết kế Figma của bạn
  const jobData = {
    title: "Senior UX Designer",
    company: "GreenEarth Solutions",
    logo: "https://ui-avatars.com/api/?name=GE&background=E8F5E9&color=2E7D32&size=128", // Logo tạm
    status: "Đang tuyển gấp",
    postedAt: "2 ngày trước",
    applicants: 10,
    salary: "$2500 - $4000",
    location: "San Francisco, CA",
    type: "Hybrid (3 ngày tại văn phòng)",
    level: "Senior Level",
    companySize: "50-100 nhân viên",
    website: "greenearth.com",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-6">
      {" "}
      {/* Nền xám nhạt như Figma */}
      {/* --- BREADCRUMB --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center text-sm font-medium text-gray-500 gap-2">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Trang chủ
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <Link href="/jobs" className="hover:text-green-600 transition-colors">
            Việc làm
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="text-gray-900 font-semibold">{jobData.title}</span>
        </div>
      </div>
      {/* --- MAIN GRID (Chia tỉ lệ 8:4) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI (Chiếm 8 phần) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Đã ráp JobContent vào đây */}
            <JobContent data={jobData} />

            {/* Việc làm tương tự */}
            <SimilarJobs />
          </div>

          {/* CỘT PHẢI (Chiếm 4 phần) */}

          {/* Lát nữa mình sẽ thả component <JobSidebar /> vào đây */}
          <div className="lg:col-span-4">
            <JobSidebar data={jobData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
