import React from "react";
import JobForYou from "@/components/features/home/JobForYou";
import JobFilter from "@/components/features/jobs/JobFilter";

const JobsPage = () => {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#121212] min-h-screen transition-colors mx-5">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6">
              <JobFilter />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <JobForYou />
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
