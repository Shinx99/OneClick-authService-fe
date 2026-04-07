"use client";
import React, { useEffect, useState, useRef, Suspense } from "react"; // Thêm useRef
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import candidateService from "@/services/candidate.service";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const VerifyContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    // 👉 THÊM DÒNG NÀY: Nếu đã gọi API rồi thì dừng lại, không gọi lần 2
    if (hasCalledAPI.current) return;

    // Đóng chốt lại ngay lập tức
    hasCalledAPI.current = true;

    const verifyAccount = async () => {
      try {
        const response = await authService.verifyEmail(token);

        const payload = {
          candidateId: response?.accountId || null,
          email: response?.email || null,
          phone: response?.phone || null,
          status: response?.status || "active",
        }

        if (response?.roles.includes("candidate")) {
          await candidateService.updateProfile(payload);
        }

        setStatus("success");
        toast.success("Xác thực thành công! Đang chuyển hướng...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {

        console.error("Lỗi xác thực hoặc cập nhật profile:", error);

        setStatus("error");
        toast.error("Xác thực thất bại! Link không hợp lệ hoặc đã hết hạn.");
      }
    };

    verifyAccount();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
        {/* TRẠNG THÁI LOADING */}
        {status === "loading" && (
          <div className="animate-pulse">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Đang xác thực...
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Vui lòng không tắt trình duyệt.
            </p>
          </div>
        )}

        {/* TRẠNG THÁI SUCCESS */}
        {status === "success" && (
          <div>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Thành công!</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Tài khoản của bạn đã được kích hoạt.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Đang tự động chuyển về Đăng nhập...
            </p>
          </div>
        )}

        {/* TRẠNG THÁI ERROR */}
        {status === "error" && (
          <div>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              ✕
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Xác thực thất bại!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
              Link xác thực không tồn tại hoặc đã hết hạn.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Quay lại Đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<div className="text-center mt-20">Đang khởi tạo...</div>}
    >
      <VerifyContent />
    </Suspense>
  );
}
