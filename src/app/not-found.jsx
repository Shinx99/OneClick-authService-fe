import React from "react";
import { Nunito } from "next/font/google";
import NotFoundUI from "@/components/common/Not-found"; // Import giao diện từ file của bạn

// 1. Cấu hình Font Nunito (chỉ tải ở server)
const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "800"],
});

// 2. Cấu hình SEO (Metadata)
export const metadata = {
  title: "404: Lạc lối trong rừng - One-Click",
  description: "Trang bạn tìm kiếm không tồn tại.",
  robots: {
    index: false,
    follow: true,
  },
};

// 3. Render
export default function NotFound() {
  return (
    // Truyền class font xuống để giao diện bên trong được hưởng
    <main className={nunito.className}>
      <NotFoundUI />
    </main>
  );
}
