"use client";
import React from "react";
import { FaPlus, FaSearch, FaArrowRight } from "react-icons/fa";

const OPTIONS = [
  {
    mode: "create",
    icon: <FaPlus size={20} />,
    title: "Tạo công ty mới",
    desc: "Đăng ký mới hồ sơ doanh nghiệp bằng Giấy phép ĐKKD.",
    accent: "indigo",
  },
  {
    mode: "join",
    icon: <FaSearch size={20} />,
    title: "Gia nhập công ty",
    desc: "Tìm theo Mã số thuế hoặc Tên và xin cấp quyền từ Admin.",
    accent: "green",
  },
];

const ACCENTS = {
  indigo: {
    border: "hover:border-indigo-500",
    shadow: "hover:shadow-indigo-500/10",
    iconBg:
      "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-500/20",
    titleHover: "group-hover:text-indigo-600",
    arrowHover: "group-hover:text-indigo-600",
  },
  green: {
    border: "hover:border-[#00c853]",
    shadow: "hover:shadow-green-500/10",
    iconBg:
      "bg-green-50 dark:bg-green-500/10 text-[#00c853] border-green-100 dark:border-green-500/20",
    titleHover: "group-hover:text-[#00c853]",
    arrowHover: "group-hover:text-[#00c853]",
  },
};

export default function SelectFlowScreen({ onSelect }) {
  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col justify-center h-full">
      <h2 className="text-2xl font-medium text-text-main mb-2">
        Bắt đầu với OneClick
      </h2>
      <p className="text-[14px] text-text-muted font-normal mb-8">
        Bạn muốn tạo một công ty mới hay gia nhập vào một công ty đã có sẵn?
      </p>

      <div className="grid grid-cols-1 gap-6">
        {OPTIONS.map((opt) => {
          const a = ACCENTS[opt.accent];
          return (
            <button
              key={opt.mode}
              onClick={() => onSelect(opt.mode)}
              className={`flex items-start gap-5 p-6 bg-background border-2 border-card-border ${a.border} rounded-3xl transition-all text-left group hover:shadow-lg ${a.shadow}`}
            >
              <div
                className={`w-14 h-14 ${a.iconBg} rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform`}
              >
                {opt.icon}
              </div>
              <div className="flex-1">
                <h4
                  className={`text-[16px] font-medium text-text-main mb-1 ${a.titleHover} transition-colors`}
                >
                  {opt.title}
                </h4>
                <p className="text-[13px] text-text-muted font-normal">
                  {opt.desc}
                </p>
              </div>
              <FaArrowRight
                className={`text-text-muted ${a.arrowHover} opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 mt-4`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
