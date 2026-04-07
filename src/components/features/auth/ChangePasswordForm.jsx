"use client";
import React, { use } from "react";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "@/lib/validators/auth";
import { FaLock, FaKey, FaCheckCircle } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";

const ChangePasswordForm = () => {
  // Giả sử useAuth có hàm changePassword và trạng thái isLoading
  const { changePassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

const onSubmit = async (data) => {
    const payload = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    // Gọi hàm đổi mật khẩu từ context
    const success = await changePassword(payload);
    
    // Nếu thành công có thể reset form
    if (success) reset();
  };

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-gray-100">
        Đổi mật khẩu
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- MẬT KHẨU HIỆN TẠI --- */}
        <div className="mb-5 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Mật khẩu hiện tại"
            autoComplete="current-password"
            {...register("oldPassword")}
          />
          {errors.oldPassword && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        {/* --- MẬT KHẨU MỚI --- */}
        <div className="mb-5 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Mật khẩu mới"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* --- XÁC NHẬN MẬT KHẨU MỚI --- */}
        <div className="mb-6 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* --- NÚT CẬP NHẬT --- */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
        >
          {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;

// export default function ChangePasswordForm() {
//   return (
//     <div className="max-w-md mx-auto p-8 bg-white rounded-[40px] shadow-sm border border-gray-50 text-center">
//       {/* Icon Header Gốc */}
//       <div className="flex justify-center mb-6">
//         <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
//           <svg
//             className="w-8 h-8 text-green-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//         </div>
//       </div>

//       <h2 className="text-2xl font-bold text-slate-800 mb-2">
//         Đặt lại mật khẩu mới
//       </h2>
//       <p className="text-gray-400 text-sm mb-8 leading-relaxed">
//         Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn bên dưới.
//       </p>

//       <form className="space-y-4 text-left">
//         {/* Dùng thẳng type="password", trình duyệt sẽ tự lo phần hiển thị con mắt */}

//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
//             Mật khẩu hiện tại
//           </label>
//           <Input
//             icon={<FaKey />}
//             type="password"
//             placeholder="Nhập mật khẩu hiện tại"
//             name="currentPassword"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
//             Mật khẩu mới
//           </label>
//           <Input
//             icon={<FaLock />}
//             type="password"
//             placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
//             name="newPassword"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
//             Xác nhận mật khẩu
//           </label>
//           <Input
//             icon={<FaCheckCircle />}
//             type="password"
//             placeholder="Nhập lại mật khẩu mới"
//             name="confirmPassword"
//           />
//         </div>

//         <div className="pt-2">
//           <Button className="w-full bg-[#288a24] hover:bg-[#1e6b1b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all">
//             Cập nhật mật khẩu
//           </Button>
//           <button
//             type="button"
//             className="w-full mt-6 text-sky-400 text-sm font-medium hover:underline cursor-pointer transition-all"
//           >
//             Hủy bỏ
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
