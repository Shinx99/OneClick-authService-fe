"use client";
import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingChatButton from "@/components/ui/FloatingChatButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { useEmployer } from "@/hooks/useEmployer";

export default function MainLayout({ children }) {
  const { isAuthenticated, isCandidate, isAdmin, isRecruiter, user } = useAuth();
  const router = useRouter();
  const { updateProfile } = useCandidateProfile();


  React.useEffect(() => {
    if (isAuthenticated && isCandidate && user) {
      updateProfile({
        candidateId: user.id,
        email: user.email,
        phone: user.phone,
        status: user.status,
      });
    }
  }, [isAuthenticated, isCandidate, user]); // ← chạy 1 lần khi user load xong

  React.useEffect(() => {
    if (isAuthenticated && isRecruiter) {
      router.push("/employer/dashboard");
      toast.success("Đang chuyển hướng về lại trang chủ Nhà Tuyển Dụng");
      router.refresh();
    } else if (isAuthenticated && isAdmin) {
      router.push("/admin")
      toast.success("Đang chuyển hướng về lại trang chủ Admin");
      router.refresh();
    }
  }, [isAuthenticated, isRecruiter, isAdmin, router]);


  if (isAuthenticated && (isRecruiter || isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c853] mx-auto mb-4"></div>
          <p className="text-text-main">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Navbar />

      {/* QUAN TRỌNG: Để bg-transparent để không đè lên ảnh thiên nhiên của Background.jsx
         Màu nền tổng đã được body trong globals.css lo liệu rồi.
      */}
      <main className="flex-grow bg-transparent transition-colors duration-300">
        {children}
      </main>

      <Footer />
      <FloatingChatButton />
    </div>
  );
}
