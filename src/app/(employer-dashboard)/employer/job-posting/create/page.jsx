"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineList, MdOutlineAdd } from "react-icons/md";
import JobPostingForm from "@/components/features/employer/job-posting/JobPostingCreate";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";

export default function JobPostingCreatePage() {
  const pathname = usePathname();

  return (
    <RestrictedWrapper>
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
        {/* Header & Tab Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Tạo tin tuyển dụng
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Điền thông tin chi tiết để thu hút ứng viên tiềm năng
            </p>
          </div>

          <div className="flex items-center bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-1 shadow-sm w-fit">
            <Link
              href="/employer/job-posting"
              className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-lg transition-all duration-200 ${
                pathname === "/employer/job-posting"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <MdOutlineList className="w-5 h-5" /> Danh sách
            </Link>
            <Link
              href="/employer/job-posting/create"
              className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-lg transition-all duration-200 ${
                pathname === "/employer/job-posting/create"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <MdOutlineAdd className="w-5 h-5" /> Tạo tin mới
            </Link>
          </div>
        </div>

        {/* Form Tạo mới */}
        <JobPostingForm />
      </div>
    </RestrictedWrapper>
  );
}
