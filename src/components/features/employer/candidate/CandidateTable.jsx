"use client";
import React from "react";
import { MdOutlineMoreVert, MdOutlineEmail, MdOutlineCalendarToday } from "react-icons/md";

const candidates = [
  {
    id: 1,
    name: "Nguyen Van A",
    avatar: "NV",
    position: "Senior Java Developer",
    department: "Engineering",
    status: "Interview",
    match: 92,
    appliedDate: "2024-10-15",
  },
  {
    id: 2,
    name: "Tran Thi B",
    avatar: "TT",
    position: "Product Designer",
    department: "Design",
    status: "Screening",
    match: 85,
    appliedDate: "2024-10-14",
  },
  {
    id: 3,
    name: "Hoang ThanhC",
    avatar: "HT",
    position: "Marketing Manager",
    department: "Marketing",
    status: "Offer",
    match: 78,
    appliedDate: "2024-10-12",
  },
  {
    id: 4,
    name: "Ngo Van D",
    avatar: "NV",
    position: "QA Engineer",
    department: "Quality Assurance",
    status: "New",
    match: 70,
    appliedDate: "2024-10-16",
  },
  {
    id: 5,
    name: "Pham Minh E",
    avatar: "PM",
    position: "Fullstack Engineer",
    department: "Engineering",
    status: "Interview",
    match: 88,
    appliedDate: "2024-10-13",
  },
  {
    id: 6,
    name: "Le Thi F",
    avatar: "LT",
    position: "UX Researcher",
    department: "Design",
    status: "Rejected",
    match: 45,
    appliedDate: "2024-10-10",
  },
];

const statusColors = {
  New: "bg-blue-50 text-blue-700",
  Screening: "bg-amber-50 text-amber-700",
  Interview: "bg-violet-50 text-violet-700",
  Offer: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-600",
};

const CandidateTable = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg">
            All Candidates
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
            <MdOutlineCalendarToday className="w-4 h-4" />
            <span>Oct 1, 2024 - Oct 30, 2024</span>
          </div>
          <input
            type="text"
            placeholder="Search a candidate name..."
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-60"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all">
          + Add Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Candidate
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Position
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Department
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Match %
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Applied
              </th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, index) => (
              <tr
                key={c.id}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                      {c.avatar}
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{c.name}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-600">{c.position}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-500">{c.department}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      statusColors[c.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${c.match}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{c.match}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-400">{c.appliedDate}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                      <MdOutlineEmail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MdOutlineMoreVert className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
        <p className="text-sm text-slate-400">
          Showing 1 to {candidates.length} of 186 results
        </p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">1</button>
          <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-all">2</button>
          <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-all">3</button>
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateTable;
