"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaBuilding,
  FaIdCard,
  FaUsers,
  FaUpload,
  FaCheckCircle,
  FaFilePdf,
  FaTimes,
  FaPlus,
  FaSearch,
  FaArrowRight,
  FaGlobe,
  FaMapMarkerAlt,
  FaImage,
  FaUserTie,
  FaIndustry,
  FaInfoCircle,
  FaUserShield,
  FaUserEdit,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function SetupBusinessPage() {
  const router = useRouter();

  // flowMode: 'select' (Cổng chọn) | 'create' (Tạo mới) | 'join' (Gia nhập)
  const [flowMode, setFlowMode] = useState("select");
  const [isLoading, setIsLoading] = useState(false);

  // ================= MAPPING VỚI DATABASE (Bảng 'company') =================
  const [formData, setFormData] = useState({
    company_name: "",
    tax_code: "",
    business_rep_name: "",
    industry: "IT Services",
    size_range: "1-50",
    province_code: "SGP",
    address: "",
    website_url: "",
    overview: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const logoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // ================= STATE CHO LUỒNG GIA NHẬP =================
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // NEW: State lưu vai trò khi gia nhập (level1: HR Tổng, level2: HR Phụ)
  const [selectedJoinRole, setSelectedJoinRole] = useState(null);

  const existingCompanies = [
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

  // ================= HÀM XỬ LÝ =================
  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (type === "logo" && file.type.includes("image/")) {
      setLogoFile(file);
    } else if (type === "doc") {
      setDocFile(file);
    } else {
      toast.error("Định dạng file không hợp lệ!");
    }
  };

  const handleCreateSubmit = () => {
    if (
      !formData.company_name ||
      !formData.tax_code ||
      !formData.size_range ||
      !formData.overview ||
      !docFile
    ) {
      toast.error(
        "Vui lòng điền đủ thông tin và tải lên Giấy phép kinh doanh!",
      );
      return;
    }
    setIsLoading(true);
    toast.loading("Đang khởi tạo hồ sơ doanh nghiệp...", { id: "setup" });
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Tạo công ty thành công! Vui lòng chờ Admin duyệt.", {
        id: "setup",
      });
      router.push("/employer/dashboard");
    }, 2000);
  };

  const handleJoinSubmit = () => {
    if (!selectedCompanyId) {
      toast.error("Vui lòng chọn công ty muốn gia nhập!");
      return;
    }
    // Đảm bảo user phải chọn role
    if (!selectedJoinRole) {
      toast.error("Vui lòng chọn vai trò của bạn trong công ty!");
      return;
    }

    setIsLoading(true);
    toast.loading("Đang gửi yêu cầu gia nhập...", { id: "setup" });

    setTimeout(() => {
      setIsLoading(false);
      if (selectedJoinRole === "level1") {
        toast.success("Đã gửi yêu cầu HR Tổng. Chờ Hệ thống OneClick duyệt!", {
          id: "setup",
        });
      } else {
        toast.success("Đã gửi yêu cầu HR Phụ. Chờ HR Tổng của công ty duyệt!", {
          id: "setup",
        });
      }
      router.push("/employer/dashboard");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-indigo-600 rounded-b-[4rem] z-0"></div>

      <div className="w-full max-w-5xl bg-card-bg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border-2 border-card-border flex flex-col md:flex-row h-full min-h-[600px] max-h-[850px]">
        {/* --- CỘT TRÁI: SIDEBAR --- */}
        <div className="hidden md:flex w-full md:w-[30%] bg-background p-8 border-r-2 border-card-border flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg border-2 border-indigo-200 dark:border-indigo-500/30">
              OC
            </div>
            <span className="font-medium text-text-main text-lg tracking-tight">
              OneClick
            </span>
          </div>

          <div>
            <h3 className="font-medium text-text-main text-[16px] mb-2">
              {flowMode === "select"
                ? "Khởi tạo không gian"
                : flowMode === "create"
                  ? "Tạo công ty mới"
                  : "Gia nhập tổ chức"}
            </h3>
            <p className="text-[13px] text-text-muted font-normal leading-relaxed">
              {flowMode === "create"
                ? "Điền đầy đủ thông tin pháp lý và hình ảnh nhận diện để hoàn tất hồ sơ công ty của bạn trên hệ thống."
                : flowMode === "join"
                  ? "Yêu cầu của bạn sẽ được gửi tới Admin Hệ thống hoặc HR Tổng của công ty để phê duyệt tùy theo vai trò bạn chọn."
                  : "Chọn tạo mới nếu công ty bạn chưa có trên hệ thống, hoặc xin gia nhập nếu đồng nghiệp của bạn đã tạo trước đó."}
            </p>
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={() =>
                flowMode !== "select"
                  ? setFlowMode("select")
                  : router.push("/employer/dashboard")
              }
              className="text-[12px] text-text-muted hover:text-text-main uppercase tracking-widest font-medium transition-colors"
            >
              ← {flowMode !== "select" ? "Quay lại lựa chọn" : "Về Dashboard"}
            </button>
          </div>
        </div>

        {/* --- CỘT PHẢI: NỘI DUNG CHÍNH --- */}
        <div className="w-full md:w-[70%] bg-card-bg flex flex-col h-full overflow-hidden">
          {/* ================= MÀN HÌNH 1: CỔNG LỰA CHỌN ================= */}
          {flowMode === "select" && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col justify-center h-full">
              <h2 className="text-2xl font-medium text-text-main mb-2">
                Bắt đầu với OneClick
              </h2>
              <p className="text-[14px] text-text-muted font-normal mb-8">
                Bạn muốn tạo một công ty mới hay gia nhập vào một công ty đã có
                sẵn?
              </p>

              <div className="grid grid-cols-1 gap-6">
                <button
                  onClick={() => setFlowMode("create")}
                  className="flex items-start gap-5 p-6 bg-background border-2 border-card-border hover:border-indigo-500 rounded-3xl transition-all text-left group hover:shadow-lg hover:shadow-indigo-500/10"
                >
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <FaPlus size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[16px] font-medium text-text-main mb-1 group-hover:text-indigo-600 transition-colors">
                      Tạo công ty mới
                    </h4>
                    <p className="text-[13px] text-text-muted font-normal">
                      Đăng ký mới hồ sơ doanh nghiệp bằng Giấy phép ĐKKD.
                    </p>
                  </div>
                  <FaArrowRight className="text-text-muted group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 mt-4" />
                </button>

                <button
                  onClick={() => setFlowMode("join")}
                  className="flex items-start gap-5 p-6 bg-background border-2 border-card-border hover:border-[#00c853] rounded-3xl transition-all text-left group hover:shadow-lg hover:shadow-green-500/10"
                >
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 text-[#00c853] rounded-2xl flex items-center justify-center shrink-0 border border-green-100 dark:border-green-500/20 group-hover:scale-110 transition-transform">
                    <FaSearch size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[16px] font-medium text-text-main mb-1 group-hover:text-[#00c853] transition-colors">
                      Gia nhập công ty
                    </h4>
                    <p className="text-[13px] text-text-muted font-normal">
                      Tìm theo Mã số thuế hoặc Tên và xin cấp quyền từ Admin.
                    </p>
                  </div>
                  <FaArrowRight className="text-text-muted group-hover:text-[#00c853] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 mt-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= MÀN HÌNH 2: GIA NHẬP (JOIN) ================= */}
          {flowMode === "join" && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full overflow-y-auto custom-scrollbar">
              <div className="flex-1">
                <h2 className="text-2xl font-medium text-text-main mb-2">
                  Tìm kiếm công ty
                </h2>
                <p className="text-[14px] text-text-muted font-normal mb-6">
                  Nhập tên hoặc mã số thuế để tìm kiếm công ty bạn muốn gia
                  nhập.
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

                {/* Danh sách kết quả (Giảm max-h để nhường chỗ cho Chọn Role) */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2 mb-8">
                  {existingCompanies
                    .filter((c) =>
                      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((company) => (
                      <div
                        key={company.id}
                        onClick={() => setSelectedCompanyId(company.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedCompanyId === company.id
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
                            selectedCompanyId === company.id
                              ? "border-[#00c853] bg-[#00c853]"
                              : "border-card-border"
                          }`}
                        >
                          {selectedCompanyId === company.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* ================= KHU VỰC CHỌN ROLE (HR TỔNG / HR PHỤ) ================= */}
                {selectedCompanyId && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-widest mb-3">
                      Vai trò của bạn tại công ty *
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Card HR Tổng (Level 1) */}
                      <div
                        onClick={() => setSelectedJoinRole("level1")}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${
                          selectedJoinRole === "level1"
                            ? "border-[#00c853] bg-green-50/30 dark:bg-green-500/10 shadow-sm"
                            : "border-card-border bg-background hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedJoinRole === "level1" ? "bg-[#00c853] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                          >
                            <FaUserShield size={16} />
                          </div>
                          <h4 className="text-[14px] font-bold text-text-main">
                            HR Tổng (Level 1)
                          </h4>
                        </div>
                        <p className="text-[12px] text-text-muted font-normal leading-relaxed mt-1">
                          Quản trị toàn bộ hồ sơ công ty và quản lý các HR cấp
                          dưới.{" "}
                          <strong className="text-amber-600 font-medium">
                            Yêu cầu Admin OneClick duyệt.
                          </strong>
                        </p>
                      </div>

                      {/* Card HR Phụ (Level 2) */}
                      <div
                        onClick={() => setSelectedJoinRole("level2")}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${
                          selectedJoinRole === "level2"
                            ? "border-[#00c853] bg-green-50/30 dark:bg-green-500/10 shadow-sm"
                            : "border-card-border bg-background hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedJoinRole === "level2" ? "bg-[#00c853] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                          >
                            <FaUserEdit size={16} />
                          </div>
                          <h4 className="text-[14px] font-bold text-text-main">
                            HR Phụ (Level &gt; 1)
                          </h4>
                        </div>
                        <p className="text-[12px] text-text-muted font-normal leading-relaxed mt-1">
                          Chuyên viên tuyển dụng, được phép đăng tin và lọc hồ
                          sơ.{" "}
                          <strong className="text-[#00c853] font-medium">
                            Yêu cầu HR Tổng của công ty duyệt.
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t-2 border-card-border mt-8 flex justify-between shrink-0">
                <button
                  onClick={() => {
                    setFlowMode("select");
                    setSelectedJoinRole(null);
                    setSelectedCompanyId(null);
                  }}
                  className="px-8 py-3.5 bg-background border-2 border-card-border text-text-main text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Hủy
                </button>
                <button
                  onClick={handleJoinSubmit}
                  disabled={
                    !selectedCompanyId || !selectedJoinRole || isLoading
                  }
                  className="px-8 py-3.5 bg-[#00c853] text-white text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-[#00b04a] transition-all active:scale-95 shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? "Đang xử lý..." : "Gửi yêu cầu gia nhập"}
                </button>
              </div>
            </div>
          )}

          {/* ================= MÀN HÌNH 3: TẠO MỚI (CREATE) ================= */}
          {/* ... (Giữ nguyên phần Code Tạo Mới y hệt như bản trước, mình đã rút gọn để bạn dễ theo dõi, bạn giữ nguyên code cũ của phần Create nhé) ... */}
          {flowMode === "create" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-8">
                <div>
                  <h2 className="text-2xl font-medium text-text-main mb-2">
                    Thông tin pháp lý công ty
                  </h2>
                  <p className="text-[13px] text-text-muted font-normal mb-8">
                    Thông tin này phải khớp hoàn toàn với Giấy phép Đăng ký kinh
                    doanh của bạn.
                  </p>

                  <div className="bg-indigo-50/30 dark:bg-indigo-500/5 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-[20px] p-6 mb-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-medium text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-2">
                          Tên công ty đầy đủ *
                        </label>
                        <div className="relative">
                          <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            placeholder="Công ty Cổ phần..."
                            value={formData.company_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                company_name: e.target.value,
                              })
                            }
                            className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-2">
                          Mã số thuế *
                        </label>
                        <div className="relative">
                          <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            placeholder="Mã số doanh nghiệp"
                            value={formData.tax_code}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tax_code: e.target.value,
                              })
                            }
                            className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-2">
                          Người đại diện pháp luật
                        </label>
                        <div className="relative">
                          <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            placeholder="Họ và tên..."
                            value={formData.business_rep_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                business_rep_name: e.target.value,
                              })
                            }
                            className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Ngành nghề (Industry)
                      </label>
                      <div className="relative">
                        <FaIndustry className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <select
                          value={formData.industry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              industry: e.target.value,
                            })
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                          <option value="IT Services">
                            Công nghệ thông tin
                          </option>
                          <option value="Finance">Tài chính - Ngân hàng</option>
                          <option value="E-commerce">Thương mại điện tử</option>
                          <option value="AI/ML">AI & Machine Learning</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Quy mô (Size) *
                      </label>
                      <div className="relative">
                        <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <select
                          value={formData.size_range}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              size_range: e.target.value,
                            })
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                          <option value="1-50">1-50 nhân viên</option>
                          <option value="51-200">51-200 nhân viên</option>
                          <option value="201-1000">201-1000 nhân viên</option>
                          <option value="1000+">1000+ nhân viên</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Tỉnh/Thành phố
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <select
                          value={formData.province_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              province_code: e.target.value,
                            })
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                          <option value="SGP">TP. Hồ Chí Minh</option>
                          <option value="HN">Hà Nội</option>
                          <option value="DAN">Đà Nẵng</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          placeholder="https://"
                          value={formData.website_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              website_url: e.target.value,
                            })
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Địa chỉ chi tiết
                      </label>
                      <input
                        type="text"
                        placeholder="Số nhà, Phường/Xã, Quận/Huyện..."
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full px-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Giới thiệu tổng quan (Overview) *
                      </label>
                      <div className="relative">
                        <FaInfoCircle className="absolute left-4 top-4 text-text-muted" />
                        <textarea
                          rows="4"
                          placeholder="Giới thiệu ngắn gọn về công ty, sứ mệnh và văn hóa..."
                          value={formData.overview}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              overview: e.target.value,
                            })
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-indigo-500 outline-none transition-colors resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Logo công ty (Tùy chọn)
                      </label>
                      {!logoFile ? (
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, "logo")}
                          onClick={() => logoInputRef.current.click()}
                          className="border-2 border-dashed border-card-border hover:border-indigo-500 bg-background hover:bg-indigo-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                        >
                          <FaImage className="w-8 h-8 mx-auto text-text-muted group-hover:text-indigo-500 mb-3" />
                          <p className="text-[13px] font-medium text-text-main mb-1">
                            Tải lên logo hoặc kéo thả
                          </p>
                          <p className="text-[11px] text-text-muted font-normal">
                            PNG, JPG, JPEG tối đa 5MB
                          </p>
                          <input
                            type="file"
                            ref={logoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files[0])}
                          />
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <FaImage className="text-indigo-500" />
                            </div>
                            <span className="text-[13px] font-medium truncate max-w-[120px]">
                              {logoFile.name}
                            </span>
                          </div>
                          <button
                            onClick={() => setLogoFile(null)}
                            className="text-text-muted hover:text-rose-500 p-1"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">
                        Giấy phép ĐKKD *
                      </label>
                      {!docFile ? (
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, "doc")}
                          onClick={() => docInputRef.current.click()}
                          className="border-2 border-dashed border-card-border hover:border-[#00c853] bg-background hover:bg-green-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                        >
                          <FaFilePdf className="w-8 h-8 mx-auto text-text-muted group-hover:text-[#00c853] mb-3" />
                          <p className="text-[13px] font-medium text-text-main mb-1">
                            Tải lên tài liệu hoặc kéo thả
                          </p>
                          <p className="text-[11px] text-text-muted font-normal">
                            PDF, DOC, DOCX, JPG, PNG (Tối đa 5MB)
                          </p>
                          <input
                            type="file"
                            ref={docInputRef}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={(e) => setDocFile(e.target.files[0])}
                          />
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-[#00c853] bg-green-50/50 dark:bg-green-500/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-rose-500">
                              <FaFilePdf />
                            </div>
                            <span className="text-[13px] font-medium truncate max-w-[120px]">
                              {docFile.name}
                            </span>
                          </div>
                          <button
                            onClick={() => setDocFile(null)}
                            className="text-text-muted hover:text-rose-500 p-1"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:px-12 md:py-6 border-t-2 border-card-border bg-card-bg flex items-center justify-between gap-4">
                <button
                  onClick={() => setFlowMode("select")}
                  className="px-8 py-3.5 bg-background border-2 border-card-border text-text-main text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Hủy
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleCreateSubmit}
                  className="px-8 py-3.5 bg-indigo-600 text-white text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? "Đang xử lý..." : "Gửi hồ sơ duyệt"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
