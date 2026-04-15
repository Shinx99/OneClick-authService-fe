// AdminChatPanel.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import AdminChatWindow from "@/components/features/admin/chat/AdminChatWindow";
import { useAdminChat } from "@/components/features/admin/chat/hooks/useAdminChat";
import { getSharedChatClient } from "@/lib/chat/ws.client";

export default function AdminChatPanel() {
  const {
    waitingConversations,
    inProgressConversations,
    closedConversations,
    activeConversation,
    loading,
    isUserTyping,
    claimConversation,
    openConversation,
    closeConversation,
    sendAdminMessage,
    sendTypingIndicator,
    refreshWaitingList,
    refreshInProgressList,
    refreshClosedList,
  } = useAdminChat();

  const [activeTab, setActiveTab] = useState("waiting");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Kiểm tra WebSocket connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const client = getSharedChatClient();
      setIsWsConnected(client?.connected || false);
    }, 2000);
    
    return () => clearInterval(checkConnection);
  }, []);

  // ✅ Lấy conversation hiện tại để hiển thị - TRẢ VỀ TRỰC TIẾP, không tạo object mới
  const currentDisplayConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    
    // ✅ Ưu tiên dùng activeConversation - trả về trực tiếp
    if (activeConversation?.conversationId === selectedConversationId) {
      console.log("🔄 Using activeConversation, messages count:", activeConversation.messages?.length);
      return activeConversation;
    }
    
    // Tìm trong danh sách theo tab
    let conversation = null;
    if (activeTab === "waiting") {
      conversation = waitingConversations.find(c => c.conversationId === selectedConversationId);
    } else if (activeTab === "inProgress") {
      conversation = inProgressConversations.find(c => c.conversationId === selectedConversationId);
    } else if (activeTab === "closed") {
      conversation = closedConversations.find(c => c.conversationId === selectedConversationId);
    }
    
    return conversation || null;
  }, [selectedConversationId, activeConversation, waitingConversations, inProgressConversations, closedConversations, activeTab]);

  // Khi chọn conversation từ danh sách
  const handleSelectConversation = useCallback((conversation, tabKey) => {
    console.log("📌 Selecting conversation:", conversation.conversationId);
    setSelectedConversationId(conversation.conversationId);
    
    setTimeout(() => {
      if (tabKey === "waiting") {
        claimConversation(conversation.conversationId);
      } else {
        openConversation(conversation.conversationId, tabKey === "inProgress" ? "in_progress" : "closed");
      }
    }, 0);
  }, [claimConversation, openConversation]);

  // Khi chuyển tab - đóng chat window
  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
    setSelectedConversationId(null);
  }, []);

  // Khi đóng conversation từ chat window
  const handleCloseConversation = useCallback(async (conversationId) => {
    await closeConversation(conversationId);
    setSelectedConversationId(null);
  }, [closeConversation]);

  // Manual reconnect
  const handleReconnect = () => {
    window.location.reload();
  };

  // Tab configuration
  const tabConfig = {
    waiting: {
      title: "Đang chờ",
      icon: "⏳",
      badgeColor: "bg-amber-500",
      conversations: waitingConversations,
      emptyMessage: "Không có conversation nào đang chờ.",
      bgColor: "hover:border-amber-200 hover:bg-amber-50/30",
    },
    inProgress: {
      title: "Đang hỗ trợ",
      icon: "💬",
      badgeColor: "bg-teal-500",
      conversations: inProgressConversations,
      emptyMessage: "Bạn chưa hỗ trợ conversation nào.",
      bgColor: "hover:border-teal-200 hover:bg-teal-50/30",
    },
    closed: {
      title: "Đã đóng",
      icon: "✅",
      badgeColor: "bg-gray-400",
      conversations: closedConversations,
      emptyMessage: "Chưa có conversation nào được đóng.",
      bgColor: "hover:border-gray-200 hover:bg-gray-50/30",
    },
  };

  const currentTab = tabConfig[activeTab];

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };
  
  return (
    <div className="h-full w-full min-h-0">
      <div className="grid h-full min-h-0 grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <div className="flex flex-col h-full min-h-0 border-r border-gray-100 bg-gray-50/30">
          {/* WebSocket Status */}
          <div className="flex-shrink-0 px-3 pt-3">
            <div className={`mb-2 flex items-center justify-between rounded-lg px-2 py-1 text-[10px] ${
              isWsConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              <span className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${isWsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {isWsConnected ? "Đã kết nối realtime" : "Mất kết nối - đang thử lại"}
              </span>
              {!isWsConnected && (
                <button
                  onClick={handleReconnect}
                  className="ml-2 rounded bg-white px-1.5 py-0.5 text-[9px] font-medium text-teal-600 shadow-sm"
                >
                  Kết nối lại
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-shrink-0 p-3 pb-0">
            <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1">
              {Object.entries(tabConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all ${
                    activeTab === key
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-200/50"
                  }`}
                >
                  <span>{config.icon}</span>
                  <span className="hidden sm:inline">{config.title}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] text-white ${config.badgeColor}`}>
                    {config.conversations.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Refresh button */}
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-medium text-gray-500">
                {currentTab.title} · {currentTab.conversations.length}
              </div>
              <button
                onClick={() => {
                  if (activeTab === "waiting") refreshWaitingList();
                  else if (activeTab === "inProgress") refreshInProgressList();
                  else refreshClosedList();
                }}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-teal-600"
                title="Làm mới"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2">
            {loading && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
                ))}
              </div>
            )}

            {!loading && currentTab.conversations.length === 0 && (
              <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-400 shadow-sm">
                <div className="text-3xl mb-2">{currentTab.icon}</div>
                {currentTab.emptyMessage}
              </div>
            )}

            {!loading &&
              currentTab.conversations.map((conversation) => (
                <button
                  key={conversation.conversationId}
                  type="button"
                  onClick={() => handleSelectConversation(conversation, activeTab)}
                  className={`w-full rounded-xl border bg-white p-3 text-left transition-all ${
                    selectedConversationId === conversation.conversationId
                      ? "border-teal-400 bg-teal-50/50 shadow-sm ring-1 ring-teal-400"
                      : `border-gray-100 ${currentTab.bgColor}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {conversation.userAvatar && (
                          <img src={conversation.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {conversation.userFullName || conversation.userEmail || conversation.userName || "Người dùng"}
                          </span>
                          {conversation.userEmail && conversation.userEmail !== conversation.userFullName && (
                            <span className="text-[10px] text-gray-400 truncate">
                              {conversation.userEmail}
                            </span>
                          )}
                        </div>
                        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 shrink-0">
                          {conversation.userType === "candidate" ? "Ứng viên" : 
                          conversation.userType === "recruiter" ? "Tuyển dụng" : "Admin"}
                        </span>
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {conversation.lastMessagePreview || "Chưa có tin nhắn"}
                      </div>
                    </div>
                    {conversation.lastMessageAt && (
                      <div className="shrink-0 text-[10px] text-gray-400">
                        {formatTime(conversation.lastMessageAt)}
                      </div>
                    )}
                  </div>

                  {activeTab === "inProgress" && isUserTyping(conversation.conversationId) && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[9px] text-teal-600">
                        <span className="animate-pulse">●</span>
                        Đang nhập...
                      </span>
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* Chat Window - ✅ Dùng key đơn giản */}
        {currentDisplayConversation ? (
          <div className="h-full min-h-0" key={currentDisplayConversation.conversationId}>
            <AdminChatWindow
              key={currentDisplayConversation.conversationId}
              conversation={currentDisplayConversation}
              onCloseConversation={handleCloseConversation}
              onSendAdminMessage={sendAdminMessage}
              onSendTyping={sendTypingIndicator}
              isReadOnly={activeTab === "closed"}
              isTyping={isUserTyping(currentDisplayConversation.conversationId)}
            />
          </div>
        ) : (
          <div className="h-full min-h-0 flex items-center justify-center bg-gray-50/30 rounded-xl">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {activeTab === "waiting" && "Chưa có cuộc trò chuyện nào"}
                {activeTab === "inProgress" && "Đang hỗ trợ"}
                {activeTab === "closed" && "Cuộc trò chuyện đã đóng"}
              </h3>
              <p className="text-sm text-gray-400">
                {activeTab === "waiting" && "Hãy chọn một cuộc trò chuyện từ danh sách bên trái"}
                {activeTab === "inProgress" && "Chọn một cuộc trò chuyện để tiếp tục hỗ trợ"}
                {activeTab === "closed" && "Chọn một cuộc trò chuyện để xem lại lịch sử"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}