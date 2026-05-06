// src/components/features/jobs/SaveJobButton.jsx
"use client";

import React from "react";
import { FiHeart } from "react-icons/fi";
import { useSavedJob } from "@/hooks/useSavedJob";

const SaveJobButton = ({ jobId }) => {
  const { isSaved, isLoading, toggleSaveJob } = useSavedJob(jobId);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob();
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all active:scale-90 p-1.5 rounded-full cursor-pointer ${
        isSaved
          ? "text-red-500 bg-red-50 dark:bg-red-500/10"
          : "text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
      }`}
      title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
    >
      <FiHeart size={16} className={isSaved ? "fill-current" : ""} />
    </button>
  );
};

export default SaveJobButton;
