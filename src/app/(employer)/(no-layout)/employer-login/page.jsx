import React from "react";
import Image from "next/image";
import EmployerLoginForm from "@/components/features/employer/login/EmployerLoginForm";

export const metadata = {
  title: "Đăng nhập Nhà tuyển dụng | One-Click",
};

export default function EmployerLoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-white">
      
      {/* Left Column: Form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8">
        <EmployerLoginForm />
      </div>

      {/* Right Column: Banner Image */}
      <div className="hidden lg:block lg:w-[40%] relative h-screen">
        <Image
          src="/images/bannerForEmployer.png"
          alt="Employer Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
