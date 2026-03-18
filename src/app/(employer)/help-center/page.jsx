"use client";
import React, { useState, useEffect } from "react";import HeroArea from "@/components/features/employer/HeroArea";
import AiTechnology from "@/components/features/employer/AiTechnology";
import OutstandingFeatures from "@/components/features/employer/OutstandingFeatures";
import PricingPlan from "@/components/features/employer/PricingPlan";

export default function EmployerLandingPage() {
  return (
    <div className="transition-colors duration-300">
      <HeroArea />
      <AiTechnology />
      <OutstandingFeatures />
      <PricingPlan />
    </div>
  );
}
