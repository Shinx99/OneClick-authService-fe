"use client";
import React from "react";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";
// 🚨 CHÚ Ý DÒNG NÀY: Phải import PersonalInfoManager
import PersonalInfoManager from "@/components/features/employer/setting/PersonalInfoManager";

export default function SettingPage() {
  return (
    <RestrictedWrapper>
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main mb-1">
            Cài đặt tài khoản
          </h2>
          <p className="text-[14px] text-text-muted font-normal italic">
            Quản lý thông tin cá nhân và bảo mật tài khoản HR của bạn.
          </p>
        </div>

        {/* CHÚ Ý DÒNG NÀY: Phải gọi thẻ PersonalInfoManager */}
        <PersonalInfoManager />
      </div>
    </RestrictedWrapper>
  );
}
