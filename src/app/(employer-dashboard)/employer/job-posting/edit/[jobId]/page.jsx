"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { MdOutlineList, MdOutlineAdd, MdOutlineEdit } from "react-icons/md";
import JobPostingForm from "@/components/features/employer/job-posting/JobPostingCreate";

export default function JobPostingEditPage() {
  const pathname = usePathname();
  const params = useParams();
  const jobId = params?.jobId;

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/employer/job-posting"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
        >
          <MdOutlineList className="w-5 h-5" />
          Danh sách
        </Link>
        <Link
          href="/employer/job-posting/create"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
        >
          <MdOutlineAdd className="w-5 h-5" />
          Tạo mới
        </Link>
        <span className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-sm">
          <MdOutlineEdit className="w-5 h-5" />
          Chỉnh sửa
        </span>
      </div>

      {/* Content */}
      <JobPostingForm jobId={jobId} />
    </div>
  );
}
