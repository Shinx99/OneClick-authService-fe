"use client";
import React from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import Button from "@/components/ui/Button";

const EmployerPendingView = () => {
  return (
    <div className="w-full max-w-md mx-auto text-center">

      <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
        <FaCheckCircle />
      </div>

      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Hồ sơ đã được gửi!</h2>
      
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 text-left">
        <h3 className="font-bold text-blue-800 mb-2 mt-1">Điều gì xảy ra tiếp theo?</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Cảm ơn bạn đã đăng ký công ty trên One-Click. Đội ngũ quản trị của chúng tôi hiện đang xem xét hồ sơ và xác minh giấy tờ thuế của bạn.
        </p>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>Quá trình xét duyệt thường diễn ra trong vòng <span className="font-semibold text-gray-800">1-3 ngày làm việc</span>.</li>
          <li>Bạn sẽ nhận được email thông báo sau khi tài khoản được kích hoạt hoàn toàn.</li>
        </ul>
      </div>

      <Link href="/" className="block w-full">
        <Button
          type="button"
          variant="primary"
          className="w-full bg-[#00D06A] hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,208,106,0.39)] transition-all flex items-center justify-center gap-2"
        >
          Trở về Trang chủ
        </Button>
      </Link>
    </div>
  );
};

export default EmployerPendingView;
