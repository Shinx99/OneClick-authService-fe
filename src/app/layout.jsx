import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

// Cấu hình Font chữ
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

// export const metadata = {
//   title: "One-Click | Nền tảng tuyển dụng hàng đầu",
//   description:
//     "Khám phá hàng ngàn cơ hội việc làm và kết nối với những nhân tài hàng đầu.",
// };

export default function RootLayout({ children }) {

  console.log("GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID); // debug

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased text-slate-800`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>

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
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
