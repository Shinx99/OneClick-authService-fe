"use client";
import React from "react";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";
import TeamManager from "@/components/features/employer/team/TeamManager";
import { useEmployer } from "@/hooks/useEmployer";

export default function TeamManagementPage() {
  const { profile, isLoading } = useEmployer();

  return (
    <RestrictedWrapper>
      <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-medium text-text-main">
              Quản lý đội ngũ
            </h2>
            <p className="text-[14px] text-text-muted mt-1 font-normal italic">
              Quản lý thành viên trong công ty và phân quyền truy cập hệ thống.
            </p>
          </div>
        </div>

        {/* Khối giao diện chính */}
        {isLoading || !profile ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-[14px] text-text-muted">Đang tải...</span>
          </div>
        ) : (
          <TeamManager
            currentEmployerId={profile.employerId}
            currentEmployerLevel={profile.level}
          />
        )}
      </div>
    </RestrictedWrapper>
  );
}