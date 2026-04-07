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
    primary:
      "bg-green-600 text-white hover:bg-green-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-600/30 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-green-600",

    social:
      "bg-white dark:bg-[#1e293b] text-black dark:text-gray-100 border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-[#334155] hover:-translate-y-1 hover:shadow-md disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-white dark:disabled:hover:bg-[#1e293b] disabled:hover:border-gray-200",
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
