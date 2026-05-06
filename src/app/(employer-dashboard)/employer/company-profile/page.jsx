import React from "react";
import CompanyProfileForm from "@/components/features/employer/company-profile/CompanyProfileForm";
import CompanyDescription from "@/components/features/employer/company-profile/CompanyDescription";
import BenefitsPerks from "@/components/features/employer/company-profile/BenefitsPerks";
import CulturePhotos from "@/components/features/employer/company-profile/CulturePhotos";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";

export default function CompanyProfilePage() {
  return (
    <RestrictedWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hồ sơ công ty</h2>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý thương hiệu công khai và nhận diện tuyển dụng của tổ chức.
          </p>
        </div>

        <CompanyProfileForm />
        {/* <CompanyDescription />
      <BenefitsPerks />
      <CulturePhotos /> */}
      </div>
    </RestrictedWrapper>

  );
}
