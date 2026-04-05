"use client";
import React, { useState } from "react";
import { FaCheckCircle, FaMobileAlt, FaQrcode } from "react-icons/fa";

const VNeIDVerification = ({ initialStatus = "pending", onVerify }) => {
  const [status, setStatus] = useState(initialStatus);

  const handleVNeIDConnect = () => {
    // Trigger VNeID app hoặc QR scan
    if (onVerify) {
      onVerify("verifying");
      // Simulate VNeID verification process
      setTimeout(() => {
        setStatus("verified");
        if (onVerify) onVerify("verified");
      }, 2000);
    }
  };

  const StatusIcon = () => {
    if (status === "verified") {
      return <FaCheckCircle className="w-12 h-12 text-green-500" />;
    }
    if (status === "verifying") {
      return (
        <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      );
    }
    return <FaMobileAlt className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl border-2 border-emerald-200 dark:border-emerald-800/50 transition-all shadow-xl">
      {/* VNeID Status */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative p-4 bg-white/80 dark:bg-gray-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
          <StatusIcon />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {status === "verified" && (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
            <span className={`text-sm font-bold ${status === "verified" ? "text-green-700 dark:text-green-300" :
              status === "verifying" ? "text-yellow-600 dark:text-yellow-400" :
                "text-gray-600 dark:text-gray-400"
              }`}>
              {status === "verified" ? "Đã xác minh VNeID" :
                status === "verifying" ? "Đang xác minh..." :
                  "Chưa xác minh"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
            Xác minh danh tính qua VNeID - Chính phủ điện tử Việt Nam
          </p>
        </div>
      </div>

      {/* Connect VNeID */}
      {status !== "verified" && (
        <div className="space-y-4">
          {/* QR Code Scan */}
          <div className="text-center p-4 bg-white/60 dark:bg-gray-900/40 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700">
            <FaQrcode className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Mở app VNeID → Quét mã QR
            </p>
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-green-200 dark:from-emerald-800 dark:to-green-800 rounded-2xl mx-auto shadow-lg animate-pulse border-4 border-white dark:border-gray-800">
              {/* QR Code placeholder - thay bằng QR thật */}
              <div className="flex items-center justify-center h-full text-xs font-bold text-emerald-600 dark:text-emerald-400">
                VNeID QR
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleVNeIDConnect}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform-gpu"
          >
            Kết nối VNeID ngay
          </button>

          {/* Benefits */}
          <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lợi ích:</p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Xác minh tức thì &lt; 5s</li>
              <li>• Không cần upload ảnh CCCD</li>
              <li>• Badge "Đã xác minh" trên hồ sơ</li>
              <li>• Ưu tiên hiển thị cho nhà tuyển dụng</li>
            </ul>
          </div>
        </div>
      )}

      {status === "verified" && (
        <div className="text-center pt-6 border-t border-emerald-200 dark:border-emerald-800/50">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 px-4 py-2 rounded-full border-2 border-emerald-300 dark:border-emerald-700">
            <FaCheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Xác minh thành công!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VNeIDVerification;