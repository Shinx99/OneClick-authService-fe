"use client";
import React, { useEffect, useState } from "react";
import { FiShield, FiArrowRight, FiLock, FiClock, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSetupPopup } from "@/context/SetupPopupContext";
import { companyService } from "@/services/company.service";

/**
 * Trạng thái công ty của recruiter — fetch live từ BE mỗi lần mount.
 *
 * - "none"      : chưa tạo company   → popup "Yêu cầu xác thực"
 * - "pending"   : đã tạo, chờ admin  → popup "Đang chờ admin duyệt"
 * - "rejected"  : bị admin từ chối   → popup "Bị từ chối"
 * - "active"    : admin đã duyệt     → popup "Đã duyệt" (auto đóng) → mở khoá
 */
const RestrictedWrapper = ({ children }) => {
  const router = useRouter();
  const [companyState, setCompanyState] = useState(null); // null = đang check
  const [showApprovedToast, setShowApprovedToast] = useState(false);

  // Dev override: khi isDevUnlocked = true → ẩn popup để dev test dashboard
  let devContext = null;
  try {
    devContext = useSetupPopup();
  } catch {
    // Nếu không có provider (e.g. ngoài employer layout) thì bỏ qua
  }
  const isDevUnlocked = devContext?.isDevUnlocked ?? false;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchCompanyStatus = async () => {
      const hasCompany = localStorage.getItem("hasCompany") === "1";
      const companyId = localStorage.getItem("companyId");

      if (!hasCompany || !companyId) {
        setCompanyState("none");
        return;
      }

      // Fetch live status từ BE để biết admin đã duyệt chưa
      try {
        const res = await companyService.getCompanyById(companyId);
        const liveStatus = (res?.data?.status || "").toLowerCase();
        const prevStatus = localStorage.getItem("companyStatus");

        // Sync localStorage với status mới nhất
        if (liveStatus) {
          localStorage.setItem("companyStatus", liveStatus);
        }

        // Detect transition pending → active để show toast chúc mừng
        if (prevStatus === "pending" && liveStatus === "active") {
          setShowApprovedToast(true);
        }

        if (liveStatus === "active") setCompanyState("active");
        else if (liveStatus === "rejected") setCompanyState("rejected");
        else setCompanyState("pending");
      } catch (err) {
        // Fallback về localStorage nếu fetch fail
        const cached = (localStorage.getItem("companyStatus") || "pending").toLowerCase();
        if (cached === "active") setCompanyState("active");
        else if (cached === "rejected") setCompanyState("rejected");
        else setCompanyState("pending");
      }
    };

    fetchCompanyStatus();
  }, []);

  // Locked khi: chưa có company / đang pending / bị reject
  const locked =
    !isDevUnlocked &&
    (companyState === "none" ||
      companyState === "pending" ||
      companyState === "rejected");

  return (
    <div className="relative w-full min-h-[65vh] rounded-[2rem] ">
      {/* --- NỘI DUNG (BACKGROUND) --- */}
      <div
        className={`transition-all duration-700 w-full h-full ${
          locked
            ? "opacity-30 grayscale-[40%] pointer-events-none select-none blur-[4px]"
            : "opacity-100 blur-0"
        }`}
      >
        {children}
      </div>

      {/* ============ POPUP: CHƯA CÓ COMPANY ============ */}
      {companyState === "none" && !isDevUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] rounded-[2rem] z-40"></div>

          <div className="relative z-50 bg-card-bg border-2 border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-50"></div>
              <FiLock className="text-3xl text-emerald-500 relative z-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiShield size={14} /> Tính năng giới hạn
            </div>

            <h2 className="text-2xl font-medium text-text-main mb-3">
              Yêu cầu xác thực doanh nghiệp
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-8">
              Để đảm bảo chất lượng nền tảng, bạn cần khai báo thông tin pháp lý
              của doanh nghiệp trước khi có thể đăng tin tuyển dụng và tìm kiếm
              ứng viên.
            </p>

            <button
              onClick={() => router.push("/employer/setup")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 text-[13px] uppercase tracking-widest"
            >
              Vui lòng xác thực ngay <FiArrowRight size={16} />
            </button>

            <button
              onClick={() =>
                toast("Vui lòng xác thực để sử dụng tính năng này !!!", {
                  icon: "🔒",
                })
              }
              className="w-full mt-3 py-3 bg-transparent text-text-muted hover:text-text-main rounded-xl font-medium transition-all text-[13px] uppercase tracking-widest"
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      )}

      {/* ============ POPUP: CHỜ ADMIN DUYỆT ============ */}
      {companyState === "pending" && !isDevUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] rounded-[2rem] z-40"></div>

          <div className="relative z-50 bg-card-bg border-2 border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            {/* Icon đồng hồ cát */}
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-100 dark:border-amber-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping opacity-50"></div>
              <FiClock className="text-3xl text-amber-500 relative z-10" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiClock size={14} /> Đang chờ duyệt
            </div>

            <h2 className="text-2xl font-medium text-text-main mb-3">
              Xác thực công ty thành công!
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-6">
              Hồ sơ công ty của bạn đã được gửi tới Admin OneClick. Chúng tôi sẽ
              xem xét và phản hồi trong vòng{" "}
              <strong className="text-text-main">24 giờ làm việc</strong>. Các
              tính năng sẽ tự động mở khoá ngay khi được duyệt.
            </p>

            <div className="w-full bg-background border-2 border-card-border rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#00c853] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-[12px] font-semibold text-text-main">
                  Gửi hồ sơ công ty
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <FiClock size={12} />
                </div>
                <span className="text-[12px] font-semibold text-text-main">
                  Admin OneClick đang xem xét...
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[12px] font-semibold text-text-muted">
                  Mở khoá tuyển dụng
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                toast("Hệ thống sẽ thông báo ngay khi admin duyệt xong!", {
                  icon: "⏳",
                });
              }}
              className="w-full py-3 bg-background border-2 border-card-border text-text-muted hover:text-text-main rounded-xl font-medium transition-all text-[13px] uppercase tracking-widest"
            >
              Tôi đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* ============ POPUP: BỊ TỪ CHỐI ============ */}
      {companyState === "rejected" && !isDevUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] rounded-[2rem] z-40"></div>

          <div className="relative z-50 bg-card-bg border-2 border-card-border rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FiShield className="text-3xl text-rose-500" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiShield size={14} /> Đã bị từ chối
            </div>

            <h2 className="text-2xl font-medium text-text-main mb-3">
              Hồ sơ công ty bị từ chối
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-8">
              Hồ sơ công ty của bạn không đạt yêu cầu xác thực. Vui lòng liên hệ
              hỗ trợ hoặc tạo lại hồ sơ với thông tin chính xác hơn.
            </p>

            <button
              onClick={() => router.push("/employer/setup")}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2 text-[13px] uppercase tracking-widest"
            >
              Tạo lại hồ sơ <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ============ POPUP: VỪA ĐƯỢC DUYỆT (chúc mừng — auto đóng) ============ */}
      {showApprovedToast && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] rounded-[2rem] z-40"></div>

          <div className="relative z-50 bg-card-bg border-2 border-emerald-200 dark:border-emerald-500/30 rounded-[2.5rem] p-10 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-full flex items-center justify-center shadow-inner">
                <FiCheckCircle className="text-5xl text-emerald-500" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FiCheckCircle size={14} /> Đã được duyệt
            </div>

            <h2 className="text-2xl font-medium text-text-main mb-3">
              🎉 Chúc mừng bạn!
            </h2>
            <p className="text-[14px] text-text-muted leading-relaxed font-normal mb-2">
              Công ty của bạn đã được Admin OneClick phê duyệt thành công!
            </p>
            <p className="text-[13px] text-text-muted font-medium mb-8">
              Bạn có thể bắt đầu đăng tin tuyển dụng và tìm kiếm ứng viên ngay bây
              giờ.
            </p>

            <button
              onClick={() => setShowApprovedToast(false)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 text-[13px] uppercase tracking-widest"
            >
              Bắt đầu ngay <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestrictedWrapper;
