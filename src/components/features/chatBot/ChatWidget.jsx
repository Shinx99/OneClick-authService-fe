// components/ChatWidget.js
"use client";

import { usePathname } from "next/navigation";
import {
  FaMinus,
  FaExpandAlt,
  FaTimes,
  FaRobot,
  FaHeadset,
} from "react-icons/fa";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatQuickReplies from "./ChatQuickReplies";
import ChatHandoffBanner from "./ChatHandoffBanner"; 
import { useAuth } from "@/context/AuthContext";
import { useChat } from "./hooks/useChat";

export default function ChatWidget({ isMinimized, onMinimize, onClose }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const { user } = useAuth(); 
  const userType = user?.role || "candidate";

  const {
    messages,
    mode,
    loading,
    loadingMore,
    hasMore,
    input,
    setInput,
    sendCurrentMessage,
    requestAdminHandoff,
    loadMoreMessages,
    canSend,
    conversationId,
    closeAndCreateNew, 
    createNewConversation,
    showHandoffBanner, 
    setShowHandoffBanner,
  } = useChat();

  const handleQuickReply = (message) => {
    setInput(message);
    setTimeout(() => sendCurrentMessage(), 100);
  };

  const handleHideHandoffBanner = () => {
    setShowHandoffBanner(false);
  };

  return (
    <div className="flex h-full flex-col bg-card-bg transition-all duration-300">
      {/* HEADER */}
      <div
        className="flex items-center gap-4 bg-[#00c853] px-6 py-5 text-white cursor-pointer select-none relative overflow-hidden shadow-lg"
        onClick={onMinimize}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/20 shadow-inner">
          {mode === "admin" ? <FaHeadset size={20} /> : <FaRobot size={20} />}
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#00c853] bg-[#00e676] animate-pulse"></span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-black uppercase tracking-widest leading-none truncate">
            {isAdminRoute ? "Support Team" : "OneClick AI"}
          </h3>
          <p className="text-[10px] text-white/80 font-bold mt-1.5 uppercase tracking-tighter">
            {mode === "admin" ? "Đang hỗ trợ" : "Sẵn sàng hỗ trợ"}
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-90"
            title="Thu nhỏ"
          >
            {isMinimized ? <FaExpandAlt size={12} /> : <FaMinus size={14} />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-red-500 border border-white/10 transition-all active:scale-90"
            title="Đóng"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* BODY AREA */}
      {!isMinimized && mode === "ai" && (
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          {/* Quick Replies - chỉ hiển thị khi mode AI */}
          {showHandoffBanner ? (
            <div className="px-4 pt-3">
              <ChatHandoffBanner 
                onClose={handleHideHandoffBanner}
                // autoCloseSeconds={15}
              />
            </div>
          ) : (
            <ChatQuickReplies
              userType={userType}
              mode={mode}
              onSelect={handleQuickReply}
            />
          )}

          <ChatMessages
            messages={messages}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMoreMessages}
            showHandoffBanner={false}
          />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendCurrentMessage}
            canSend={canSend}
            onRequestHandoff={requestAdminHandoff}
            onCloseAndCreateNew={closeAndCreateNew}
            mode={mode}
            disabled={loading}
          />
        </div>
      )}
      
      {/* Khi không phải mode AI, chỉ hiển thị messages và input */}
      {!isMinimized && mode !== "ai" && (
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          
          {/* Hiển thị banner nếu đang chờ admin */}
          {showHandoffBanner && (
            <div className="px-4 pt-3">
              <ChatHandoffBanner 
                onClose={handleHideHandoffBanner}
                // autoCloseSeconds={15}
              />
            </div>
          )}
          
          <ChatMessages
            messages={messages}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMoreMessages}
            showHandoffBanner={false}
          />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendCurrentMessage}
            canSend={canSend}
            onRequestHandoff={requestAdminHandoff}
            onCloseAndCreateNew={closeAndCreateNew}
            mode={mode}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}