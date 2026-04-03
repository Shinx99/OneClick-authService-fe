// ChatInput.jsx

"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatInput({
  value,
  onChange,
  onSend,
  canSend,
  onRequestHandoff,
  mode,
  disabled = false,
  onTyping, // Thêm callback cho typing event
  conversationId, //  Thêm conversationId
}) {
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSend = async () => {
    if (!canSend || sending || disabled) return;

    try {
      setSending(true);
      await onSend();
    } finally {
      setSending(false);
    }
  };

  //  Handle typing event
  const handleTyping = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Publish typing event
    if (onTyping && conversationId) {
      onTyping(conversationId, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(conversationId, false);
      }, 1000);
    }
  };

  return (
    <div className="border-t border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
        <textarea
          rows={1}
          value={value}
          onChange={handleTyping} // ✅ Use handleTyping
          disabled={disabled}
          placeholder={mode === "admin" ? "Nhắn với admin..." : "Nhập nội dung..."}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="min-h-6 max-h-28 flex-1 resize-none bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend || sending || disabled}
          className="rounded-xl bg-teal-700 px-3 py-2 text-sm text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-700"
        >
          {sending ? "..." : "Gửi"}
        </button>
      </div>

      {mode === "ai" && !disabled && (
        <button
          type="button"
          onClick={onRequestHandoff}
          className="mt-2 text-xs text-neutral-500 underline hover:text-teal-700"
        >
          Kết nối admin hỗ trợ
        </button>
      )}
    </div>
  );
}