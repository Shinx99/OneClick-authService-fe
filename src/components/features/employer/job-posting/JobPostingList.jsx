"use client";
import React from "react";
import Link from "next/link";
import {
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineVisibility,
  MdOutlineMoreVert,
} from "react-icons/md";

const demoJobs = [
  {
    id: 1,
    title: "Senior Java Backend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Ho Chi Minh City",
    status: "Active",
    applications: 45,
    postedDate: "2024-10-01",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    type: "Full-time",
    location: "Ha Noi",
    status: "Active",
    applications: 32,
    postedDate: "2024-10-05",
  },
  {
    id: 3,
    title: "Senior Fullstack Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
    status: "Expiring",
    applications: 28,
    postedDate: "2024-09-20",
  },
  {
    id: 4,
    title: "QA Engineer",
    department: "Quality Assurance",
    type: "Contract",
    location: "Da Nang",
    status: "Active",
    applications: 15,
    postedDate: "2024-10-10",
  },
  {
    id: 5,
    title: "Marketing Manager",
    department: "Marketing",
    type: "Full-time",
    location: "Ho Chi Minh City",
    status: "Closed",
    applications: 67,
    postedDate: "2024-08-15",
  },
  {
    id: 6,
    title: "UX/UI Designer & Product Lead",
    department: "Design",
    type: "Full-time",
    location: "Ha Noi",
    status: "Active",
    applications: 21,
    postedDate: "2024-10-12",
  },
];

const statusColors = {
  Active: "bg-emerald-50 text-emerald-700",
  Expiring: "bg-amber-50 text-amber-700",
  Closed: "bg-slate-100 text-slate-500",
};

const JobPostingList = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800">All Job Postings</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage and track all your posted positions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search postings..."
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-56"
          />
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            <option>All Status</option>
            <option>Active</option>
            <option>Expiring</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Job Title
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Department
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Type
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Location
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Applications
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Posted
              </th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {demoJobs.map((job, index) => (
              <tr
                key={job.id}
                className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                }`}
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-700">{job.title}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-500">{job.department}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-500">{job.type}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-500">{job.location}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      statusColors[job.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-700">{job.applications}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-400">{job.postedDate}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                      <MdOutlineVisibility className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <MdOutlineEdit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <MdOutlineDelete className="w-4 h-4" />
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
          Showing 1 to {demoJobs.length} of {demoJobs.length} results
        </p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">1</button>
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;
