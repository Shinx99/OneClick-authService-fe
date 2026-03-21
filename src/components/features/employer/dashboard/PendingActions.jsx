"use client";
import React from "react";
import Link from "next/link";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";

const actions = [
  {
    title: "Xem xét 5 CV chưa đọc",
    subtitle: "Vị trí Product Designer",
    href: "/employer/candidate",
  },
  {
    title: "Tin tuyển dụng sắp hết hạn",
    subtitle: "Senior Fullstack Engineer (còn 2 ngày)",
    href: "/employer/job-posting",
  },
  {
    title: "Lên lịch 3 cuộc phỏng vấn",
    subtitle: "Ứng viên đã chọn cho vị trí Marketing",
    href: "/employer/candidate",
  },
];

const PendingActions = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-5">Hành động chờ xử lý</h3>

      <div className="space-y-4 flex-1">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            <MdCheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                {action.title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{action.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All */}
      <Link
        href="/employer/candidate"
        className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mt-4 pt-4 border-t border-slate-100"
      >
        Xem tất cả công việc
        <MdArrowForward className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default PendingActions;
