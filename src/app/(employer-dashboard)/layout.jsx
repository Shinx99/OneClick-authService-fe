import React from "react";
import Sidebar from "@/components/common/employer-dashboard/Sidebar";
import TopNav from "@/components/common/employer-dashboard/TopNav";

export default function EmployerDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width) */}
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        {/* Top Navigation */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
