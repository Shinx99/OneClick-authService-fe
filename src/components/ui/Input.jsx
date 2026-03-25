"use client";
import React, { useId, forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = forwardRef(
  ({ icon, rightElement, type = "text", placeholder, name, ...props }, ref) => {
    const uniqueId = useId();
    const inputId = name || uniqueId;

    // State quản lý bật/tắt mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // Kiểm tra xem ô này có phải ô nhập password không
    const isPassword = type === "password";

    // Nếu là ô password và đang bật mắt -> đổi thành text. Còn lại giữ nguyên gốc.
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full mb-5 mt-2">
        <div className="relative flex items-center bg-white border-[2px] border-gray-200 rounded-xl px-4 h-[56px] transition-all focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10">

          {/* Icon đầu dòng */}
          {icon && <span className="text-gray-400 mr-3 text-lg">{icon}</span>}

          <div className="relative w-full h-full flex items-center">
            <input
              ref={ref}
              type={currentType}
              name={name}
              id={inputId}
              placeholder=" "
              // [&::-ms-reveal]:hidden [&::-ms-clear]:hidden dùng để tắt con mắt mặc định của Edge
              className="peer w-full h-full bg-transparent border-none outline-none text-gray-800 text-[15px] font-semibold [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              {...props}
            />

            <label
              htmlFor={inputId}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-[15px] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:font-bold peer-focus:text-green-600 peer-focus:bg-white peer-focus:px-1 peer-focus:-left-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-gray-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-left-1"
            >
              {placeholder}
            </label>
          </div>

          {/* NÚT BẤM CON MẮT (Chỉ hiện khi là ô mật khẩu) */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 flex items-center text-gray-400 hover:text-green-500 transition-colors focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}
          {/* Cục rightElement của bạn (Chỉ hiện khi không phải ô Password để tránh đè nhau) */}
          {rightElement && !isPassword && (
            <div className="ml-2 flex items-center">{rightElement}</div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;