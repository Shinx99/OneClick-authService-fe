"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineList, MdOutlineAdd } from "react-icons/md";
import JobPostingList from "@/components/features/employer/job-posting/JobPostingList";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";

export default function JobPostingPage() {
  const pathname = usePathname();

  return (
    <RestrictedWrapper>
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/employer/job-posting"
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              pathname === "/employer/job-posting"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MdOutlineList className="w-5 h-5" />
            Danh sách
          </Link>
          <Link
            href="/employer/job-posting/create"
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              pathname === "/employer/job-posting/create"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MdOutlineAdd className="w-5 h-5" />
            Tạo mới
          </Link>
        </div>

        {/* Content */}
        <JobPostingList />
      </div>
    </RestrictedWrapper>
  );
}
