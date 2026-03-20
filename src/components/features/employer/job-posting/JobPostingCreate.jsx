"use client";
import React from "react";
import { MdOutlineSave, MdOutlinePublish, MdOutlineLocationOn } from "react-icons/md";

// ===== CẤU HÌNH FORM: Mỗi section là 1 object, mỗi field là 1 object nhỏ =====
const formSections = [
  {
    number: 1,
    title: "General Information",
    fields: [
      { name: "jobTitle", label: "Job Title", placeholder: "e.g. Senior Java Backend Developer", colSpan: 2 },
      { name: "industry", label: "Industry", type: "select", options: ["Information Technology", "Finance & Banking", "Marketing", "Healthcare", "Education"] },
      { name: "sectorLevel", label: "Sector Level", type: "select", options: ["Junior", "Mid-Level", "Senior", "Lead", "Manager"] },
      { name: "jobType", label: "Job Type", type: "select", options: ["Full-time", "Part-time", "Contract", "Remote"] },
      { name: "salary", label: "Salary Range", placeholder: "e.g. $1,000 - $2,000" },
    ],
  },
  {
    number: 2,
    title: "Job Details",
    fields: [
      { name: "jobDescription", label: "Job Description", type: "textarea", placeholder: "Explain the role and its key responsibilities...", colSpan: 2 },
      { name: "candidateRequirements", label: "Candidate Requirements", type: "textarea", placeholder: "List skills or experience you are looking for...", colSpan: 2 },
      { name: "benefits", label: "Benefits", type: "textarea", placeholder: "List any incentives, benefits, or perks...", colSpan: 2 },
    ],
  },
  {
    number: 3,
    title: "Requirements & Setup",
    fields: [
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "slots", label: "Slots", placeholder: "5 - 10 Slots", type: "number" },
      { name: "jobTags", label: "Job Tags", placeholder: "e.g. React, Node.js, Python..." },
      { name: "workersStaying", label: "Worker's Staying", type: "select", options: ["On-site", "Remote", "Hybrid"] },
    ],
  },
  {
    number: 4,
    title: "Location & Deadline",
    fields: [
      { name: "publishedDate", label: "Published Date", type: "date" },
      { name: "applicationDeadline", label: "Application Deadline", type: "date" },
      { name: "country", label: "Country", type: "select", options: ["Vietnam", "United States", "Singapore", "Japan"] },
      { name: "city", label: "City", type: "select", options: ["Ho Chi Minh City", "Ha Noi", "Da Nang"] },
      { name: "address", label: "Address", placeholder: "e.g. 131 Mathis St, Suite 445", icon: true, colSpan: 2 },
    ],
  },
];

// ===== COMPONENT RENDER 1 FIELD =====
const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";

const FormField = ({ field }) => {
  if (field.type === "select") {
    return (
      <select className={`${inputClass} text-slate-600`} defaultValue="">
        <option value="">Select {field.label.toLowerCase()}</option>
        {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }
  if (field.type === "textarea") {
    return <textarea placeholder={field.placeholder} rows={3} className={`${inputClass} resize-none`} />;
  }
  return (
    <div className={field.icon ? "relative" : ""}>
      {field.icon && <MdOutlineLocationOn className="absolute left-3 top-3 w-5 h-5 text-slate-400" />}
      <input type={field.type || "text"} placeholder={field.placeholder} className={`${inputClass} ${field.icon ? "pl-10" : ""}`} />
    </div>
  );
};

// ===== COMPONENT CHÍNH =====
const JobPostingForm = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Create New Job Posting</h2>
          <p className="text-sm text-slate-400 mt-1">Fill in the details to post a new job opening</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all">
            <MdOutlineSave className="w-5 h-5" /> Save Draft
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
            <MdOutlinePublish className="w-5 h-5" /> Publish Job
          </button>
        </div>
      </div>

      {/* Render tất cả sections từ config */}
      <div className="space-y-6">
        {formSections.map((section) => (
          <div key={section.number} className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
                {section.number}
              </span>
              {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.name} className={field.colSpan === 2 ? "col-span-2" : ""}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  <FormField field={field} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Map Placeholder + Submit */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="w-full h-40 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center">
            <div className="text-center">
              <MdOutlineLocationOn className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm text-emerald-600 font-medium">Map Preview</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-md">
            <MdOutlinePublish className="w-5 h-5" /> Publish Job Posting
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
