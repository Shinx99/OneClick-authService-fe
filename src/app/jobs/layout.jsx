import React from "react";
import Background from "@/components/features/home/Background";
export default function JobLayout({ children }) {
  return (
    <div className="job-layout-container">
      <Background />
      {children}
    </div>
  );
}
