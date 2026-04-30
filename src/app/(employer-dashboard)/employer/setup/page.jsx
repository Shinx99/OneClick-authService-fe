"use client";
import React, { useState } from "react";
import SetupSidebar from "@/components/features/employer/setup/SetupSidebar";
import SelectFlowScreen from "@/components/features/employer/setup/SelectFlowScreen";
import JoinCompanyScreen from "@/components/features/employer/setup/JoinCompanyScreen";
import CreateCompanyScreen from "@/components/features/employer/setup/CreateCompanyScreen";
import PendingApprovalScreen from "@/components/features/employer/setup/PendingApprovalScreen";

export default function SetupBusinessPage() {
  // flowMode: 'select' | 'create' | 'join' | 'pending'
  const [flowMode, setFlowMode] = useState("select");
  const [successInfo, setSuccessInfo] = useState(null);

  const backToSelect = () => setFlowMode("select");

  const handleCreateSuccess = (info) => {
    setSuccessInfo({ ...info, flowType: "create" });
    setFlowMode("pending");
  };

  const handleJoinSuccess = (info) => {
    setSuccessInfo({ ...info, flowType: "join" });
    setFlowMode("pending");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Background: neutral base + green accent at top */}
      <div className="absolute inset-0 bg-slate-900 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-emerald-600/90 to-transparent z-0"></div>

      <div className="w-full max-w-5xl bg-card-bg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border-2 border-card-border flex flex-col md:flex-row h-full min-h-[600px] max-h-[850px]">
        <SetupSidebar flowMode={flowMode} onBack={backToSelect} />

        <div className="w-full md:w-[70%] bg-card-bg flex flex-col h-full overflow-hidden">
          {flowMode === "select" && <SelectFlowScreen onSelect={setFlowMode} />}
          {flowMode === "join" && (
            <JoinCompanyScreen
              onCancel={backToSelect}
              onSuccess={handleJoinSuccess}
            />
          )}
          {flowMode === "create" && (
            <CreateCompanyScreen
              onCancel={backToSelect}
              onSuccess={handleCreateSuccess}
            />
          )}
          {flowMode === "pending" && (
            <PendingApprovalScreen
              companyName={successInfo?.companyName}
              flowType={successInfo?.flowType}
            />
          )}
        </div>
      </div>
    </div>
  );
}
