"use client";
import React, { useId, forwardRef } from "react";

// Bọc toàn bộ component trong forwardRef và nhận thêm tham số 'ref' ở cuối
const Input = forwardRef(
  ({ icon, rightElement, type = "text", placeholder, name, ...props }, ref) => {
    const uniqueId = useId();
    const inputId = name || uniqueId;

    return (
      <div className="w-full mb-5 mt-2">
        <div className="relative flex items-center bg-white border-[2px] border-gray-200 rounded-xl px-4 h-[56px] transition-all focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10">
          {icon && <span className="text-gray-400 mr-3 text-lg">{icon}</span>}

          <div className="relative w-full h-full flex items-center">
            <input
              ref={
                ref
              } /* <--- ĐIỂM QUAN TRỌNG NHẤT LÀ ĐÂY: Nhận ref từ React Hook Form */
              type={type}
              name={name}
              id={inputId}
              placeholder=" "
              className="peer w-full h-full bg-transparent border-none outline-none text-gray-800 text-[15px] font-semibold"
              {...props}
            />

            <label
              htmlFor={inputId}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-[15px] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:font-bold peer-focus:text-green-600 peer-focus:bg-white peer-focus:px-1 peer-focus:-left-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-gray-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-left-1"
            >
              {placeholder}
            </label>
          </div>

          {rightElement && (
            <div className="ml-2 flex items-center">{rightElement}</div>
          )}
        </div>
      </div>
    );
  },
);

// React yêu cầu phải có dòng này khi dùng forwardRef để không bị lỗi cảnh báo
Input.displayName = "Input";

export default Input;
