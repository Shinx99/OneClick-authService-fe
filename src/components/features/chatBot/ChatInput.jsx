"use client";

import { FaPaperPlane } from "react-icons/fa";

export default function ChatInput({
  value,
  onChange,
  onSend,
  canSend,
  onRequestHandoff,
  mode,
  disabled,
}) {
  return (
    <div className="p-5 bg-card-bg border-t border-card-border transition-colors">
      <div className="relative flex items-end gap-2 bg-background border border-card-border rounded-[20px] p-2 focus-within:border-[#00c853] focus-within:ring-2 focus-within:ring-[#00c853]/10 transition-all shadow-inner">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập tin nhắn..."
          disabled={disabled}
          className="flex-1 max-h-32 min-h-[42px] py-2.5 px-3 bg-transparent text-sm text-text-main outline-none resize-none placeholder:text-text-muted/50"
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())
          }
        />

        <button
          onClick={onSend}
          disabled={!canSend || disabled}
          className="h-10 w-10 shrink-0 flex items-center justify-center rounded-[14px] bg-[#00c853] text-white shadow-lg shadow-green-500/20 hover:bg-[#00b04a] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
        >
          <FaPaperPlane size={16} />
        </button>
      </div>

      {mode === "ai" && (
        <div className="mt-3 text-center">
          <button
            onClick={onRequestHandoff}
            className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-[#00c853] transition-colors underline decoration-dotted underline-offset-4"
          >
            Kết nối quản trị viên
          </button>
        </div>
      )}
    </div>
  );
}
