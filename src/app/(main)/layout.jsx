"use client";
import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingChatButton from "@/components/ui/FloatingChatButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MainLayout({ children }) {

  const { isAuthenticated, isCandidate, isAdmin } = useAuth();
  const router = useRouter();

  // Nếu đã login và KHÔNG phải candidate (tức là recruiter) thì redirect
  React.useEffect(() => {
    if (isAuthenticated && !isCandidate && !isAdmin) {
      router.push("/employer/dashboard");
      toast.success("Đang chuyển hướng về lại trang chủ Nhà Tuyển Dụng");
      router.refresh();
    }
  }, [isAuthenticated, isCandidate, isAdmin, router])

  // Nếu đang redirect thì show loading
  if (isAuthenticated && !isCandidate && !isAdmin) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c853] mx-auto mb-4"></div>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );

  }

  return (
    // Dùng <div> thay vì <html><body>
    <div className="flex flex-col min-h-screen">
      {/* Thanh điều hướng */}
      <Navbar />

      {/* Nội dung trang (Trang chủ, Việc làm, Công ty...) */}
      <main className="flex-grow bg-slate-50/30">{children}</main>

      {/* Chân trang */}
      <Footer />
      <FloatingChatButton />

    </div>
  );
}
