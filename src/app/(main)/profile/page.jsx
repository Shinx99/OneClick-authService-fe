"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import ExperienceList from "@/components/features/profile/ExperienceList";
import SkillList from "@/components/features/profile/SkillList";
import EducationList from "@/components/features/profile/EducationList";
import DocumentSidebar from "@/components/features/profile/DocumentSidebar";
import AboutSection from "@/components/features/profile/AboutPage";
import ReferenceLink from "@/components/features/profile/ReferenceLink";

const ProfilePage = () => {

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c853]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    //router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-6">
          <ProfileHeader />
        </section>
        <section className="mb-6">
          <AboutSection />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExperienceList />
            <EducationList />
            <SkillList />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <ReferenceLink />
            <div className="mt-3">
              <DocumentSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;