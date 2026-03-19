"use client";
import React from "react";
import EmployerVerifyForm from "@/components/features/employer/auth/EmployerVerifyForm";
import EmployerAuthLayout from "@/components/layout/EmployerAuthLayout";

export default function EmployerVerifyPage() {
  return (
    <EmployerAuthLayout backgroundImage="/images/login-bg.jpg">
      <EmployerVerifyForm />
    </EmployerAuthLayout>
  );
}
