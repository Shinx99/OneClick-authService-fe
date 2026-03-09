import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiBriefcase, FiBookmark } from "react-icons/fi";
import {
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiPaperAirplane,
} from "react-icons/hi2";

const JobSidebar = ({ data }) => {
  return (
    // 'sticky top-6' giúp Sidebar trượt theo màn hình khi lăn chuột
    <aside className="sticky top-6 space-y-6">
      {/* ==========================================
          KHỐI 1: THÔNG TIN NHANH
      ========================================== */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Thông tin nhanh
        </h3>

        <div className="space-y-5 mb-6">
          {/* Mức lương */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-500">
              <HiOutlineCurrencyDollar className="text-xl" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                Mức lương
              </p>
              <p className="font-bold text-gray-900">{data.salary}</p>
            </div>
          </div>

          {/* Địa điểm */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
              <FiMapPin className="text-xl" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                Địa điểm
              </p>
              <p className="font-bold text-gray-900">{data.location}</p>
              <Link href="#" className="text-xs text-blue-500 hover:underline">
                Xem bản đồ
              </Link>
            </div>
          </div>

          {/* Hình thức */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-orange-500">
              <FiBriefcase className="text-xl" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                Hình thức
              </p>
              <p className="font-bold text-gray-900">{data.type}</p>
            </div>
          </div>

          {/* Cấp bậc */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-purple-500">
              <HiOutlineAcademicCap className="text-xl" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                Cấp bậc
              </p>
              <p className="font-bold text-gray-900">{data.level}</p>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="space-y-3">
          <button className="w-full bg-[#10B94F] hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
            <HiPaperAirplane className="text-lg -rotate-45 mb-1" />
            Ứng tuyển ngay
          </button>
          <button className="w-full bg-white border border-[#10B94F] text-[#10B94F] hover:bg-green-50 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            <FiBookmark className="text-lg" />
            Lưu
          </button>
        </div>
      </div>

      {/* ==========================================
          KHỐI 2: THÔNG TIN CÔNG TY
      ========================================== */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0 bg-gray-50 relative">
            <Image
              src={data.logo}
              alt="Company Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-[15px]">
              {data.company}
            </h4>
            <Link
              href="#"
              className="text-xs text-gray-500 hover:text-green-600 hover:underline"
            >
              Xem trang công ty
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          Chúng tôi là công ty tiên phong trong lĩnh vực công nghệ môi trường,
          chuyên cung cấp các giải pháp bền vững cho các doanh nghiệp toàn cầu.
        </p>

        <div className="space-y-3 text-[13px]">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="text-gray-500">Quy mô</span>
            <span className="font-semibold text-gray-800">
              {data.companySize}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Website</span>
            <Link
              href={`https://${data.website}`}
              target="_blank"
              className="font-semibold text-blue-500 hover:underline"
            >
              {data.website}
            </Link>
          </div>
        </div>
      </div>

      {/* ==========================================
          KHỐI 3: BẢN ĐỒ VỊ TRÍ
      ========================================== */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative group cursor-pointer">
        {/* Lớp nền giả lập bản đồ */}
        <div className="h-32 w-full bg-[#e5e7eb] relative">
          <Image
            src="https://www.google.com/maps/vt/pb=!1m4!1m3!1i13!2i1313!3i3143!2m3!1e0!2sm!3i420120488!3m7!2sen!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i1301875"
            alt="Map background"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          {/* Lớp mờ đen bên trên */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Nút xem vị trí (nổi lên trên) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <p className="text-gray-800 font-bold mb-2 text-sm drop-shadow-md bg-white/80 px-2 py-0.5 rounded">
            San Francisco
          </p>
          <button className="w-full bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2">
            <FiMapPin />
            Xem vị trí văn phòng
          </button>
        </div>
      </div>
    </aside>
  );
};

export default JobSidebar;
