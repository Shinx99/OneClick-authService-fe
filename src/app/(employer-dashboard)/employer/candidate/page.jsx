import React from "react";
import CandidateTable from "@/components/features/employer/candidate/CandidateTable";
import CandidateStats from "@/components/features/employer/candidate/CandidateStats";

export default function CandidatePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Candidate Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Review and manage your candidate pipeline
          </p>
        </div>
      </div>

      {/* Table */}
      <CandidateTable />

      {/* Stats */}
      <CandidateStats />
    </div>
  );
}
