"use client";
import React from "react";
import Link from "next/link";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";

const actions = [
  {
    title: "Review 5 unread CVs",
    subtitle: "Product Designer Role",
    href: "/employer/candidate",
  },
  {
    title: "Job posting expiring",
    subtitle: "Senior Fullstack Engineer (2 days)",
    href: "/employer/job-posting",
  },
  {
    title: "Schedule 3 interviews",
    subtitle: "Shortlisted candidates for Marketing",
    href: "/employer/candidate",
  },
];

const PendingActions = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-5">Pending Actions</h3>

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
        View all tasks
        <MdArrowForward className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default PendingActions;
