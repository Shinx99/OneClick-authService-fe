"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  FaRegFilePdf,
  FaEnvelope,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaRegCalendarAlt,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaFilter,
  FaCheck,
  FaTimes, // Giữ lại icon Hủy, đã gỡ bỏ FaTrashAlt
} from "react-icons/fa";
import {
  MdOutlineMoreVert,
  MdKeyboardArrowDown,
  MdClose,
} from "react-icons/md";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  APPLIED: {
    label: "Mới ứng tuyển",
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  },
  INTERVIEW: {
    label: "Phỏng vấn",
    cls: "bg-purple-50 text-purple-600 border-purple-200",
  },
  HIRED: {
    label: "Đã tuyển",
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  REJECTED: {
    label: "Từ chối",
    cls: "bg-rose-50 text-rose-600 border-rose-200",
  },
};

const CandidateTable = ({ candidates, setCandidates }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [matchFilter, setMatchFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [openDropdown, setOpenDropdown] = useState(null);

  const [viewingCv, setViewingCv] = useState(null);

  // === STATE QUẢN LÝ TICK CHỌN HÀNG LOẠT ===
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  // (ĐÃ XÓA useEffect GÂY LỖI Ở ĐÂY)

  // Đóng Modal CV khi bấm phím Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setViewingCv(null);
    };
    if (viewingCv) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingCv]);

  const handleStatusChange = (candidateId, newStatus) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c)),
    );
    toast.success(
      `Đã đổi trạng thái ${candidate.name} thành ${STATUS_CONFIG[newStatus].label}`,
    );
    if (viewingCv && viewingCv.id === candidateId) {
      setViewingCv((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    setCandidates((prev) =>
      prev.map((c) =>
        selectedCandidates.includes(c.id) ? { ...c, status: newStatus } : c,
      ),
    );
    toast.success(
      `Đã đổi trạng thái ${selectedCandidates.length} ứng viên thành ${STATUS_CONFIG[newStatus].label}`,
    );
    setSelectedCandidates([]);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
    setCurrentPage(1);
    setSelectedCandidates([]); // FIX LỖI: Chủ động reset tick chọn
  };

  const processedCandidates = useMemo(() => {
    let result = [...candidates];
    if (statusFilter !== "ALL")
      result = result.filter((c) => c.status === statusFilter);
    if (matchFilter !== "ALL") {
      result = result.filter((c) => {
        if (matchFilter === "HIGH") return c.match >= 80;
        if (matchFilter === "MEDIUM") return c.match >= 50 && c.match < 80;
        if (matchFilter === "LOW") return c.match < 50;
        return true;
      });
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === "date") {
          const parseDate = (dStr) => {
            if (!dStr || dStr === "—") return 0;
            const parts = dStr.split("/");
            if (parts.length === 3)
              return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
            return 0;
          };
          valA = parseDate(valA);
          valB = parseDate(valB);
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [candidates, statusFilter, matchFilter, sortConfig]);

  const totalPages = Math.ceil(processedCandidates.length / itemsPerPage);
  const paginatedCandidates = processedCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const isAllCurrentPageSelected =
    paginatedCandidates.length > 0 &&
    paginatedCandidates.every((c) => selectedCandidates.includes(c.id));

  const handleSelectAll = () => {
    if (isAllCurrentPageSelected) {
      setSelectedCandidates((prev) =>
        prev.filter((id) => !paginatedCandidates.find((c) => c.id === id)),
      );
    } else {
      const newIds = paginatedCandidates
        .map((c) => c.id)
        .filter((id) => !selectedCandidates.includes(id));
      setSelectedCandidates((prev) => [...prev, ...newIds]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey)
      return <FaSort className="text-slate-300 w-3 h-3" />;
    if (sortConfig.direction === "asc")
      return <FaSortUp className="text-emerald-500 w-3 h-3" />;
    return <FaSortDown className="text-emerald-500 w-3 h-3" />;
  };

  const generatePagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* MODAL XEM CV (PDF VIEWER) */}
      {viewingCv && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setViewingCv(null)}
          />

          <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold shrink-0">
                  {viewingCv.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">
                    Hồ sơ ứng viên: {viewingCv.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[13px] text-slate-500 font-medium">
                    <span>Job ứng tuyển: {viewingCv.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Kinh nghiệm cá nhân: {viewingCv.exp}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingCv(null)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                title="Đóng (Esc)"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 p-4 sm:p-6 overflow-hidden">
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                <iframe
                  src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf#toolbar=0&navpanes=0&scrollbar=0"
                  className="w-full h-full"
                  title={`CV của ${viewingCv.name}`}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex items-center justify-between">
              <div className="text-[13px] font-bold text-slate-500">
                Độ phù hợp:{" "}
                <span
                  className={
                    viewingCv.match >= 80
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {viewingCv.match}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStatusChange(viewingCv.id, "REJECTED")}
                  className="px-4 py-2 text-[13px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleStatusChange(viewingCv.id, "INTERVIEW")}
                  className="px-4 py-2 text-[13px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-xl transition-all"
                >
                  Duyệt phỏng vấn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BẢNG CHÍNH */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar min-h-[360px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-md z-20 shadow-sm border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 w-12 text-center align-top pt-[1.125rem]">
                <input
                  type="checkbox"
                  checked={isAllCurrentPageSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider align-top">
                Thông tin ứng viên
              </th>
              <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider align-top">
                Job ứng tuyển & <br></br> Kinh nghiệm cá nhân
              </th>

              <th className="px-4 py-4 align-top w-[160px] relative">
                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === "STATUS" ? null : "STATUS")
                  }
                  className={`flex items-center gap-1.5 w-fit text-[12px] font-bold uppercase tracking-wider cursor-pointer transition-colors select-none ${statusFilter !== "ALL" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Trạng thái{" "}
                  <FaFilter
                    size={10}
                    className={statusFilter !== "ALL" ? "animate-pulse" : ""}
                  />
                </div>
                {openDropdown === "STATUS" && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute top-[3rem] left-4 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                        Lọc theo trạng thái
                      </div>
                      <div
                        onClick={() => {
                          setStatusFilter("ALL");
                          setCurrentPage(1);
                          setSelectedCandidates([]); // FIX LỖI
                          setOpenDropdown(null);
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${statusFilter === "ALL" ? "text-emerald-600 bg-emerald-50" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        <span>Tất cả trạng thái</span>
                        {statusFilter === "ALL" && <FaCheck size={12} />}
                      </div>
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <div
                          key={key}
                          onClick={() => {
                            setStatusFilter(key);
                            setCurrentPage(1);
                            setSelectedCandidates([]); // FIX LỖI
                            setOpenDropdown(null);
                          }}
                          className={`flex items-center justify-between px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${statusFilter === key ? "text-emerald-600 bg-emerald-50" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${config.cls.split(" ")[0]}`}
                            ></div>
                            {config.label}
                          </div>
                          {statusFilter === key && <FaCheck size={12} />}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </th>

              <th className="px-4 py-4 align-top w-[160px] relative">
                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === "MATCH" ? null : "MATCH")
                  }
                  className={`flex items-center gap-1.5 w-fit text-[12px] font-bold uppercase tracking-wider cursor-pointer transition-colors select-none ${matchFilter !== "ALL" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Đánh giá{" "}
                  <FaFilter
                    size={10}
                    className={matchFilter !== "ALL" ? "animate-pulse" : ""}
                  />
                </div>
                {openDropdown === "MATCH" && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute top-[3rem] left-4 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                        Mức độ phù hợp
                      </div>
                      {[
                        { value: "ALL", label: "Mọi mức độ" },
                        {
                          value: "HIGH",
                          label: "≥ 80% (Tốt)",
                          color: "bg-emerald-500",
                        },
                        {
                          value: "MEDIUM",
                          label: "50% - 79% (Khá)",
                          color: "bg-amber-500",
                        },
                        {
                          value: "LOW",
                          label: "< 50% (Kém)",
                          color: "bg-rose-500",
                        },
                      ].map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setMatchFilter(opt.value);
                            setCurrentPage(1);
                            setSelectedCandidates([]); // FIX LỖI
                            setOpenDropdown(null);
                          }}
                          className={`flex items-center justify-between px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${matchFilter === opt.value ? "text-emerald-600 bg-emerald-50" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          <div className="flex items-center gap-2">
                            {opt.color && (
                              <div
                                className={`w-2 h-2 rounded-full ${opt.color}`}
                              ></div>
                            )}
                            {opt.label}
                          </div>
                          {matchFilter === opt.value && <FaCheck size={12} />}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </th>

              <th
                onClick={() => handleSort("date")}
                className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors group select-none align-top whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  Thời gian {getSortIcon("date")}
                </div>
              </th>

              <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right align-top">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {processedCandidates.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-20 text-center text-slate-500 font-medium"
                >
                  Không tìm thấy ứng viên nào phù hợp.
                </td>
              </tr>
            )}

            {paginatedCandidates.map((c) => {
              const isSelected = selectedCandidates.includes(c.id);

              return (
                <tr
                  key={c.id}
                  className={`transition-colors group ${isSelected ? "bg-emerald-50/50 dark:bg-emerald-500/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                >
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(c.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[15px] font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-slate-800 dark:text-white cursor-pointer hover:text-emerald-600 transition-colors truncate">
                          {c.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                          <FaEnvelope size={10} className="shrink-0" />
                          <p className="text-[11px] truncate font-medium">
                            {c.email || "chưa cập nhật"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300 truncate">
                      {c.role}
                    </p>
                    <p className="text-[12px] text-slate-500 mt-0.5">{c.exp}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative w-fit">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(c.id, e.target.value)
                        }
                        className={`appearance-none outline-none pl-3 pr-8 py-1.5 rounded-md text-[11px] font-bold border cursor-pointer transition-colors shadow-sm ${STATUS_CONFIG[c.status]?.cls} hover:opacity-80`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <option
                            key={key}
                            value={key}
                            className="bg-white text-slate-700 font-medium"
                          >
                            {config.label}
                          </option>
                        ))}
                      </select>
                      <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-current opacity-60 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full ${c.match >= 80 ? "bg-emerald-500" : "bg-amber-500"} rounded-full`}
                          style={{ width: `${c.match}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                        {c.match}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <FaRegCalendarAlt
                          className="text-emerald-500 shrink-0"
                          size={12}
                        />
                        <p className="text-[12px] font-bold">
                          Nộp CV:{" "}
                          <span className="font-medium text-slate-500 ml-1">
                            {c.date || "—"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <FaHistory
                          className="text-amber-500 shrink-0"
                          size={12}
                        />
                        <p className="text-[11px] font-medium">
                          Cập nhật:{" "}
                          <span className="text-slate-400 ml-1">
                            {c.time || "—"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setViewingCv(c)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Xem chi tiết CV"
                      >
                        <FaRegFilePdf size={16} />
                      </button>

                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Gửi Email"
                      >
                        <FaEnvelope size={16} />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        title="Thêm"
                      >
                        <MdOutlineMoreVert size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER PHÂN TRANG */}
      {processedCandidates.length > 0 && (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 rounded-b-2xl">
          <div className="flex-1 w-full text-center xl:text-left text-[13px] font-medium text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {processedCandidates.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, processedCandidates.length)}
            </span>{" "}
            trong số{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {processedCandidates.length}
            </span>{" "}
            ứng viên
          </div>

          <div className="flex-1 flex items-center justify-center gap-1.5 w-full xl:w-auto">
            <button
              onClick={() => {
                setCurrentPage(1);
                setSelectedCandidates([]);
              }}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
            >
              <FaAngleDoubleLeft size={12} />
            </button>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                setSelectedCandidates([]);
              }}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
            >
              <FaChevronLeft size={10} />
            </button>

            <div className="flex items-center gap-1 mx-1 sm:mx-3">
              {generatePagination().map((page, index) => {
                if (page === "...")
                  return (
                    <span
                      key={`dots-${index}`}
                      className="w-9 h-9 flex items-center justify-center text-slate-400 font-bold"
                    >
                      ...
                    </span>
                  );
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      setSelectedCandidates([]);
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${isActive ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-500" : "text-slate-600 border-transparent hover:bg-slate-100"}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                setSelectedCandidates([]);
              }}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
            >
              <FaChevronRight size={10} />
            </button>
            <button
              onClick={() => {
                setCurrentPage(totalPages);
                setSelectedCandidates([]);
              }}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
            >
              <FaAngleDoubleRight size={12} />
            </button>
          </div>

          <div className="hidden xl:block flex-1 w-full"></div>
        </div>
      )}

      {/* THANH THAO TÁC HÀNG LOẠT (BULK ACTIONS) CHỈ HIỂN THỊ KHI TICK */}
      {selectedCandidates.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-800 dark:bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 border border-slate-700">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-600">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-black shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              {selectedCandidates.length}
            </div>
            <span className="text-[13px] font-bold">Đã chọn</span>
          </div>

          <button className="flex items-center gap-2 text-[13px] font-bold text-slate-300 hover:text-white transition-colors">
            <FaEnvelope size={14} /> Email
          </button>

          <div className="relative group">
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkStatusChange(e.target.value);
                e.target.value = "";
              }}
              className="appearance-none bg-white text-slate-800 text-[13px] font-bold py-2 pl-4 pr-8 rounded-xl cursor-pointer outline-none hover:bg-slate-100 transition-colors shadow-sm"
            >
              <option value="">Đổi trạng thái...</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
            <MdKeyboardArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="w-[1px] h-6 bg-slate-600 mx-1"></div>

          <button
            onClick={() => setSelectedCandidates([])}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Bỏ chọn tất cả"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;
