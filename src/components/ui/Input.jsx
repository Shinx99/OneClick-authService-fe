import React from "react";

const Input = ({ icon, type = "text", placeholder, ...props }) => {
  return (
    <div className="w-full mb-4">
      <div className="relative flex items-center bg-[#DCE6F5] rounded-2xl px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-blue-200">
        {/* Icon nằm bên trái (nếu có) */}
        {icon && <span className="text-gray-500 mr-3 text-lg">{icon}</span>}

        <input
          type={type}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500 text-sm font-medium"
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
