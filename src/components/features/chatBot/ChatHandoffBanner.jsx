// components/chat/ChatHandoffBanner.jsx
"use client";

import { FaSpinner, FaTimes } from "react-icons/fa";

export default function ChatHandoffBanner({ onClose }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FaSpinner className="h-3 w-3 animate-spin" />
          <span>✨ Hệ thống đang kết nối bạn với đội ngũ hỗ trợ...</span>
        </div>
        <button
          onClick={onClose}
          className="text-amber-500/70 hover:text-amber-700 transition-all"
          title="Đóng thông báo"
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  );
}