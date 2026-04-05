"use client";

import { useMemo, useState, useEffect } from "react";

export default function AdminChatWindow({
  conversation,
  onCloseConversation,
  onSendAdminMessage,
  isTyping = false, //  Thêm prop
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  const conversationId = useMemo(
    () => conversation?.conversationId || conversation?.id || null,
    [conversation]
  );

  //  Handle typing indicator
  useEffect(() => {
    if (isTyping) {
      setShowTyping(true);
      const timer = setTimeout(() => setShowTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-neutral-500">
        Chọn một conversation ở cột bên trái để bắt đầu hỗ trợ người dùng.
      </div>
    );
  }

  const messages = conversation.messages || [];

  const handleSend = async () => {
    if (!draft.trim() || !conversationId || sending) return;
    
    setSending(true);
    try {
      await onSendAdminMessage(conversationId, draft.trim());
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div>
          <div className="text-sm font-semibold">
            {conversation.userName || "Người dùng"}
          </div>
          <div className="text-xs text-neutral-500">
            Conversation: {conversationId?.slice(0, 8)}...
          </div>
        </div>

        <button
          type="button"
          onClick={() => onCloseConversation(conversationId)}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
        >
          Đóng hỗ trợ
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-sm text-neutral-500">
            Chưa có tin nhắn trong conversation này.
          </div>
        )}

        {messages.map((message, idx) => {
          const sender = (message.sender || "USER").toUpperCase();
          const isAdmin = sender === "ADMIN";

          return (
            <div key={message.id || idx} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  isAdmin
                    ? "rounded-br-sm bg-blue-600 text-white"
                    : "rounded-bl-sm bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
                ].join(" ")}
              >
                <div>{message.content}</div>
                <div className="mt-1 text-[10px] opacity-60">
                  {message.createdAtLabel || message.createdAt || ""}
                </div>
              </div>
            </div>
          );
        })}

        {/* User typing indicator */}
        {showTyping && (
          <div className="flex justify-start">
            <div className="rounded-bl-sm rounded-2xl rounded-tr-2xl bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.2s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhắn với user..."
            className="min-h-6 max-h-28 flex-1 resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? "..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}