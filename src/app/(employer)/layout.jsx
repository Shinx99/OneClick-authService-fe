import React from "react";
import EmployerNavbar from "@/components/common/EmployerNavbar";
import EmployerFooter from "@/components/common/EmployerFooter";

export default function EmployerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Thanh điều hướng Employer */}
      <EmployerNavbar />

      {/* Nội dung trang */}
      <main className="flex-grow bg-white">{children}</main>

      {/* Chân trang Employer */}
      <EmployerFooter />
    </div>
  );
}
