"use client";
import React from "react";
import EmployerPendingView from "@/components/features/employer/auth/EmployerPendingView";
import EmployerAuthLayout from "@/components/layout/EmployerAuthLayout";

export default function EmployerPendingPage() {
  return (
    <EmployerAuthLayout backgroundImage="/images/login-bg.jpg">
      <EmployerPendingView />
    </EmployerAuthLayout>
  );
}
