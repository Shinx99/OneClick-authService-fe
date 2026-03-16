import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Cấu hình Font chữ
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "One-Click | Nền tảng tuyển dụng hàng đầu",
//   description:
//     "Khám phá hàng ngàn cơ hội việc làm và kết nối với những nhân tài hàng đầu.",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-800`}
      >
        {/* TOASTER ĐẶT Ở ĐÂY ĐỂ TRANG NÀO CŨNG GỌI ĐƯỢC */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: "",
            style: {
              background: "#ffffff",
              color: "#334155",
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: "600",
              padding: "16px 20px",
              borderRadius: "16px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f1f5f9",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B94F",
                secondary: "#ffffff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
          containerStyle={{
            top: 100,
            right: 20,
          }}
        />

        {/* Nơi nhúng các Layout con */}
        {children}
      </body>
    </html>
  );
}
