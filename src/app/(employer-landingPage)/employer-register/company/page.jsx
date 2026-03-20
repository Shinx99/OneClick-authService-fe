"use client";
import React from "react";
import EmployerCompanyForm from "@/components/features/employer/auth/EmployerCompanyForm";
import EmployerAuthLayout from "@/components/layout/EmployerAuthLayout";

export default function EmployerCompanyPage() {
  return (
    <EmployerAuthLayout backgroundImage="/images/login-bg.jpg">
      <EmployerCompanyForm />
    </EmployerAuthLayout>
  );
}
