"use client";

import { useMemo, useState } from "react";
import ChatWidget from "@/components/features/chatBot/ChatWidget";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const buttonLabel = useMemo(() => {
    if (!isOpen) return "Mở chat hỗ trợ";
    if (isMinimized) return "Mở lại chat";
    return "Đóng chat hỗ trợ";
  }, [isOpen, isMinimized]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setIsMinimized(false);
      return next;
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={buttonLabel}
        className="fixed bottom-6 right-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white shadow-2xl transition duration-200 hover:scale-105 hover:bg-teal-800 active:scale-95"
      >
        <span className="text-xl">{isOpen ? "✕" : "💬"}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[999] h-[560px] w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
          <ChatWidget
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized((prev) => !prev)}
          />
        </div>
      )}
    </>
  );
}