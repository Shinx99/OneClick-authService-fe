import React from "react";
import JobForYou from "@/components/features/home/JobForYou";
import JobFilter from "@/components/features/jobs/JobFilter";
import JobList from "@/components/features/jobs/JobList";

const JobsPage = () => {
  return (
    <div className="bg-background min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar Lọc - Hiện đại */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28">
              <div className="bg-card-bg/50 backdrop-blur-md border border-card-border/50 rounded-[32px] p-8 shadow-xl shadow-neutral-500/5">
                <JobFilter />
              </div>
            </div>
          </aside>

          {/* Danh sách công việc */}
          <main className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <JobList />
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
