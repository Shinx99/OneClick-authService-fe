import React from "react";
import Link from "next/link";
import Image from "next/image";
// Import Icons
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { PiLeaf, PiTree, PiTreeEvergreen } from "react-icons/pi";

const NotFoundUI = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* --- PHẦN 1: HÌNH ẢNH --- */}
      <div className="relative w-full max-w-[400px] aspect-square mb-8 group">
        <div className="absolute inset-4 bg-green-900/20 blur-2xl rounded-full transform translate-y-4 group-hover:translate-y-6 transition-transform duration-500"></div>

        <div className="relative w-full h-full rounded-[30px] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
          <Image
            src="/images/404-forest.jpg"
            alt="Lost in forest"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* --- PHẦN 2: NỘI DUNG --- */}
      <div className="text-center w-full z-10 px-4 flex flex-col items-center">
        {/* Badge 404 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800 shadow-sm mb-6 whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold tracking-widest text-green-700 dark:text-green-400 uppercase font-sans">
            Error 404
          </span>
        </div>

        {/* Tiêu đề chính */}
        {/* CẬP NHẬT QUAN TRỌNG:
            1. md:whitespace-nowrap: Trên PC/Tablet bắt buộc nằm trên 1 dòng.
            2. text-2xl md:text-5xl: Chỉnh lại cỡ chữ để vừa vặn hơn.
            3. w-full: Chiếm toàn bộ chiều ngang để có chỗ hiển thị 1 dòng.
        */}
        <h1 className="text-2xl md:text-5xl font-black mb-6 leading-tight bg-gradient-to-br from-green-800 via-green-600 to-slate-800 dark:from-green-400 dark:via-green-500 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm w-full md:whitespace-nowrap">
          Rất tiếc, trang bạn tìm kiếm không tồn tại
        </h1>

        {/* Đoạn mô tả */}
        <div className="text-slate-500 dark:text-slate-400 text-base md:text-lg mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
          <p className="mb-1">
            Có vẻ như bạn đã đi lạc vào một vùng rừng lạ mờ ảo.
          </p>
          <p>
            Đừng lo lắng, hãy để{" "}
            <span className="text-green-600 font-extrabold underline decoration-green-200 underline-offset-4 hover:decoration-green-500 transition-all cursor-default whitespace-nowrap">
              One-Click
            </span>{" "}
            dẫn đường cho bạn quay trở lại.
          </p>
        </div>

        {/* --- PHẦN 3: BUTTONS --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#10B94F] hover:bg-[#0e9f43] text-white rounded-full font-bold shadow-lg shadow-green-200 transition-all hover:-translate-y-1 hover:shadow-xl group"
          >
            <FaHome
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="whitespace-nowrap">Về trang chủ</span>
          </Link>

          <Link
            href="/support"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 hover:border-green-500 text-slate-600 dark:text-gray-300 hover:text-green-600 rounded-full font-bold shadow-sm hover:shadow-md transition-all group"
          >
            <BiSupport
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="whitespace-nowrap">Báo cáo sự cố</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundUI;
