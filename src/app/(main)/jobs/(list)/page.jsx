"use client";

import React, { useState, useCallback } from "react";
import JobFilter from "@/components/features/jobs/JobFilter";
import JobList from "@/components/features/jobs/JobList";
import Background from "@/components/features/home/Background";

const DEFAULT_FILTERS = {
  page: 0,
  size: 6,
  sortBy: "createdAt",
  sortDir: "desc",
};

const JobsPage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((keyword) => {
    setFilters((prev) => ({ ...prev, keyword, page: 0 }));
  }, []);

  return (
    <div className="bg-background min-h-screen transition-colors duration-500">
      {/* Banner search — z-30 để dropdown gợi ý nổi lên trên phần danh sách bên dưới */}
      <div className="relative z-30">
        <Background
          showSearch={true}
          onSearch={handleSearch}
          title="Tìm kiếm công việc mơ ước"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar Lọc */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28">
              <div className="bg-card-bg border border-card-border rounded-[32px] p-8 shadow-xl shadow-neutral-500/5">
                <JobFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </aside>

          {/* Danh sách công việc */}
          <main className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <JobList filters={{ ...filters, onPageChange: handlePageChange }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
