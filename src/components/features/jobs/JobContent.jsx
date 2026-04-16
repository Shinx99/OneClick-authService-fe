"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import {
  FiClock,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiEye,
  FiTag,
  FiBookOpen,
  FiStar,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiBookmark,
} from "react-icons/fi";
import {
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiPaperAirplane,
  HiOutlineShieldCheck,
  HiOutlineComputerDesktop,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { toast } from "react-hot-toast"; 
import ApplyModal from "./ApplyModal";
import AIMatchButton from "./AIMatchButton";
import { useAuth } from "@/context/AuthContext"; 

// Fallback avatar
const FALLBACK_LOGO =
  "https://ui-avatars.com/api/?name=C&background=E8F5E9&color=2E7D32&size=128";

// Labels
const LEVEL_LABELS = {
  intern: "Thực tập sinh",
  fresher: "Fresher",
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
  lead: "Lead",
  manager: "Manager",
  director: "Director",
};

const JOB_TYPE_LABELS = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  remote: "Từ xa",
  freelance: "Freelance",
  contract: "Hợp đồng",
  hybrid: "Hybrid",
  internship: "Thực tập",
};

const STATUS_CONFIG = {
  active: { text: "Đang tuyển", bg: "bg-emerald-500/10", color: "text-emerald-500", border: "border-emerald-500/20" },
  pending: { text: "Chờ duyệt", bg: "bg-yellow-500/10", color: "text-yellow-500", border: "border-yellow-500/20" },
  closed: { text: "Đã đóng", bg: "bg-gray-500/10", color: "text-gray-500", border: "border-gray-500/20" },
};

