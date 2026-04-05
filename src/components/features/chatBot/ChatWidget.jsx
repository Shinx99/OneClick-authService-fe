// ChatWidget.jsx

"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import ChatMessages from "@/components/features/chatBot/ChatMessages";
import ChatInput from "@/components/features/chatBot/ChatInput";
import ChatHandoffBanner from "@/components/features/chatBot/ChatHandoffBanner";
import { useChat } from "@/components/features/chatBot/hooks/useChat";
import AdminChatPanel from "@/components/features/admin/chat/AdminChatPanel";

export default function ChatWidget({ isMinimized, onMinimize }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [isTyping, setIsTyping] = useState(false);

  const {
    messages,
    mode,
    loading,
    input,
    setInput,
    sendCurrentMessage,
    requestAdminHandoff,
    canSend,
    conversationId,
    sendTypingIndicator, // ✅ Thêm từ hook
  } = useChat();

  // Handle typing event
  const handleTyping = (convId, typing) => {
    if (sendTypingIndicator) {
      sendTypingIndicator(convId, typing);
    }
    setIsTyping(typing);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 bg-teal-700 px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-base">
          💬
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold">
            {isAdminRoute ? "Admin Support Inbox" : "OneClick Assistant"}
          </div>
          <div className="text-xs text-white/80">
            {isAdminRoute
              ? "Quản lý conversation đang chờ"
              : mode === "waiting"
              ? "Đang chờ admin tiếp nhận"
              : mode === "admin"
              ? "Bạn đang trò chuyện với admin"
              : "AI hỗ trợ sử dụng hệ thống"}
          </div>
        </div>

        <button
          type="button"
          onClick={onMinimize}
          className="rounded-md px-2 py-1 text-xs transition hover:bg-white/10"
        >
          {isMinimized ? "Mở" : "Thu"}
        </button>
      </div>

      {!isMinimized && (
        <>
          {isAdminRoute ? (
            <AdminChatPanel />
          ) : (
            <>
              {mode === "waiting" && <ChatHandoffBanner />}
              <ChatMessages 
                messages={messages} 
                loading={loading}
                isTyping={isTyping && mode === "admin"} // ✅ Chỉ show typing khi đang chat với admin
              />
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={sendCurrentMessage}
                canSend={canSend}
                onRequestHandoff={requestAdminHandoff}
                mode={mode}
                disabled={loading}
                onTyping={handleTyping}
                conversationId={conversationId}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}