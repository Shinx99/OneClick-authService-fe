import React from "react";
import EmployerNavbar from "@/components/common/employer/EmployerNavbar";
import EmployerFooter from "@/components/common/employer/EmployerFooter";

export default function WithLayoutLayout({ children }) {
  return (
    <>
      {/* Thanh điều hướng Employer */}
      <EmployerNavbar />

      {/* Nội dung trang */}
      <main className="flex-grow bg-white">{children}</main>

      {/* Chân trang Employer */}
      <EmployerFooter />
    </>
  );
}
