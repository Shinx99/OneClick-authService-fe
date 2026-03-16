import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function MainLayout({ children }) {
  return (
    // Dùng <div> thay vì <html><body>
    <div className="flex flex-col min-h-screen">
      {/* Thanh điều hướng */}
      <Navbar />

      {/* Nội dung trang (Trang chủ, Việc làm, Công ty...) */}
      <main className="flex-grow bg-slate-50/30">{children}</main>

      {/* Chân trang */}
      <Footer />
    </div>
  );
}
