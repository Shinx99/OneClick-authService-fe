import React from "react";
import SearchBar from "@/components/ui/SearchBar";

const Background = ({ onSearch }) => {
  return (
    <section className="relative w-full h-[280px] flex items-center justify-center">
      {/* Lớp ảnh nền */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/images/thienNhien.jpg')" }}
      >
        {/* Overlay: Ở Light mode thì nhạt, Dark mode thì đậm hơn một chút 
           nhưng vẫn phải nhìn thấy ảnh phía sau.
        */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60 transition-colors duration-500"></div>
      </div>

      <div className="w-full max-w-5xl px-4 z-20 relative">
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-8 drop-shadow-lg uppercase">
          Tìm kiếm công việc mơ ước của bạn
        </h1>
        <SearchBar className="max-w-4xl" onSearch={onSearch} />
      </div>
    </section>
  );
};

export default Background;
