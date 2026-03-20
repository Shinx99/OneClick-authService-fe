import React from "react";
import SearchFilters from "@/components/features/employer/resume-search/SearchFilters";
import SearchResults from "@/components/features/employer/resume-search/SearchResults";

export default function ResumeSearchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resume Search</h2>
          <p className="text-sm text-slate-400 mt-1">
            Search and discover candidate resumes
          </p>
        </div>
      </div>

      {/* Main Content: Filters + Results */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-72 flex-shrink-0">
          <SearchFilters />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <SearchResults />
        </div>
      </div>
    </div>
  );
}
