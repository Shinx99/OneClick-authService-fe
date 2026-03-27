"use client";
import React, { use } from "react"; // 1. Import 'use' từ react
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaRobot, FaShareAlt } from "react-icons/fa";
import AIAnalysisDashboard from "@/components/features/jobs/AIAnalysisDashboard";
import AIConsultantChat from "@/components/features/jobs/AIConsultantChat";

export default function AIReportPage({ params }) {
  const router = useRouter();

  // 2. Sử dụng React.use() để giải nén Promise params
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.id;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-green-600 font-bold transition-all group"
          >
            <FaChevronLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={14}
            />
            Quay lại tin tuyển dụng
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
              <FaRobot className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">
                OneClick AI Analysis
              </span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <FaShareAlt />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: Truyền jobId đã unwrapped */}
          <div className="lg:col-span-8">
            <AIAnalysisDashboard jobId={jobId} />
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <AIConsultantChat jobId={jobId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
