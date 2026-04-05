"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getMyConversation,
  requestHandoff as requestHandoffApi,
  sendMessage as sendMessageApi,
} from "@/services/chat.service";
import { createChatStompClient } from "@/lib/chat/ws.client";

export function useChat() {
  const pathname = usePathname();
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState("ai");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const hasInitialized = useRef(false);

  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute || hasInitialized.current) return;
    hasInitialized.current = true;

    let mounted = true;

    // useChat.js - Sửa loadConversation
const loadConversation = async () => {
  setLoading(true);
  
  try {
    const response = await getMyConversation();
    const history = response?.data?.data || response?.data || {};
    
    if (history?.conversationId) {
      setConversationId(history.conversationId);
      setMessages(parseMessages(history.messages || []));
      
      if (history?.status === "handoff") setMode("waiting");
      if (history?.status === "in_progress") setMode("admin");
    } else {
      // Không có conversation - không phải lỗi
      setMessages([]);
      setConversationId(null);
    }
  } catch (error) {
    // 400, 404 là không có conversation - bình thường
    if (error?.response?.status !== 400 && error?.response?.status !== 404) {
      console.error("Load conversation failed:", error);
    }
    setMessages([]);
    setConversationId(null);
  } finally {
    setLoading(false);  // ✅ Quan trọng: luôn set loading = false
  }
};

    loadConversation();

    return () => {
      mounted = false;
    };
  }, [isAdminRoute]);

  // Function parse messages từ API response
  const parseMessages = (msgs) => {
    if (!msgs || !msgs.length) return [];
    
    return msgs.map((msg, idx) => {
      // Xác định sender dựa trên senderType
      let sender = "USER";
      if (msg.senderType === "ai" || msg.senderType === "AI") {
        sender = "AI";
      } else if (msg.senderType === "admin" || msg.senderType === "ADMIN") {
        sender = "ADMIN";
      } else if (msg.senderType === "system" || msg.senderType === "SYSTEM") {
        sender = "SYSTEM";
      }
      
      return {
        id: msg.id || msg.messageId || `msg-${idx}-${Date.now()}`,
        sender: sender,
        content: msg.content || "",
        createdAt: msg.createdAt,
        createdAtLabel: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : "",
      };
    });
  };

  // WebSocket subscription
  useEffect(() => {
    if (!conversationId || isAdminRoute) return;

    console.log("🔵 Setting up WebSocket for conversation:", conversationId);

    const subscribeTopics = [
      {
        destination: `/topic/chat/${conversationId}`,
        callback: (frame) => {
          console.log("📨 WebSocket message received:", frame.body);
          try {
            const payload = JSON.parse(frame.body);
            const response = payload?.payload || payload;
            const eventType = payload?.eventType;

            if (eventType === "HANDOFF_REQUESTED") setMode("waiting");
            if (eventType === "ADMIN_CLAIMED") setMode("admin");
            if (eventType === "CLAIMED") setMode("admin");

            if (response?.messages?.length) {
              const newMessages = parseMessages(response.messages);
              setMessages((prev) => {
                const existingIds = new Set(prev.map(m => m.id));
                const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
                return [...prev, ...uniqueNew];
              });
            }
          } catch (error) {
            console.error("Parse WebSocket message failed:", error);
          }
        },
      },
    ];

    createChatStompClient({
      subscribeTopics,
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

  }, [conversationId, isAdminRoute]);

  // useChat.js - Sửa sendCurrentMessage
// Thêm state để mapping
const [pendingMessages, setPendingMessages] = useState(new Map());

const sendCurrentMessage = async () => {
  if (!input.trim() || loading) return;

  const message = input.trim();
  const tempId = `local-${Date.now()}`;

  // Lưu nội dung message tạm
  setPendingMessages(prev => new Map(prev).set(tempId, message));

  // Optimistic update
  // setMessages(prev => [...prev, {
  //   id: tempId,
  //   sender: "USER",
  //   content: message,
  //   createdAtLabel: "Đang gửi...",
  // }]);
  setInput("");

  // Gửi qua WebSocket (có thể kèm tempId nếu backend hỗ trợ)
  const client = createChatStompClient();
  if (conversationId && client?.connected) {
    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ message, tempId }),
    });
  }
};

// WebSocket callback - replace dựa trên nội dung
const handleConversationEvent = (frame) => {
  try {
    const payload = JSON.parse(frame.body);
    const response = payload?.payload || payload;
    
    if (response?.messages?.length) {
      const serverMessages = parseMessages(response.messages);
      
      setMessages((prev) => {
        // Chỉ xóa message có createdAtLabel = "Đang gửi..."
        const filtered = prev.filter(m => m.createdAtLabel !== "Đang gửi...");
        
        //  Thêm message từ server
        return [...filtered, ...serverMessages];
      });
    }
  } catch (error) {
    console.error("Parse WebSocket message failed:", error);
  }
};

  // useChat.js - Sửa requestAdminHandoff
const requestAdminHandoff = async () => {
  //  Nếu chưa có conversation, tạo trước
  if (!conversationId) {
    console.log("No conversation, sending first message to create one...");
    await sendCurrentMessage();
    // Đợi một chút để conversation được tạo
    setTimeout(() => {
      if (conversationId) {
        performHandoff();
      }
    }, 500);
    return;
  }
  
  performHandoff();
};

const performHandoff = async () => {
  try {
    const client = createChatStompClient();
    if (client?.connected) {
      client.publish({
        destination: "/app/chat.handoff",
        body: JSON.stringify({}),
      });
    } else {
      await requestHandoffApi();
    }
    setMode("waiting");
  } catch (error) {
    console.error("Request handoff failed:", error);
  }
};

  const sendTypingIndicator = (convId, isTyping) => {
    const client = createChatStompClient();
    if (client?.connected && convId) {
      client.publish({
        destination: "/app/chat.typing",
        body: JSON.stringify({ conversationId: convId, isTyping }),
      });
    }
  };

  return {
    messages,
    mode,
    loading,
    input,
    setInput,
    sendCurrentMessage,
    requestAdminHandoff,
    sendTypingIndicator,
    canSend: input.trim().length > 0 && !loading,
    isAdmin: isAdminRoute,
    conversationId,
  };
}