import Background from "@/components/features/home/Background";
import Features from "@/components/features/home/Features";
import JobForYou from "@/components/features/home/JobForYou";
import CallToAction from "@/components/features/home/CallToAction";
import CompanyHot from "@/components/features/home/CompanyHot";

export default function Home() {
  return (
    <div className=" transition-colors duration-300">
      {/* Banner search — z-30 để dropdown gợi ý không bị phần dưới đè lên */}
      <div className="relative z-30">
        <Background />
      </div>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 py-4">
        <JobForYou />

        <CallToAction />

        <CompanyHot />

        <Features />
      </main>
    </div>
  );
}
