"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingChatButton from "@/components/ui/FloatingChatButton";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";

export default function MainLayout({ children }) {
  const { isAuthenticated, isCandidate, isAdmin, isRecruiter, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { updateProfile } = useCandidateProfile();

  const hasUpdated = React.useRef(false)

  // Danh sách route cho phép recruiter truy cập (không redirect)
  const allowedRoutesForRecruiter = [
    '/CVMarket/ResumePublicDetail',
    '/jobs',
     '/jobs/', 
  ];
  const allowedRoutesForAdmin = [
    '/admin',
  ];

  const isAllowedRoute = (allowedList) => {
    return allowedList.some(route => pathname?.startsWith(route));
  };

  // Đồng bộ profile candidate
  React.useEffect(() => {
    if (isAuthenticated && isCandidate && user && !hasUpdated.current) {
      hasUpdated.current = true;
      updateProfile({
        candidateId: user.id,
        email: user.email,
        phone: user.phone,
        status: user.status,
      }).catch(console.error);
    }
  }, [isAuthenticated, isCandidate, user, updateProfile]);

  // Xử lý redirect (chỉ redirect nếu route không được phép)
  React.useEffect(() => {
    if (!isAuthenticated) return;

    if (isRecruiter && !isAllowedRoute(allowedRoutesForRecruiter)) {

      // router.push("/employer/dashboard");

      router.push("/employer/job-posting");

      toast.success("Đang chuyển hướng về trang chủ nhà tuyển dụng");
      // router.refresh();
    } else if (isAdmin && !isAllowedRoute(allowedRoutesForAdmin)) {
      router.push("/admin");
      toast.success("Đang chuyển hướng về trang admin");
      // router.refresh();
    }
  }, [isAuthenticated, isRecruiter, isAdmin, pathname, router]);

  const shouldRedirect = isAuthenticated && (
    (isRecruiter && !isAllowedRoute(allowedRoutesForRecruiter)) ||
    (isAdmin && !isAllowedRoute(allowedRoutesForAdmin))
  );

  if (shouldRedirect) {
    return <div className="flex items-center justify-center min-h-screen bg-background">...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Navbar />
      <main className="flex-grow bg-transparent transition-colors duration-300">{children}</main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
}