"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiBriefcase, FiBookmark } from "react-icons/fi";
import {
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiPaperAirplane,
} from "react-icons/hi2";
import ApplyModal from "./ApplyModal";

const JobSidebar = ({ data }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);

  const infoItems = [
    {
      icon: <HiOutlineCurrencyDollar />,
      label: "Mức lương",
      value: data.salary,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      icon: <FiMapPin />,
      label: "Địa điểm",
      value: data.location,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      icon: <FiBriefcase />,
      label: "Hình thức",
      value: data.type,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      icon: <HiOutlineAcademicCap />,
      label: "Cấp bậc",
      value: data.level,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
  ];

  return (
    <>
      <aside className="space-y-8">
        <div className="bg-card-bg rounded-[32px] p-8 border border-card-border shadow-sm">
          <h3 className="text-lg font-black text-text-main mb-8 uppercase tracking-widest border-b border-card-border pb-4">
            Thông tin nhanh
          </h3>

          <div className="space-y-6 mb-10">
            {infoItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div
                  className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 ${item.color}`}
                >
                  {React.cloneElement(item.icon, { size: 22 })}
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="font-bold text-text-main text-[15px] leading-none">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-[#00c853] hover:bg-[#00b04a] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 active:scale-95 flex items-center justify-center gap-3"
            >
              <HiPaperAirplane className="text-xl -rotate-45" /> Ứng tuyển ngay
            </button>
            <button className="w-full bg-background border border-card-border text-text-main hover:border-[#00c853] py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3">
              <FiBookmark size={20} /> Lưu việc làm
            </button>
          </div>
        </div>

        {/* CÔNG TY */}
        <div className="bg-card-bg rounded-[32px] p-8 border border-card-border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl border border-card-border overflow-hidden bg-background relative shrink-0">
              <Image
                src={data.logo || "/globe.svg"}
                alt="Logo"
                fill
                className="object-cover p-2"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-text-main text-[16px] truncate uppercase tracking-tight">
                {data.company}
              </h4>
              <Link
                href="#"
                className="text-xs font-bold text-[#00c853] hover:underline"
              >
                Xem trang công ty
              </Link>
            </div>
          </div>
          <p className="text-[13px] text-text-muted leading-relaxed mb-6 font-medium">
            Chúng tôi tiên phong trong công nghệ môi trường...
          </p>
          <div className="pt-6 border-t border-card-border space-y-3">
            <div className="flex justify-between text-[12px] font-bold">
              <span className="text-text-muted">QUY MÔ</span>
              <span className="text-text-main">{data.companySize}</span>
            </div>
            <div className="flex justify-between text-[12px] font-bold">
              <span className="text-text-muted">WEBSITE</span>
              <Link href="#" className="text-blue-500 hover:underline">
                {data.website}
              </Link>
            </div>
          </div>
        </div>
      </aside>
      {showApplyModal && (
        <ApplyModal job={data} onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

export default JobSidebar;
