// components/ChatMessages.js
"use client";

import { useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessages({ 
  messages = [], 
  loading = false, 
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  showHandoffBanner = false,
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
        const newScrollHeight = e.target.scrollHeight;
        e.target.scrollTop = newScrollHeight - oldScrollHeight;
        isScrollingToTop.current = false;
      });
    }
  }, [hasMore, loadingMore, onLoadMore]);

  // Custom components for markdown styling
  const MarkdownComponents = {
    // Headers
    h1: ({ node, ...props }) => <h1 className="text-lg font-bold my-2" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-base font-bold my-1.5" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-sm font-bold my-1" {...props} />,
    // Paragraph
    p: ({ node, ...props }) => <p className="my-1 leading-relaxed" {...props} />,
    // Lists
    ul: ({ node, ...props }) => <ul className="list-disc ml-4 my-1 space-y-0.5" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 my-1 space-y-0.5" {...props} />,
    li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
    // Text formatting
    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
    em: ({ node, ...props }) => <em className="italic" {...props} />,
    // Code
    code: ({ node, inline, ...props }) => 
      inline ? (
        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props} />
      ) : (
        <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded my-1 text-sm overflow-x-auto" {...props} />
      ),
    pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded my-1 overflow-x-auto text-sm" {...props} />,
    // Blockquote
    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 my-1 italic text-gray-600 dark:text-gray-400" {...props} />,
    // Horizontal rule
    hr: ({ node, ...props }) => <hr className="my-2 border-gray-200 dark:border-gray-700" {...props} />,
  };

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
              {isUser ? (
                // User message - plain text
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              ) : (
                // AI message - render markdown
                <div className="markdown-content prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
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

      {/* Banner khi chờ admin */}
      {showHandoffBanner && (
        <div className="flex justify-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 px-4 py-2.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            ✨ Hệ thống đang kết nối bạn với đội ngũ hỗ trợ. Vui lòng chờ trong giây lát...
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}