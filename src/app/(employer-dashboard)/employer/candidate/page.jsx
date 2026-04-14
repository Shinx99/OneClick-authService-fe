import React from "react";
import CandidateTable from "@/components/features/employer/candidate/CandidateTable";
import CandidateStats from "@/components/features/employer/candidate/CandidateStats";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";

export default function CandidatePage() {
  return (
    <RestrictedWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Quản lý ứng viên
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Xem xét và quản lý quy trình ứng viên của bạn
            </p>
          </div>
        </div>

        {/* Table */}
        <CandidateTable />

        {/* Stats */}
        <CandidateStats />
      </div>
    </RestrictedWrapper>
  );
}
