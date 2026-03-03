import Image from "next/image";
import Hero from "@/components/features/home/Hero";
import Features from "@/components/features/home/Features";
import JobForYou from "@/components/features/home/JobForYou";
import CallToAction from "@/components/features/home/CallToAction";
export default function Home() {
  return (
    <div>
      <Hero/>
      <JobForYou/>
      <CallToAction/>
      <Features />

    </div>
  );
}
