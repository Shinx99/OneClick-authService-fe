import React from "react";
import WelcomeBanner from "@/components/features/employer/dashboard/WelcomeBanner";
import StatsCards from "@/components/features/employer/dashboard/StatsCards";
import CVSubmissionsChart from "@/components/features/employer/dashboard/CVSubmissionsChart";
import PendingActions from "@/components/features/employer/dashboard/PendingActions";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";

export default function DashboardPage() {
  return (
    <RestrictedWrapper>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Stats Cards */}
        <StatsCards />

        {/* Bottom Section: Chart + Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <CVSubmissionsChart />
          </div>
          <div className="lg:col-span-1">
            <PendingActions />
          </div>
        </div>
      </div>
    </RestrictedWrapper>
  );
}
