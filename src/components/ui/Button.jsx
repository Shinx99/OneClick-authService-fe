import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  // Thêm 'cursor-pointer' cho trạng thái bình thường
  // Thêm 'disabled:cursor-not-allowed' và bỏ các hiệu ứng hover khi nút bị disable
  const baseStyle = `
    w-full py-3 rounded-full font-bold text-sm transition-all duration-300 ease-in-out 
    flex items-center justify-center gap-2 active:scale-95 
    cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
  `;

  const variants = {
    // Thêm 'disabled:hover:...' để khi disable thì không bị nảy lên hay đổi màu nữa
    primary:
      "bg-black text-white hover:bg-[#222222] hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-500/30 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-black",

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
