"use client";
import { FaLock, FaKey, FaCheckCircle } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ChangePasswordForm() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-[40px] shadow-sm border border-gray-50 text-center">
      {/* Icon Header Gốc */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Đặt lại mật khẩu mới
      </h2>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn bên dưới.
      </p>

      <form className="space-y-4 text-left">
        {/* Dùng thẳng type="password", trình duyệt sẽ tự lo phần hiển thị con mắt */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
            Mật khẩu hiện tại
          </label>
          <Input
            icon={<FaKey />}
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            name="currentPassword"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
            Mật khẩu mới
          </label>
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
            name="newPassword"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
            Xác nhận mật khẩu
          </label>
          <Input
            icon={<FaCheckCircle />}
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            name="confirmPassword"
          />
        </div>

        <div className="pt-2">
          <Button className="w-full bg-[#288a24] hover:bg-[#1e6b1b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all">
            Cập nhật mật khẩu
          </Button>
          <button
            type="button"
            className="w-full mt-6 text-sky-400 text-sm font-medium hover:underline cursor-pointer transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
