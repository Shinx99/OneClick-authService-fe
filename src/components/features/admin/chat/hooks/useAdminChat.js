"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ← Import AuthContext
import {
  claimConversation as claimConversationApi,
  closeConversation as closeConversationApi,
  getAdminConversationHistory,
  getWaitingConversations,
} from "@/services/chat.service";
import {
  createChatStompClient,
  disconnectSharedChatClient,
} from "@/lib/chat/ws.client";

export function useAdminChat() {
  const [waitingConversations, setWaitingConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // ← Lấy user từ AuthContext
  const adminId = user?.id; // ← Lấy adminId
  const subscriptionsRef = useRef([]);

  // Refresh waiting list function
  const refreshWaitingList = async () => {
    try {
      const response = await getWaitingConversations();
      setWaitingConversations(response?.data?.data || response?.data || []);
    } catch (error) {
      console.error("Refresh waiting conversations failed", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      try {
        await refreshWaitingList();
      } catch (error) {
        console.error("Load waiting conversations failed", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    // Subscribe to waiting queue
    const subscribeTopics = [
      {
        destination: "/topic/admin/waiting-conversations",
        callback: (frame) => {
          try {
            const conversationId = JSON.parse(frame.body);
            if (conversationId) {
              refreshWaitingList(); // Refresh to get full conversation info
            }
          } catch (error) {
            console.error("Admin waiting subscribe parse failed", error);
          }
        },
      },
    ];
    
    // Subscribe to admin's personal queue if adminId exists
    if (adminId) {
      subscribeTopics.push({
        destination: `/user/${adminId}/queue/admin/messages`,
        callback: (frame) => handleAdminQueueMessage(frame),
        userSpecific: true,
      });
    }

    const client = createChatStompClient({
      subscribeTopics,
      onStompError: (frame) => {
        console.error("Admin STOMP error", frame);
      },
      onConnect: () => {
        console.log("Admin WebSocket connected");
      },
    });

    return () => {
      mounted = false;
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];
      disconnectSharedChatClient();
    };
  }, [adminId]);

  // Handle messages from admin queue
  const handleAdminQueueMessage = (frame) => {
    try {
      const payload = JSON.parse(frame.body);
      const response = payload?.payload || payload;
      const eventType = payload?.eventType;

      if (eventType === "USER_MESSAGE" && response?.messages?.length) {
        const userMessage = response.messages[0];
        setActiveConversation((prev) => {
          if (!prev || prev.conversationId !== response.conversationId) return prev;
          return {
            ...prev,
            messages: [
              ...(prev.messages || []),
              {
                id: userMessage.id || `user-${Date.now()}`,
                sender: "USER",
                content: userMessage.content,
                createdAtLabel: "Vừa xong",
              },
            ],
          };
        });
      }
    } catch (error) {
      console.error("Admin queue message parse failed", error);
    }
  };

  const claimConversation = async (conversationId) => {
    try {
      await claimConversationApi(conversationId);
      
      const historyResponse = await getAdminConversationHistory(conversationId);
      const history = historyResponse?.data?.data || historyResponse?.data || {};
      
      setActiveConversation({
        conversationId: history.conversationId,
        userName: "Người dùng",
        status: history.status,
        messages: parseMessages(history.messages || []),
      });
      
      await refreshWaitingList();
      
      // Subscribe to conversation topic for realtime messages
      const client = createChatStompClient({});
      if (client?.connected) {
        const sub = client.subscribe(`/topic/chat/${conversationId}`, (frame) => {
          try {
            const payload = JSON.parse(frame.body);
            const response = payload?.payload || payload;
            
            if (response?.messages?.length) {
              const newMessage = response.messages[0];
              setActiveConversation(prev => ({
                ...prev,
                messages: [...(prev?.messages || []), {
                  id: newMessage.id || `msg-${Date.now()}`,
                  sender: newMessage.senderType === "candidate" ? "USER" : 
                          newMessage.senderType === "admin" ? "ADMIN" : "USER",
                  content: newMessage.content,
                  createdAtLabel: "Vừa xong",
                }],
              }));
            }
          } catch (error) {
            console.error("Parse message failed:", error);
          }
        });
        subscriptionsRef.current.push(sub);
      }
    } catch (error) {
      console.error("Claim conversation failed:", error);
    }
  };

  const closeConversation = async (conversationId) => {
    try {
      await closeConversationApi(conversationId);
      setActiveConversation(null);
      await refreshWaitingList();
    } catch (error) {
      console.error("Close conversation failed:", error);
    }
  };

  const sendAdminMessage = async (conversationId, message) => {
    const client = createChatStompClient({});
    if (!client?.connected) {
      console.error("WebSocket not connected");
      return;
    }

    client.publish({
      destination: "/app/admin.chat.send",
      body: JSON.stringify({ conversationId, message }),
    });

    // Optimistic update
    setActiveConversation((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [
          ...(prev.messages || []),
          {
            id: `admin-${Date.now()}`,
            sender: "ADMIN",
            content: message,
            createdAtLabel: "Vừa xong",
          },
        ],
      };
    });
  };

  const parseMessages = (messages) => {
    if (!messages || !messages.length) return [];
    return messages.map((msg, idx) => ({
      id: msg.id || msg.messageId || `${idx}`,
      sender: msg.senderType === "admin" ? "ADMIN" : "USER",
      content: msg.content,
      createdAt: msg.createdAt,
      createdAtLabel: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : "",
    }));
  };

  return {
    waitingConversations,
    activeConversation,
    loading,
    claimConversation,
    closeConversation,
    sendAdminMessage,
    refreshWaitingList,
  };
}