"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaPaperPlane,
  FaCommentDots,
} from "react-icons/fa";
import { companyService } from "@/services/company.service";

const PAGE_SIZE = 10;

export default function JoinCompanyScreen({ onCancel, onSuccess }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceRef = useRef(null);
  const submittingRef = useRef(false); // chặn spam click

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Fetch companies on mount and whenever query/page changes
  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, size: PAGE_SIZE };
      if (debouncedQuery.trim()) {
        params.keyword = debouncedQuery.trim();
      }

      const res = await companyService.getAllCompanies(params);

      if (res.success) {
        const data = res.data;
        setCompanies(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      toast.error("Không thể tải danh sách công ty. Vui lòng thử lại.");
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Submit join request
  const handleSubmit = async () => {
    if (!selectedCompany) {
      toast.error("Vui lòng chọn công ty muốn gia nhập!");
      return;
    }

    // Chặn spam: nếu đang submit → bỏ qua
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi yêu cầu gia nhập...");

    try {
      const res = await companyService.sendJoinRequest(
        selectedCompany.companyId,
        message.trim() || null,
      );

      if (res.success) {
        toast.success(
          res.message || "Gửi yêu cầu gia nhập thành công! Vui lòng chờ duyệt.",
          { id: toastId },
        );
        onSuccess?.({
          companyName: selectedCompany.companyName || selectedCompany.name,
          requestData: res.data,
          flowType: "join",
        });
      } else {
        toast.error(res.message || "Gửi yêu cầu thất bại!", { id: toastId });
      }
    } catch (err) {
      // BE trả lỗi dạng { message: "..." } hoặc { timestamp, status, error, message, path }
      const errData = err?.response?.data;
      let errMsg = errData?.message || errData?.error || "";

      // Nếu BE trả message chung chung → thay bằng message dễ hiểu
      if (
        !errMsg ||
        errMsg.toLowerCase().includes("unexpected error") ||
        errMsg.toLowerCase().includes("contact support") ||
        errMsg.toLowerCase().includes("internal server error")
      ) {
        errMsg = "Bạn đã gửi yêu cầu hoặc đã thuộc một công ty. Vui lòng kiểm tra lại!";
      }

      toast.error(errMsg, { id: toastId });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const getLogoDisplay = (company) => {
    if (company.logoUrl) {
      return (
        <img
          src={company.logoUrl}
          alt={company.companyName || company.name}
          className="w-full h-full object-cover rounded-xl"
        />
      );
    }
    const name = company.companyName || company.name || "?";
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <span className="text-[13px] font-bold text-text-muted">{initials}</span>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
        <h2 className="text-2xl font-medium text-text-main mb-2">
          Chọn công ty để gia nhập
        </h2>
        <p className="text-[14px] text-text-muted font-normal mb-6">
          Chọn công ty bạn muốn gia nhập từ danh sách bên dưới.
        </p>

        {/* Search filter */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên công ty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-background border-2 border-card-border rounded-2xl text-[14px] font-medium text-text-main focus:border-[#00c853] outline-none transition-colors shadow-sm"
          />
          {isLoading && (
            <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00c853] animate-spin" />
          )}
        </div>

        {/* Company list */}
        <div className="space-y-2.5 mb-5">
          {isLoading && companies.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="text-2xl text-[#00c853] animate-spin mr-3" />
              <span className="text-[14px] text-text-muted">
                Đang tải danh sách...
              </span>
            </div>
          )}

          {!isLoading && companies.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <FaBuilding className="text-2xl text-slate-400" />
              </div>
              <p className="text-[14px] text-text-muted font-medium">
                Không tìm thấy công ty nào
              </p>
              <p className="text-[12px] text-text-muted mt-1">
                Thử tìm kiếm với từ khoá khác
              </p>
            </div>
          )}

          {companies.map((company) => {
            const active = selectedCompany?.companyId === company.companyId;
            const companyName = company.companyName || company.name;
            return (
              <div
                key={company.companyId}
                onClick={() => setSelectedCompany(company)}
                className={`flex items-center gap-4 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  active
                    ? "border-[#00c853] bg-green-50/50 dark:bg-green-500/10 shadow-sm shadow-green-500/10"
                    : "border-card-border bg-background hover:border-[#00c853]/50 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-card-bg border-2 border-card-border flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                  {getLogoDisplay(company)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-medium text-text-main truncate">
                    {companyName}
                  </h4>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-0.5 truncate">
                    {[company.industry, company.sizeRange]
                      .filter(Boolean)
                      .join(" • ") || "Công ty"}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-6">
            <span className="text-[12px] text-text-muted">
              Trang {page + 1} / {totalPages} — {totalElements} công ty
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="w-9 h-9 rounded-xl border-2 border-card-border bg-background flex items-center justify-center text-text-muted hover:border-[#00c853] hover:text-[#00c853] transition-colors disabled:opacity-40 disabled:hover:border-card-border disabled:hover:text-text-muted"
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="w-9 h-9 rounded-xl border-2 border-card-border bg-background flex items-center justify-center text-text-muted hover:border-[#00c853] hover:text-[#00c853] transition-colors disabled:opacity-40 disabled:hover:border-card-border disabled:hover:text-text-muted"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Message (shown after selecting a company) */}
        {selectedCompany && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-50/30 dark:bg-green-500/5 border-2 border-green-100 dark:border-green-500/20 rounded-[20px] p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FaCommentDots className="text-[#00c853]" size={14} />
                <label className="text-[11px] font-medium text-text-muted uppercase tracking-widest">
                  Lời nhắn gửi công ty (tuỳ chọn)
                </label>
              </div>
              <textarea
                rows="2"
                placeholder="VD: Tôi muốn gia nhập công ty với vai trò HR..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] font-medium text-text-main focus:border-[#00c853] outline-none transition-colors resize-none"
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50/60 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl">
              <span className="text-amber-600 text-[12px]">ℹ️</span>
              <p className="text-[12px] text-amber-700 dark:text-amber-400">
                Yêu cầu sẽ được gửi tới Owner của{" "}
                <strong>
                  {selectedCompany.companyName || selectedCompany.name}
                </strong>{" "}
                để phê duyệt.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 md:px-12 md:py-6 border-t-2 border-card-border bg-card-bg flex items-center justify-between gap-4 shrink-0">
        <button
          onClick={() => {
            setSelectedCompany(null);
            setMessage("");
            onCancel?.();
          }}
          className="px-8 py-3.5 bg-background border-2 border-card-border text-text-main text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-slate-50 transition-all active:scale-95"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedCompany || isSubmitting}
          className="px-8 py-3.5 bg-[#00c853] text-white text-[13px] uppercase tracking-widest font-medium rounded-xl hover:bg-[#00b04a] transition-all active:scale-95 shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" size={12} />
              Đang xử lý...
            </>
          ) : (
            <>
              <FaPaperPlane size={12} />
              Gửi yêu cầu gia nhập
            </>
          )}
        </button>
      </div>
    </div>
  );
}
