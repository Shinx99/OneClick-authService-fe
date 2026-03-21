"use client";
import React from "react";
import CandidateCard from "./CandidateCard";

const demoCandidates = [
  {
    id: 1,
    name: "Ứng viên #4431",
    avatar: "NV",
    role: "Senior Java Backend Developer",
    tags: ["Java", "Spring Boot", "Microservices"],
    matchLevel: "Cao",
    location: "TP. Hồ Chí Minh",
    experience: "5 năm",
    salary: "$2,500/tháng",
  },
  {
    id: 2,
    name: "Ứng viên #2203",
    avatar: "TT",
    role: "UX/UI Designer & Product Lead",
    tags: ["Figma", "UI/UX", "Design Systems"],
    matchLevel: "Cao",
    location: "Hà Nội",
    experience: "4 năm",
    salary: "$2,100/tháng",
  },
  {
    id: 3,
    name: "Ứng viên #7737",
    avatar: "PM",
    role: "Project Manager (Fintech)",
    tags: ["Agile", "Scrum", "PMP"],
    matchLevel: "Trung bình",
    location: "Đà Nẵng",
    experience: "6 năm",
    salary: "$2,800/tháng",
  },
  {
    id: 4,
    name: "Ứng viên #1105",
    avatar: "LT",
    role: "QA Engineer",
    tags: ["Selenium", "Cypress", "Testing"],
    matchLevel: "Trung bình",
    location: "Hà Nội",
    experience: "3 năm",
    salary: "$1,500/tháng",
  },
];

const SearchResults = () => {
  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-lg font-bold text-slate-800">
            Khoảng <span className="text-emerald-600">1.240</span> ứng viên phù hợp
          </p>
          <p className="text-sm text-slate-400 mt-0.5">
            Hiển thị kết quả phù hợp nhất dựa trên tiêu chí của bạn
          </p>
        </div>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
          <option>Sắp xếp: Phù hợp nhất</option>
          <option>Sắp xếp: Kinh nghiệm</option>
          <option>Sắp xếp: Mức lương</option>
          <option>Sắp xếp: Mới nhất</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {demoCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-slate-100 px-5 py-4">
        <p className="text-sm text-slate-400">
          Hiển thị 1 trong 1.240 kết quả
        </p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Trước
          </button>
          <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">1</button>
          <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            2
          </button>
          <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            3
          </button>
          <span className="px-2 text-sm text-slate-400">...</span>
          <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            124
          </button>
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Tiếp
          </button>
        </div>
      </div>

      {/* Refine Banner */}
      <div className="mt-4 bg-emerald-50 rounded-xl border border-emerald-100 p-5 text-center">
        <p className="text-sm font-semibold text-emerald-700">
          Tinh chỉnh tìm kiếm
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          Sử dụng hơn 1.240 hồ sơ ứng viên để thu hẹp kết quả
        </p>
      </div>
    </div>
  );
};

export default SearchResults;
