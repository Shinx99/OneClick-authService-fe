"use client";
import React from "react";
import Button from "@/components/ui/Button";

const OtpPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#1e1e1e] flex items-center justify-center p-4">
      {/* Card OTP - nhỏ gọn hơn */}
      <div className="bg-white w-full max-w-[550px] p-10 rounded-[30px] text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide">
          Nhập Mã OTP
        </h2>
        <p className="text-gray-500 text-sm mb-10">
          Mã xác thực được gửi đến qua email của bạn
        </p>

        {/* 6 ô Input OTP */}
        <div className="flex justify-center gap-3 mb-10">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-14 border border-gray-300 rounded-lg text-center text-2xl font-bold text-gray-800 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        <Button variant="primary" className="mb-8 h-14 text-lg">
          Accept
        </Button>

        <p className="text-sm text-gray-600">
          Bạn không nhận được mã?{" "}
          <button className="text-[#0056b3] hover:underline font-bold ml-1">
            Gửi lại
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
