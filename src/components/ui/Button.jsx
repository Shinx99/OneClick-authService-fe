import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  // Giữ nguyên phần baseStyle
  const baseStyle = `
    w-full py-3 rounded-full font-bold text-sm transition-all duration-300 ease-in-out 
    flex items-center justify-center gap-2 active:scale-95 
    cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
  `;

  const variants = {
    // [ĐÃ SỬA] Đổi từ bg-black sang bg-green-600, hover sang màu xanh đậm hơn (green-700)
    // Tôi cũng đổi bóng (shadow) sang màu xanh mờ (shadow-green-600/30) để tạo hiệu ứng phát sáng đẹp mắt!
    primary:
      "bg-green-600 text-white hover:bg-green-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-600/30 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-green-600",

    // Nút social giữ nguyên màu trắng viền xám để làm nền, làm nổi bật nút Primary lên
    social:
      "bg-white text-black border border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-md disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-white disabled:hover:border-gray-200",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
