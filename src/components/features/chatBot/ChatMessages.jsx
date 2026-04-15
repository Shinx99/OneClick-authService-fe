// components/ChatMessages.js
"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ChatMessages({ 
  messages = [], 
  loading = false, 
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  showHandoffBanner = false, // Thêm prop
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const isScrollingToTop = useRef(false);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (!isScrollingToTop.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Handle scroll to top for loading more
  const handleScroll = useCallback((e) => {
    const { scrollTop } = e.target;
    
    if (scrollTop === 0 && hasMore && !loadingMore && onLoadMore) {
      isScrollingToTop.current = true;
      const oldScrollHeight = e.target.scrollHeight;
      
      onLoadMore().finally(() => {
        // Maintain scroll position after loading more
        const newScrollHeight = e.target.scrollHeight;
        e.target.scrollTop = newScrollHeight - oldScrollHeight;
        isScrollingToTop.current = false;
      });
    }
  }, [hasMore, loadingMore, onLoadMore]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6 bg-background">
        <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-card-border" />
        <div className="ml-auto h-10 w-1/2 animate-pulse rounded-2xl bg-card-border" />
        <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-card-border" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 bg-background transition-colors scrollbar-thin"
    >
      {loadingMore && (
        <div className="flex justify-center py-2">
          <div className="text-xs text-text-muted">Đang tải tin nhắn cũ...</div>
        </div>
      )}
      
      {!loadingMore && hasMore && (
        <div className="flex justify-center py-2">
          <div className="text-xs text-text-muted">--- Cuộn lên để xem tin nhắn cũ ---</div>
        </div>
      )}
      
      {messages.map((message, idx) => {
        const isUser = (message.sender || "AI").toUpperCase() === "USER";
        const isSystem = (message.sender || "").toUpperCase() === "SYSTEM";
        
        if (isSystem) {
          return (
            <div key={message.id || idx} className="flex justify-center">
              <div className="text-xs text-text-muted bg-card-bg px-3 py-1 rounded-full">
                {message.content}
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id || idx}
            className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`relative max-w-[85%] px-4 py-3 rounded-[22px] text-[13.5px] leading-relaxed shadow-sm ${
                isUser
                  ? "bg-[#00c853] text-white rounded-br-none font-medium"
                  : "bg-card-bg text-text-main border border-card-border rounded-bl-none shadow-black/5"
              }`}
            >
              {message.content}
              <div
                className={`absolute bottom-[-18px] text-[9px] font-bold uppercase tracking-tighter opacity-30 whitespace-nowrap ${isUser ? "right-1" : "left-1"}`}
              >
                {message.timeLabel || ""}
                {message.isRead && isUser && (
                  <span className="ml-1 text-[#00c853]">✓✓</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Thêm banner vào cuối danh sách tin nhắn (trước scroll anchor) */}
      {showHandoffBanner && (
        <div className="flex justify-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-xl border border-gray-400 bg-gray-50 px-4 py-2.5 text-[11px] font-medium text-gray-600 flex items-center gap-2 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full" />
            ✨ Hệ thống đang kết nối bạn với đội ngũ hỗ trợ. Vui lòng chờ trong giây lát...
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}