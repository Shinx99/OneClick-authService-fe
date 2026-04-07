import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-text-main transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <AuthProvider>
            {/* Cấu hình Toaster tối ưu chống Spam */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={12}
              // GIỚI HẠN SỐ LƯỢNG: Tối đa 3 thông báo cùng lúc để tránh tràn màn hình
              toastOptions={{
                limit: 3,
                duration: 3000, // Thời gian hiển thị ngắn lại (3s) để giải phóng không gian nhanh
                style: {
                  background: "var(--card-bg)",
                  color: "var(--text-main)",
                  border: "2px solid var(--card-border)",
                  borderRadius: "20px",
                  padding: "16px 24px",
                  fontSize: "14px",
                  fontWeight: "500", // Giao diện SaaS không dùng Bold
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
                  maxWidth: "420px",
                },
                success: {
                  iconTheme: {
                    primary: "#00c853",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ff4b4b",
                    secondary: "#ffffff",
                  },
                  style: {
                    border: "2px solid rgba(255, 75, 75, 0.4)",
                  },
                },
              }}
              containerStyle={{
                // Dịch xuống dưới Navbar (giả định Navbar cao 80px)
                top: 90,
                right: 24,
                bottom: 24,
                left: 24,
              }}
              />
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
