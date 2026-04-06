"use client";

import { useState } from "react";
import ChatWidget from "@/components/features/chatBot/ChatWidget";
import { FaCommentDots } from "react-icons/fa";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleCloseEverything = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* NÚT TRÒN FLOATING (CHỈ HIỆN KHI ĐÓNG) */}
      {!isOpen && (
        <div className="fixed bottom-8 right-8 z-[1000] animate-in fade-in zoom-in duration-500">
          <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-[#00c853] opacity-20"></span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#00c853] text-white shadow-[0_8px_30px_rgb(0,200,83,0.4)] hover:bg-[#00b04a] hover:-translate-y-1.5 transition-all duration-300 active:scale-95"
          >
            <FaCommentDots size={28} />
          </button>
        </div>
      )}

      {/* KHUNG CHAT WIDGET TỔNG THỂ */}
      {isOpen && (
        <div
          className={`fixed bottom-8 right-8 z-[999] max-w-[calc(100vw-32px)] overflow-hidden rounded-[28px] border border-card-border bg-card-bg shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
            isMinimized ? "h-[80px] w-[320px]" : "h-[650px] w-[400px]"
          }`}
        >
          <ChatWidget
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized((prev) => !prev)}
            onClose={handleCloseEverything}
          />
        </div>
      )}
    </>
  );
}
