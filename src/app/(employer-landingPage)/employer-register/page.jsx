"use client";

import React from "react";
import EmployerRegisterForm from "@/components/features/employer/auth/EmployerRegister";
import EmployerAuthLayout from "@/components/layout/EmployerAuthLayout";

export default function EmployerRegisterPage() {
  return (
    <EmployerAuthLayout backgroundImage="/images/login-bg.jpg">
      <EmployerRegisterForm />
    </EmployerAuthLayout>
  );
}
