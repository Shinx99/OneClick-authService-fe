import React from "react";
import { FaUser, FaLock, FaFacebook, FaSearch } from "react-icons/fa";

const Hero = () => {
  return (
    <section className=" relative w-auto h-[220px] flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background Image với lớp phủ mờ */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('thienNhien.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Nội dung chính */}
      <div className="text-center max-w-4xl px-4 z-10">
        {/* Thanh tìm kiếm (Search Bar) */}
        <div className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl mx-auto border border-gray-100">
          <div className="flex-1 flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-gray-200 py-3 md:py-0">
            <input
              icon={<FaSearch />}
              type="text"
              placeholder="Tên công việc, vị trí..."
              className="outline-none text-gray-700 w-full text-sm"
            />
          </div>

          <div className="flex-1 flex items-center px-6 w-full py-3 md:py-0">
            <span className="text-gray-400 mr-3">📍</span>
            <input
              type="text"
              placeholder="Địa điểm"
              className="outline-none text-gray-700 w-full text-sm"
            />
          </div>

          <button className="bg-[#00e676] hover:bg-[#00c853] text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg w-full md:w-auto cursor-pointer">
            Tìm kiếm
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
