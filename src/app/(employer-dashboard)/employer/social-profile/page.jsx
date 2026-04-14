"use client";
import React from "react";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";
// 🚨 CHÚ Ý DÒNG NÀY: Phải import SocialProfileManager
import SocialProfileManager from "@/components/features/employer/setting/SocialProfileManager";

export default function SocialProfilePage() {
  return (
    <RestrictedWrapper>
      <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main mb-1">
            Thương hiệu cá nhân
          </h2>
          <p className="text-[14px] text-text-muted font-normal italic">
            Xây dựng thương hiệu cá nhân, cập nhật liên kết và chia sẻ cơ hội
            việc làm.
          </p>
        </div>

        {/* 🚨 CHÚ Ý DÒNG NÀY: Phải gọi thẻ SocialProfileManager */}
        <SocialProfileManager />
      </div>
    </RestrictedWrapper>
  );
}
