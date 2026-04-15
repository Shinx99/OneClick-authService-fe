"use client";

import { useMemo, useState, useEffect, useRef, useCallback, memo } from "react";

export default function AdminChatWindow({
  conversation,
  onCloseConversation,
  onSendAdminMessage,
  onSendTyping,
  isTyping = false,
  isReadOnly = false,
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const conversationId = useMemo(
    () => conversation?.conversationId || conversation?.id || null,
    [conversation]
  );

  // Handle user typing indicator (từ user)
  useEffect(() => {
    if (isTyping) {
      setShowTyping(true);
      const timer = setTimeout(() => setShowTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // ✅ Cải thiện scroll - chỉ scroll khi user không chủ động scroll lên
  const handleUserScroll = useCallback(() => {
    isUserScrolling.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 150);
  }, []);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement?.parentElement;
    if (container) {
      container.addEventListener('scroll', handleUserScroll);
      return () => container.removeEventListener('scroll', handleUserScroll);
    }
  }, [handleUserScroll]);

  // ✅ Scroll chỉ khi user không đang scroll
  useEffect(() => {
    if (!isUserScrolling.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [conversation?.messages?.length]);

  // Handle admin typing indicator
  const handleTypingChange = useCallback((isTyping) => {
    if (!conversationId || !onSendTyping || isReadOnly) return;
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    onSendTyping(conversationId, isTyping);
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        onSendTyping(conversationId, false);
      }, 2000);
    }
  }, [conversationId, onSendTyping, isReadOnly]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (conversationId && onSendTyping) onSendTyping(conversationId, false);
    };
  }, [conversationId, onSendTyping]);

  // ✅ Memoize messages rendering để tránh re-render không cần
  const renderedMessages = useMemo(() => {
    if (!conversation?.messages || conversation.messages.length === 0) return null;
    
    return conversation.messages.map((message, idx) => {
      const sender = (message.sender || "USER").toUpperCase();
      const isAdmin = sender === "ADMIN";
      const isAI = sender === "AI";
      const isSystem = sender === "SYSTEM";

      if (isSystem) {
        return (
          <div key={message.id || idx} className="flex justify-center">
            <div className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {message.content}
            </div>
          </div>
        );
      }

      return (
        <div
          key={message.id || idx}
          className={`flex ${isAdmin ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
        >
          <div
            className={[
              "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
              isAdmin
                ? "rounded-br-sm bg-teal-600 text-white"
                : isAI
                ? "rounded-bl-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                : "rounded-bl-sm bg-white text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700",
            ].join(" ")}
          >
            {isAI && (
              <div className="mb-1 flex items-center gap-1 text-[9px] font-medium text-purple-500 dark:text-purple-400">
                <span>🤖</span> AI Assistant
              </div>
            )}
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
            <div
              className={[
                "mt-1 text-[9px]",
                isAdmin ? "text-teal-100" : "text-neutral-400",
              ].join(" ")}
            >
              {message.createdAtLabel || (message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : "")}
            </div>
          </div>
        </div>
      );
    });
  }, [conversation?.messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-neutral-500">
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl">💬</div>
          <p>Chọn một conversation ở cột bên trái để bắt đầu hỗ trợ người dùng.</p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!draft.trim() || !conversationId || sending || isReadOnly) return;
    
    if (onSendTyping) {
      onSendTyping(conversationId, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
    
    setSending(true);
    try {
      await onSendAdminMessage(conversationId, draft.trim());
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-neutral-900">
      {/* Header */}
      {/* <div className="flex-shrink-0 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              {conversation.userName || "Người dùng"}
            </div>
            {conversation.userType && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {conversation.userType === "candidate" ? "Ứng viên" : 
                 conversation.userType === "recruiter" ? "Tuyển dụng" : "Người dùng"}
              </span>
            )}
            {!isReadOnly && conversation.status === "in_progress" && (
              <span className="flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                Đang hỗ trợ
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-neutral-400">
            ID: {conversationId?.slice(0, 8)}...
          </div>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => onCloseConversation(conversationId)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Đóng hỗ trợ
          </button>
        )}
      </div> */}

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {conversation.userAvatar && (
            <img src={conversation.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                {conversation.userFullName || conversation.userEmail || conversation.userName || "Người dùng"}
              </div>
              {conversation.userType && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {conversation.userType === "candidate" ? "Ứng viên" : 
                  conversation.userType === "recruiter" ? "Tuyển dụng" : "Người dùng"}
                </span>
              )}
              {!isReadOnly && conversation.status === "in_progress" && (
                <span className="flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Đang hỗ trợ
                </span>
              )}
            </div>
            {conversation.userEmail && conversation.userEmail !== conversation.userFullName && (
              <div className="text-[10px] text-neutral-400 mt-0.5">
                {conversation.userEmail}
              </div>
            )}
          </div>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => onCloseConversation(conversationId)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Đóng hỗ trợ
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-neutral-50/30 p-4 dark:bg-neutral-900/30">
        <div className="space-y-3">
          {conversation.messages?.length === 0 && (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-neutral-400">
              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <p>Chưa có tin nhắn trong conversation này.</p>
                <p className="text-xs mt-1">Hãy gửi tin nhắn để bắt đầu trò chuyện.</p>
              </div>
            </div>
          )}

          {/* ✅ Sử dụng renderedMessages đã được memoize */}
          {renderedMessages}

          {/* User typing indicator */}
          {showTyping && !isReadOnly && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="rounded-bl-sm rounded-2xl rounded-tr-2xl bg-white px-3 py-2 shadow-sm border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:-0.2s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:-0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      {!isReadOnly && (
        <div className="flex-shrink-0 border-t border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                handleTypingChange(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn... (Enter để gửi)"
              disabled={sending}
              className="min-h-10 max-h-28 flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim() || sending}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm text-white transition hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              {sending ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Gửi"
              )}
            </button>
          </div>
          <div className="mt-1 text-[9px] text-neutral-400 dark:text-neutral-500">
            Shift + Enter để xuống dòng
          </div>
        </div>
      )}

      {/* Read-only footer */}
      {isReadOnly && (
        <div className="flex-shrink-0 border-t border-neutral-200 bg-neutral-50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Conversation đã được đóng. Không thể gửi tin nhắn mới.
          </p>
        </div>
      )}
    </div>
  );
}