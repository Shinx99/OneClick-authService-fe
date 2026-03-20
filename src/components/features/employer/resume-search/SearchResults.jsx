"use client";
import React from "react";
import CandidateCard from "./CandidateCard";

const demoCandidates = [
  {
    id: 1,
    name: "Candidate #4431",
    avatar: "NV",
    role: "Senior Java Backend Developer",
    tags: ["Java", "Spring Boot", "Microservices"],
    matchLevel: "High",
    location: "Ho Chi Minh City",
    experience: "5 Years",
    salary: "$2,500/mo",
  },
  {
    id: 2,
    name: "Candidate #2203",
    avatar: "TT",
    role: "UX/UI Designer & Product Lead",
    tags: ["Figma", "UI/UX", "Design Systems"],
    matchLevel: "High",
    location: "Ha Noi",
    experience: "4 Years",
    salary: "$2,100/mo",
  },
  {
    id: 3,
    name: "Candidate #7737",
    avatar: "PM",
    role: "Project Manager (Fintech)",
    tags: ["Agile", "Scrum", "PMP"],
    matchLevel: "Medium",
    location: "Da Nang",
    experience: "6 Years",
    salary: "$2,800/mo",
  },
  {
    id: 4,
    name: "Candidate #1105",
    avatar: "LT",
    role: "QA Engineer",
    tags: ["Selenium", "Cypress", "Testing"],
    matchLevel: "Medium",
    location: "Ha Noi",
    experience: "3 Years",
    salary: "$1,500/mo",
  },
];

const SearchResults = () => {
  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-lg font-bold text-slate-800">
            around <span className="text-emerald-600">1,240</span> matching candidates
          </p>
          <p className="text-sm text-slate-400 mt-0.5">
            Showing the most relevant results based on your criteria
          </p>
        </div>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
          <option>Sort by: Relevance</option>
          <option>Sort by: Experience</option>
          <option>Sort by: Salary</option>
          <option>Sort by: Recent</option>
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
          Displaying 1 of 1,240 results
        </p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
            Previous
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
            Next
          </button>
        </div>
      </div>

      {/* Refine Banner */}
      <div className="mt-4 bg-emerald-50 rounded-xl border border-emerald-100 p-5 text-center">
        <p className="text-sm font-semibold text-emerald-700">
          Refine Your Search
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          Use 1,240+ candidate profiles to narrow results
        </p>
      </div>
    </div>
  );
};

export default SearchResults;
