"use client";
import React, { Suspense } from "react";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";
import CandidateManager from "@/components/features/employer/candidate/CandidateManager";

export default function CandidatePage() {
  return (
    <RestrictedWrapper>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-400">
                Đang khởi tạo quy trình tuyển dụng ứng viên...
              </p>
            </div>
          </div>
        }
      >
        <CandidateManager />
      </Suspense>
    </RestrictedWrapper>
  );
}
