"use client";
import React from "react";
import { FaRegFilePdf, FaEnvelope, FaPhone } from "react-icons/fa";
import { MdOutlineMoreVert, MdKeyboardArrowDown } from "react-icons/md";
import toast from "react-hot-toast";

// Đồng bộ màu sắc trạng thái
const STATUS_CONFIG = {
  APPLIED: {
    label: "Mới ứng tuyển",
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  },
  REVIEWING: {
    label: "Đang xem xét",
    cls: "bg-blue-50 text-blue-600 border-blue-200",
  },
  INTERVIEW: {
    label: "Phỏng vấn",
    cls: "bg-purple-50 text-purple-600 border-purple-200",
  },
  OFFERED: {
    label: "Đề nghị Offer",
    cls: "bg-orange-50 text-orange-600 border-orange-200",
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
  // Hàm xử lý đổi trạng thái ngay trên Bảng
  const handleStatusChange = (candidateId, newStatus) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    // Cập nhật mảng gốc
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c)),
    );

    // Bật thông báo
    toast.success(
      `Đã đổi trạng thái ${candidate.name} thành ${STATUS_CONFIG[newStatus].label}`,
    );
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[950px]">
        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm z-10 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 w-12 text-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </th>
            <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Ứng viên
            </th>
            <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Vị trí & Kinh nghiệm
            </th>
            {/* Tăng độ rộng cột trạng thái một chút để chứa cái dropdown */}
            <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider w-[180px]">
              Trạng thái
            </th>
            <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Mức độ phù hợp
            </th>
            <th className="px-4 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Ngày nộp
            </th>
            <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {candidates.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-20 text-center text-slate-500 font-medium"
              >
                Không tìm thấy ứng viên nào phù hợp với bộ lọc.
              </td>
            </tr>
          )}

          {candidates.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
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
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      {c.time}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {c.role}
                </p>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  {c.exp} kinh nghiệm
                </p>
              </td>

              {/* ===== CỘT TRẠNG THÁI (ĐÃ CHUYỂN THÀNH SELECT BOX) ===== */}
              <td className="px-4 py-4">
                <div className="relative w-fit">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className={`appearance-none outline-none pl-3 pr-8 py-1.5 rounded-md text-[11px] font-bold border cursor-pointer transition-colors shadow-sm ${STATUS_CONFIG[c.status]?.cls} hover:opacity-80`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      // Thêm bg-white cho các option để khi xổ xuống nó không bị dính màu của class cha
                      <option
                        key={key}
                        value={key}
                        className="bg-white text-slate-700 font-medium"
                      >
                        {config.label}
                      </option>
                    ))}
                  </select>
                  {/* Icon mũi tên giả lập chèn lên trên thẻ select */}
                  <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-current opacity-60 pointer-events-none" />
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
              <td className="px-4 py-4 text-[13px] font-medium text-slate-500">
                {c.date || "—"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    title="Xem CV"
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
