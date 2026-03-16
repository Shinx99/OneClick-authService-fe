"use client"; // Bắt buộc vì dùng useState
import React, { useState } from "react";
import Link from "next/link";
import { FiUser, FiBriefcase, FiArrowRight } from "react-icons/fi";

const RoleSelectionModal = ({ isOpen, onClose }) => {
  // State quản lý trạng thái đang rung lắc
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  // Hàm xử lý khi người dùng click ra ngoài Modal
  const handleBackdropClick = (e) => {
    // Chỉ kích hoạt rung khi click TRÚNG LỚP NỀN ĐEN (không phải click vào phần trắng của form)
    if (e.target === e.currentTarget) {
      setIsShaking(true);

      // Sau 500ms (bằng thời gian rung) thì tắt trạng thái rung để lần sau click còn rung tiếp
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  return (
    <>
      {/* 1. Nhúng đoạn CSS Keyframes cho hiệu ứng rung trực tiếp vào đây */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      {/* Lớp phủ đen mờ (Backdrop) - Thêm sự kiện onClick vào đây */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
        onClick={handleBackdropClick}
      >
        {/* Khối Modal chính - Thêm class 'animate-shake' dựa vào biến isShaking */}
        <div
          className={`bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-transform ${
            isShaking
              ? "animate-shake ring-4 ring-red-500/20"
              : "animate-slideUp"
          }`}
        >
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Chào mừng đến với OneClick! 👋
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Để bắt đầu, vui lòng cho chúng tôi biết bạn là ai?
            </p>

            {/* 2 Khối chọn Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              {/* Card Ứng Viên */}
              <Link
                href="/register"
                onClick={onClose}
                className="group border-2 border-gray-100 rounded-2xl p-6 hover:border-green-500 hover:bg-green-50/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiUser className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tôi là Ứng viên
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Tôi muốn tạo CV, tìm kiếm việc làm và phát triển sự nghiệp.
                </p>
                <div className="flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Tạo tài khoản ứng viên <FiArrowRight className="ml-2" />
                </div>
              </Link>

              {/* Card Nhà Tuyển Dụng */}
              <Link
                href="/register-employer"
                onClick={onClose}
                className="group border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiBriefcase className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tôi là Nhà tuyển dụng
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Tôi muốn đăng tin tuyển dụng và tìm kiếm nhân tài cho công ty.
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Tạo tài khoản công ty <FiArrowRight className="ml-2" />
                </div>
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="text-sm text-gray-500 font-medium">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:underline font-bold"
                  onClick={onClose}
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelectionModal;
