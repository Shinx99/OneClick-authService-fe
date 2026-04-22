"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSearch, FaUserShield, FaUserEdit } from "react-icons/fa";

// Mock data — sau này thay bằng API search company của BE
const EXISTING_COMPANIES = [
  {
    id: 1,
    name: "FPT Software",
    logo: "FS",
    domain: "fpt-software.com",
    employees: "30000+",
  },
  {
    id: 2,
    name: "VNG Corporation",
    logo: "VNG",
    domain: "vng.com.vn",
    employees: "8000+",
  },
];

const ROLE_CARDS = [
  {
    key: "level1",
    icon: <FaUserShield size={16} />,
    title: "HR Tổng (Level 1)",
    body: (
      <>
        Quản trị toàn bộ hồ sơ công ty và quản lý các HR cấp dưới.{" "}
        <strong className="text-amber-600 font-medium">
          Yêu cầu Admin OneClick duyệt.
        </strong>
      </>
    ),
  },
  {
    key: "level2",
    icon: <FaUserEdit size={16} />,
    title: "HR Phụ (Level > 1)",
    body: (
      <>
        Chuyên viên tuyển dụng, được phép đăng tin và lọc hồ sơ.{" "}
        <strong className="text-[#00c853] font-medium">
          Yêu cầu HR Tổng của công ty duyệt.
        </strong>
      </>
    ),
  },
];

export default function JoinCompanyScreen({ onCancel }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedJoinRole, setSelectedJoinRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!selectedCompanyId) {
      toast.error("Vui lòng chọn công ty muốn gia nhập!");
      return;
    }
    if (!selectedJoinRole) {
      toast.error("Vui lòng chọn vai trò của bạn trong công ty!");
      return;
    }

    setIsLoading(true);
    toast.loading("Đang gửi yêu cầu gia nhập...", { id: "setup" });

    setTimeout(() => {
      setIsLoading(false);
      const msg =
        selectedJoinRole === "level1"
          ? "Đã gửi yêu cầu HR Tổng. Chờ Hệ thống OneClick duyệt!"
          : "Đã gửi yêu cầu HR Phụ. Chờ HR Tổng của công ty duyệt!";
      toast.success(msg, { id: "setup" });
      router.push("/employer/dashboard");
    }, 2000);
  };

  const filteredCompanies = EXISTING_COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="flex-1">
        <h2 className="text-2xl font-medium text-text-main mb-2">
          Tìm kiếm công ty
        </h2>
        <p className="text-[14px] text-text-muted font-normal mb-6">
          Nhập tên hoặc mã số thuế để tìm kiếm công ty bạn muốn gia nhập.
        </p>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="VD: FPT Software hoặc 0100109106"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-background border-2 border-card-border rounded-2xl text-[14px] font-medium text-text-main focus:border-[#00c853] outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2 mb-8">
          {filteredCompanies.map((company) => {
            const active = selectedCompanyId === company.id;
            return (
              <div
                key={company.id}
                onClick={() => setSelectedCompanyId(company.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  active
                    ? "border-[#00c853] bg-green-50/50 dark:bg-green-500/10"
                    : "border-card-border bg-background hover:border-[#00c853]/50"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-card-bg border-2 border-card-border flex items-center justify-center font-bold text-text-muted shadow-sm">
                  {company.logo}
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-medium text-text-main">
                    {company.name}
                  </h4>
                  <p className="text-[11px] text-text-muted font-medium uppercase tracking-widest mt-1">
                    {company.domain} • Quy mô {company.employees}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    active
                      ? "border-[#00c853] bg-[#00c853]"
                      : "border-card-border"
                  }`}
                >
                  {active && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCompanyId && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-widest mb-3">
              Vai trò của bạn tại công ty *
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROLE_CARDS.map((card) => {
                const active = selectedJoinRole === card.key;
                return (
                  <div
                    key={card.key}
                    onClick={() => setSelectedJoinRole(card.key)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${
                      active
                        ? "border-[#00c853] bg-green-50/30 dark:bg-green-500/10 shadow-sm"
                        : "border-card-border bg-background hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          active
                            ? "bg-[#00c853] text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {card.icon}
                      </div>
                      <h4 className="text-[14px] font-bold text-text-main">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-[12px] text-text-muted font-normal leading-relaxed mt-1">
                      {card.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t-2 border-card-border mt-8 flex justify-between shrink-0">
        <button
          onClick={() => {
            setSelectedJoinRole(null);
            setSelectedCompanyId(null);
            onCancel?.();
          }}
          className="px-8 py-3.5 bg-background border-2 border-card-border text-text-main text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-slate-50 transition-all active:scale-95"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedCompanyId || !selectedJoinRole || isLoading}
          className="px-8 py-3.5 bg-[#00c853] text-white text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-[#00b04a] transition-all active:scale-95 shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? "Đang xử lý..." : "Gửi yêu cầu gia nhập"}
        </button>
      </div>
    </div>
  );
}
