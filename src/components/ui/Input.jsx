"use client";
import React, { useId } from "react";

const Input = ({
  icon,
  rightElement,
  type = "text",
  placeholder,
  name,
  ...props
}) => {
  const uniqueId = useId();
  const inputId = name || uniqueId;

  return (
    // Thêm mt-2 để chừa không gian phía trên cho chữ nhảy lên không bị lẹm
    <div className="w-full mb-5 mt-2">
      {/* ĐỔI GIAO DIỆN: Nền trắng, viền xám, khi click vào viền sẽ đổi màu xanh lá */}
      <div className="relative flex items-center bg-white border-[2px] border-gray-200 rounded-xl px-4 h-[56px] transition-all focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10">
        {/* Icon bên trái */}
        {icon && <span className="text-gray-400 mr-3 text-lg">{icon}</span>}

        <div className="relative w-full h-full flex items-center">
          <input
            type={type}
            name={name}
            id={inputId}
            placeholder=" "
            // Đã bỏ pt-4 đi vì chữ bây giờ sẽ nằm chính giữa
            className="peer w-full h-full bg-transparent border-none outline-none text-gray-800 text-[15px] font-semibold"
            {...props}
          />

          {/* HIỆU ỨNG NHẢY LÊN VIỀN CỰC MƯỢT
            - Bình thường: Nằm giữa (top-1/2 -translate-y-1/2)
            - Khi focus hoặc đã có chữ: Bay lên sát viền trên cùng (top-0), lùi sang trái 1 xíu (-left-1), 
              thêm nền trắng (bg-white) và padding (px-1) để đè lên đường viền.
          */}
          {/* Label đóng vai trò làm Placeholder nhảy lên */}
          <label
            htmlFor={inputId}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-[15px] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:font-bold peer-focus:text-green-600 peer-focus:bg-white peer-focus:px-1 peer-focus:-left-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-gray-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-left-1"
          >
            {placeholder}
          </label>
        </div>

        {/* Element bên phải (nếu có) */}
        {rightElement && (
          <div className="ml-2 flex items-center">{rightElement}</div>
        )}
      </div>
    </div>
  );
};

export default Input;
