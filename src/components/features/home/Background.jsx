import React from "react";
import SearchBar from "@/components/ui/SearchBar";
const Background = () => {
  return (
    <section className="relative w-full h-[250px] flex items-center justify-center overflow-hidden">
      {/* Background với Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/images/thienNhien.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="w-full max-w-5xl px-4 z-10">
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-6">
          Tìm kiếm công việc mơ ước của bạn
        </h1>
        <SearchBar className="max-w-4xl" />
      </div>
    </section>
  );
};

export default Background;
