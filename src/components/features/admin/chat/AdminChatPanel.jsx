"use client";

import { useState, useEffect } from "react";
import AdminChatWindow from "@/components/features/admin/chat/AdminChatWindow";
import { useAdminChat } from "@/components/features/admin/chat/hooks/useAdminChat";

export default function AdminChatPanel() {
  const {
    waitingConversations,
    activeConversation,
    loading,
    claimConversation,
    closeConversation,
    sendAdminMessage,
    refreshWaitingList, // Đã có trong hook
  } = useAdminChat();

  // Auto refresh mỗi 10 giây
  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshWaitingList) {
        refreshWaitingList();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [refreshWaitingList]);

  return (
    <div className="grid h-full min-h-[500px] grid-cols-[280px_1fr]">
      <div className="border-r border-gray-100 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-700">Danh sách đang chờ</div>
          <button
            onClick={refreshWaitingList}
            className="text-xs text-gray-400 hover:text-teal-600 transition-colors"
          >
            🔄
          </button>
        </div>

        {loading && <div className="text-xs text-gray-400">Đang tải...</div>}

        <div className="space-y-2">
          {!loading && waitingConversations.length === 0 && (
            <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-400 text-center">
              Không có conversation nào đang chờ.
            </div>
          )}

          {waitingConversations.map((conversation) => (
            <button
              key={conversation.conversationId}
              type="button"
              onClick={() => claimConversation(conversation.conversationId)}
              className="w-full rounded-xl border border-gray-100 p-3 text-left transition-all hover:border-teal-200 hover:bg-teal-50/30"
            >
              <div className="text-sm font-medium text-gray-800">
                {conversation.userName || "Người dùng"}
              </div>
              <div className="mt-1 line-clamp-2 text-xs text-gray-400">
                {conversation.lastMessage || "Đang chờ tiếp nhận"}
              </div>
              <div className="mt-1 text-[10px] text-gray-300">
                {conversation.lastMessageAt 
                  ? new Date(conversation.lastMessageAt).toLocaleTimeString() 
                  : ""}
              </div>
            </button>
          ))}
        </div>
      </div>

      <AdminChatWindow
        conversation={activeConversation}
        onCloseConversation={closeConversation}
        onSendAdminMessage={sendAdminMessage}
      />
    </div>
  );
}