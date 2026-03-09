import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Thiết kế mặc định cho cái khung Toast
            className: "",
            style: {
              background: "#ffffff",
              color: "#334155", // slate-700
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: "600",
              padding: "16px 20px",
              borderRadius: "16px", // Bo góc tròn hiện đại
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", // Đổ bóng 3D nổi bật
              border: "1px solid #f1f5f9", // slate-100 viền siêu mỏng
            },
            // Thiết kế riêng cho thông báo Thành công
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B94F", // Xanh lá chuẩn của nút Đăng nhập One-Click
                secondary: "#ffffff",
              },
            },
            // Thiết kế riêng cho thông báo Lỗi
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444", // Đỏ chuẩn của Tailwind
                secondary: "#ffffff",
              },
            },
          }}
          containerStyle={{
            top: 100,
            right: 20,
          }}
        />

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
