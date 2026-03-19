"use client";
import React from "react";

const EmployerAuthLayout = ({ children, backgroundImage = "/images/login-bg.jpg" }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Cột trái: Form - Chiếm 6 phần (60%) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {children}
      </div>

      {/* Cột phải: Hình ảnh (Background) - Chiếm 4 phần (40%) */}
      <div 
        className="hidden lg:flex lg:w-[40%] bg-cover bg-center relative"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-blue-900/60 backdrop-brightness-75 mix-blend-multiply"></div>
        {/* Lớp overlay nâng nội dung lên để đọc rõ */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

        <div className="absolute top-1/2 -translate-y-[60%] left-10 right-10 text-white z-10">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Build your <span className="text-green-400">dream team</span>
          </h2>
          <p className="text-base xl:text-lg text-gray-200">
            Access a curated pool of institutional talent and streamline your entire hiring lifecycle with our intelligent dashboard.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="w-6 h-1 bg-green-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerAuthLayout;