// Helpers
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diffDays = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "1 ngày trước";
  if (diffDays < 30) return `${diffDays} ngày trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
};

const formatVND = (value) => {
  if (value == null) return null;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
};

const formatSalaryRange = (min, max) => {
  const fMin = formatVND(min);
  const fMax = formatVND(max);
  if (fMin && fMax) return `${fMin} - ${fMax}`;
  if (fMin) return `Từ ${fMin}`;
  if (fMax) return `Tới ${fMax}`;
  return "Thỏa thuận";
};

const formatLocation = (province, commune) => {
  if (province && commune) return `${commune}, ${province}`;
  if (province) return province;
  return "Việt Nam";
};

const formatDeadline = (dateStr) => {
  if (!dateStr) return "Không giới hạn";
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const isDeadlinePassed = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

const JobContent = ({ data }) => {
  const router = useRouter();  
  const { isAuthenticated, user } = useAuth();  
  const [showApplyModal, setShowApplyModal] = useState(false);

  // DEBUG: Log thông tin user và role
  React.useEffect(() => {
    console.log("========== DEBUG AUTH INFO ==========");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("Full user object:", user);
    console.log("user?.role:", user?.role);
    console.log("user?.roles:", user?.roles);  // Có thể role là mảng
    console.log("user?.user?.role:", user?.user?.role); // Nếu role nested
    console.log("typeof user?.role:", typeof user?.role);
    console.log("====================================");
  }, [isAuthenticated, user]);

  const statusInfo = STATUS_CONFIG[data.status?.toLowerCase()] || STATUS_CONFIG.active;
  const companyLogo = data.companyLogoUrl || FALLBACK_LOGO;
  const companyName = data.companyName || "Công ty ẩn danh";
  const deadlinePassed = isDeadlinePassed(data.applicationDeadline);

  /**
   * Xử lý khi click nút "Ứng tuyển ngay"
   * Kiểm tra đăng nhập và role trước khi mở modal
   */
  const handleApplyClick = () => {
    // 1. Kiểm tra đã đăng nhập chưa
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để ứng tuyển việc làm", {
        duration: 3000,
        position: "top-center",
      });
      
      // Lưu lại URL hiện tại để sau khi login quay lại
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      
      // Chuyển hướng đến trang login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }

    // 2. Kiểm tra role có phải candidate không
    const isCandidate = user?.roles?.includes('candidate') || user?.roles?.includes('ROLE_candidate');

    if (!isCandidate) {
      toast.error("Chỉ ứng viên mới có thể ứng tuyển việc làm", {
        duration: 3000,
        position: "top-center",
      });
      
      // Nếu là employer, chuyển hướng về trang chủ hoặc register candidate
      if (user?.roles === "recruiter") {
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
      return;
    }

    // 3. Kiểm tra job đã hết hạn chưa
    if (deadlinePassed) {
      toast.error("Công việc này đã hết hạn ứng tuyển", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    // 4. Tất cả OK, mở modal ứng tuyển
    setShowApplyModal(true);
  };

  // const handleApplySuccess = () => {
  //   setShowApplyModal(false);
  //   toast.success("Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.");
  // };

  // Thông tin nhanh items
  const quickInfoItems = [
    {
      icon: <HiOutlineCurrencyDollar size={18} />,
      label: "Mức lương",
      value: formatSalaryRange(data.salaryMin, data.salaryMax),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: <FiMapPin size={18} />,
      label: "Địa điểm",
      value: formatLocation(data.province, data.commune),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: <FiBriefcase size={18} />,
      label: "Hình thức",
      value: JOB_TYPE_LABELS[data.jobType?.toLowerCase()] || data.jobType || "N/A",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      icon: <HiOutlineAcademicCap size={18} />,
      label: "Cấp bậc",
      value: LEVEL_LABELS[data.level?.toLowerCase()] || data.level || "N/A",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: <FiClock size={18} />,
      label: "Kinh nghiệm",
      value:
        data.experienceMinYear != null
          ? data.experienceMinYear === 0
            ? "Không yêu cầu"
            : `Ít nhất ${data.experienceMinYear} năm`
          : "Không yêu cầu",
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      icon: <FiCalendar size={18} />,
      label: "Hạn nộp",
      value: formatDeadline(data.applicationDeadline),
      color: deadlinePassed ? "text-red-500" : "text-amber-500",
      bg: deadlinePassed ? "bg-red-500/10" : "bg-amber-500/10",
      extra: deadlinePassed ? " (Đã hết hạn)" : null,
    },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ==========================================
            LEFT COLUMN: Job Information
        ========================================== */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* 1. HEADER: Logo + Title + Meta + Actions */}
          <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border">
            {/* Top: Logo + Title + Status */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-20 h-20 md:w-[88px] md:h-[88px] shrink-0 rounded-2xl border-2 border-card-border overflow-hidden relative bg-background flex items-center justify-center">
                <Image
                  src={companyLogo}
                  alt={`Logo ${companyName}`}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Title + Company + Meta */}
              <div className="flex-1 min-w-0">
                <h1 className="text-[22px] md:text-[26px] font-bold text-text-main leading-tight mb-2 line-clamp-2">
                  {data.title}
                </h1>

                {/* Company name + Status badge */}
                <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                  {data.companyId ? (
                    <Link href={`/companies/${data.companyId}`} className="text-[15px] font-bold text-[#00c853] hover:underline">
                      {companyName}
                    </Link>
                  ) : (
                    <span className="text-[15px] font-bold text-[#00c853]">{companyName}</span>
                  )}
                  <span className="w-1 h-1 rounded-full bg-text-muted/40 shrink-0" />
                  <span className={`${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wider`}>
                    {statusInfo.text}
                  </span>
                </div>

                {/* Meta: thời gian, ứng viên, lượt xem */}
                <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-muted font-medium">
                  <span className="flex items-center gap-1.5">
                    <FiClock size={14} className="opacity-60" /> {formatTimeAgo(data.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiUsers size={14} className="opacity-60" /> {data.applicationCount ?? 0} ứng viên
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiEye size={14} className="opacity-60" /> {data.viewCount ?? 0} lượt xem
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info Grid — chỉ hiện trên mobile (lg trở xuống) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 lg:hidden">
              {quickInfoItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-background rounded-2xl p-3 border border-card-border">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider leading-none mb-1">
                      {item.label}
                    </p>
                    <p className={`text-[13px] font-bold text-text-main leading-tight truncate ${item.extra ? "text-red-500" : ""}`}>
                      {item.value}{item.extra}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons — nằm cuối card header */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                // onClick={() => !deadlinePassed && setShowApplyModal(true)}
                onClick={handleApplyClick}
                disabled={deadlinePassed}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  deadlinePassed
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#00c853] hover:bg-[#00b04a] text-white shadow-lg shadow-green-500/20"
                }`}
              >
                <HiPaperAirplane className="text-lg -rotate-45" />
                {deadlinePassed ? "Đã hết hạn ứng tuyển" : "Ứng tuyển ngay"}
              </button>
              <button className="sm:w-auto px-6 py-3.5 bg-background border-2 border-card-border text-text-main hover:border-[#00c853] rounded-2xl font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <FiBookmark size={18} /> Lưu việc làm
              </button>
            </div>
          </div>

          {/* 2. MÔ TẢ CÔNG VIỆC */}
          <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border">
            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-500 text-xl" /> Mô tả công việc
            </h2>
            <div
              className="text-text-muted text-[15px] leading-relaxed space-y-3 prose prose-sm max-w-none
                         prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2 prose-ul:marker:text-text-muted
                         prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-2
                         prose-p:mb-3 prose-a:text-blue-500 prose-a:underline"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>

          {/* 3. YÊU CẦU ỨNG VIÊN */}
          <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border">
            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-blue-500 text-xl" /> Yêu cầu ứng viên
            </h2>
            <div
              className="text-text-muted text-[15px] leading-relaxed space-y-3 prose prose-sm max-w-none
                         prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2 prose-ul:marker:text-text-muted
                         prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-2
                         prose-p:mb-3 prose-a:text-blue-500 prose-a:underline"
              dangerouslySetInnerHTML={{ __html: data.requirement }}
            />
          </div>

          {/* 4. CHUYÊN NGÀNH ƯU TIÊN */}
          {data.majorPreferred && (
            <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border">
              <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <FiBookOpen className="text-blue-500 text-xl" /> Chuyên ngành ưu tiên
              </h2>
              <p className="text-text-muted text-[15px] leading-relaxed">
                {data.majorPreferred}
              </p>
            </div>
          )}

          {/* 5. KỸ NĂNG YÊU CẦU */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border">
              <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <FiTag className="text-blue-500 text-xl" /> Kỹ năng yêu cầu
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill.skillId}
                    className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[13px] font-semibold px-4 py-2 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. QUYỀN LỢI */}
          <div className="bg-card-bg rounded-[24px] p-6 md:p-8 border-2 border-card-border">
            <h2 className="text-lg font-bold text-text-main mb-5 flex items-center gap-2">
              <FiStar className="text-blue-500 text-xl" /> Quyền lợi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: <HiOutlineCurrencyDollar className="text-blue-500 text-xl" />, title: "Mức lương cạnh tranh", desc: "Lên đến $4000/tháng + Thưởng hiệu suất năm." },
                { icon: <HiOutlineShieldCheck className="text-blue-500 text-xl" />, title: "Bảo hiểm toàn diện", desc: "Bảo hiểm sức khỏe cao cấp cho bạn và gia đình." },
                { icon: <HiOutlineComputerDesktop className="text-blue-500 text-xl" />, title: "Thiết bị làm việc", desc: "Cung cấp MacBook Pro mới nhất và màn hình 4K." },
                { icon: <HiOutlineGlobeAlt className="text-blue-500 text-xl" />, title: "Du lịch & Team building", desc: "Chuyến đi công ty hàng năm và các hoạt động nhóm." },
              ].map((item, idx) => (
                <div key={idx} className="bg-background p-4 rounded-2xl border border-card-border hover:border-blue-200 transition-colors group flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main text-[14px] mb-0.5">{item.title}</h4>
                    <p className="text-[13px] text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDEBAR: Quick Info + Actions (sticky, ẩn trên mobile)
        ========================================== */}
        <div className="hidden lg:block w-[340px] shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Quick Info Card */}
            <div className="bg-card-bg rounded-[24px] p-6 border-2 border-card-border">
              <h3 className="text-[15px] font-bold text-text-main mb-4">Thông tin chung</h3>
              <div className="space-y-4">
                {quickInfoItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider leading-none mb-1">
                        {item.label}
                      </p>
                      <p className={`text-[13px] font-bold text-text-main leading-tight ${item.extra ? "text-red-500" : ""}`}>
                        {item.value}{item.extra}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Phân tích hồ sơ */}
            <AIMatchButton jobId={data.jobId} jobTitle={data.title} />

            {/* Company Card nhỏ */}
            <div className="bg-card-bg rounded-[24px] p-5 border-2 border-card-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 shrink-0 rounded-xl border-2 border-card-border overflow-hidden relative bg-background flex items-center justify-center">
                  <Image
                    src={companyLogo}
                    alt={`Logo ${companyName}`}
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text-main truncate">{companyName}</p>
                  <p className="text-[11px] text-text-muted">
                    {formatLocation(data.province, data.commune)}
                  </p>
                </div>
              </div>
              {data.companyId && (
                <Link
                  href={`/companies/${data.companyId}`}
                  className="block text-center text-[13px] font-bold text-[#00c853] hover:underline py-2 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                >
                  Xem trang công ty
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={{ id: data.jobId, company: companyName, title: data.title }}
          onClose={() => setShowApplyModal(false)}
          //onSuccess={handleApplySuccess}
        />
      )}
    </>
  );
};

export default JobContent;
