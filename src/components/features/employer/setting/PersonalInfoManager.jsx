"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import toast from "react-hot-toast";

const PersonalInfoManager = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    surname: "Nguyễn Văn",
    name: "A",
    title: "Senior Tech Recruiter",
    phone: "0987 654 321",
    location: "TP. Hồ Chí Minh",
    email: "nva@oneclick.tech",
    cccd: "001095000123",
    isVerified: true,
  });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Đã cập nhật cài đặt tài khoản!");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* SECTION 1: THÔNG TIN CƠ BẢN */}
      <div className="flex flex-col md:flex-row gap-8 pb-8 border-b-2 border-card-border">
        <div className="w-full md:w-1/3">
          <h3 className="text-[15px] font-bold text-text-main">
            Thông tin cá nhân
          </h3>
          <p className="text-[13px] text-text-muted mt-2">
            Sử dụng tên thật để ứng viên dễ dàng nhận diện bạn.
          </p>
        </div>
        <div className="w-full md:w-2/3 bg-card-bg p-6 rounded-3xl border-2 border-card-border shadow-sm space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-bold text-text-muted uppercase mb-2">
                Họ & Tên đệm
              </label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-muted uppercase mb-2">
                Tên
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-text-muted uppercase mb-2">
              Chức danh / Vị trí
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-bold text-text-muted uppercase mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-muted uppercase mb-2">
                Khu vực làm việc
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: BẢO MẬT & ĐỊNH DANH (Read-only) */}
      <div className="flex flex-col md:flex-row gap-8 pb-8">
        <div className="w-full md:w-1/3">
          <h3 className="text-[15px] font-bold text-text-main">
            Bảo mật & Định danh
          </h3>
          <p className="text-[13px] text-text-muted mt-2">
            Các thông tin quan trọng được hệ thống bảo vệ. Vui lòng liên hệ
            Admin nếu muốn thay đổi.
          </p>
        </div>
        <div className="w-full md:w-2/3 bg-card-bg p-6 rounded-3xl border-2 border-card-border shadow-sm space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-text-muted uppercase mb-2 flex items-center gap-2">
              <FaEnvelope /> Email đăng nhập
            </label>
            <input
              type="text"
              disabled
              value={formData.email}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-xl text-[14px] text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-text-muted uppercase mb-2 flex items-center gap-2">
              <FaIdCard /> Căn cước công dân (CCCD)
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={formData.cccd.replace(/\d(?=\d{4})/g, "*")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-xl text-[14px] text-slate-500 cursor-not-allowed"
              />
              {formData.isVerified && (
                <FaCheckCircle
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00c853] text-lg"
                  title="Đã xác thực"
                />
              )}
            </div>
          </div>
          <div className="pt-3">
            <Link
              href="/change-password"
              className="inline-flex items-center gap-2.5 px-3 py-2 -ml-3 text-[13px] font-bold text-text-main hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors group w-fit"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 rounded-md transition-colors">
                <FaLock size={14} />
              </div>
              Đổi mật khẩu tài khoản
              <FaArrowRight className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-8 py-3.5 bg-indigo-600 text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
        >
          {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoManager;
