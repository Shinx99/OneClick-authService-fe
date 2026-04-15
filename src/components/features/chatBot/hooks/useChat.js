"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  getMyConversation,
  requestHandoff as requestHandoffApi,
  sendMessage as sendMessageApi,
  createConversation as createConversationApi,
  closeUserConversation as closeUserConversationApi,
} from "@/services/chat.service";
import { createChatStompClient, getSharedChatClient } from "@/lib/chat/ws.client";

export function useChat() {
  const pathname = usePathname();
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState("ai");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const isAdminRoute = pathname?.startsWith("/admin");
  const hasInitialized = useRef(false);
  const messageIdCounter = useRef(0);

  const [showHandoffBanner, setShowHandoffBanner] = useState(false);
  const bannerTimeoutRef = useRef(null);

  // Parse messages từ API
  const parseMessages = useCallback((msgs) => {
    if (!msgs || !msgs.length) return [];
    
    return msgs.map((msg, idx) => {
      let sender = "USER";
      if (msg.senderType === "ai" || msg.senderType === "AI") sender = "AI";
      else if (msg.senderType === "admin") sender = "ADMIN";
      else if (msg.senderType === "system") sender = "SYSTEM";
      
      return {
        id: msg.id || `msg-${Date.now()}-${idx}`,
        sender: sender,
        content: msg.content || "",
        timestamp: msg.createdAt,
        timeLabel: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : "",
      };
    });
  }, []);

  // Load conversation
  const loadConversation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyConversation();
      const history = response?.data?.data || response?.data || {};
      
      if (history?.conversationId) {
        setConversationId(history.conversationId);
        setMessages(parseMessages(history.messages || []));
        
        if (history.status === "handoff") setMode("waiting");
        else if (history.status === "in_progress") setMode("admin");
        else setMode("ai");
      } else {
        setMessages([]);
        setConversationId(null);
        setMode("ai");
      }
    } catch (error) {
      if (error?.response?.status !== 400 && error?.response?.status !== 404) {
        console.error("Load conversation failed:", error);
      }
      setMessages([]);
      setConversationId(null);
    } finally {
      setLoading(false);
    }
  }, [parseMessages]);

   // Tạo conversation mới
  const createNewConversation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await createConversationApi();
      const result = response?.data?.data || response?.data;
      
      if (result?.conversationId) {
        setConversationId(result.conversationId);
        setMessages(parseMessages(result.messages || []));
        setMode("ai");
        console.log("Created new conversation:", result.conversationId);
        return result;
      }
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [parseMessages]);

  // Đóng conversation hiện tại
  const closeCurrentConversation = useCallback(async () => {
    if (!conversationId) {
      console.log("No active conversation to close");
      return;
    }
    
    setLoading(true);
    try {
      const response = await closeUserConversationApi(conversationId);
      const result = response?.data?.data || response?.data;
      
      console.log("Closed conversation:", conversationId);
      
      // Cập nhật messages và mode
      if (result?.messages) {
        setMessages(parseMessages(result.messages));
      }
      setMode("ai");
      
      return result;
    } catch (error) {
      console.error("Failed to close conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, parseMessages]);

  // Đóng và tạo conversation mới
  const closeAndCreateNew = useCallback(async () => {
    // Đóng conversation hiện tại
    await closeCurrentConversation();
    
    // Tạo conversation mới
    await createNewConversation();
  }, [closeCurrentConversation, createNewConversation]);

  // Xử lý tin nhắn từ WebSocket
  const handleWebSocketMessage = useCallback((frame) => {
    try {
      const payload = JSON.parse(frame.body);
      const response = payload?.payload || payload;
      const eventType = payload?.eventType;

      // Update mode dựa trên event
      if (eventType === "HANDOFF_REQUESTED") {
        setMode("waiting"); 
        setShowHandoffBanner(true);
      }
      if (eventType === "ADMIN_CLAIMED" || eventType === "CLAIMED") {
        setMode("admin");
        setShowHandoffBanner(false); 
      }

      // Xử lý SYSTEM_MESSAGE (tin nhắn system từ backend)
      if (eventType === "SYSTEM_MESSAGE" && response?.messages?.length) {
        const systemMessages = parseMessages(response.messages);
        console.log("📨 [User] System message received:", systemMessages);
        
        setMessages((prev) => {
          const existingMap = new Map(prev.map(m => [m.id, m]));
          systemMessages.forEach(msg => {
            if (!existingMap.has(msg.id)) {
              existingMap.set(msg.id, msg);
            }
          });
          return Array.from(existingMap.values());
        });
        return;
      }
        
      // Cập nhật conversationId nếu có
      if (response?.conversationId && !conversationId) {
        console.log("🔄 Updating conversationId from WebSocket:", response.conversationId);
        setConversationId(response.conversationId);
      }

      // xử lý khi conversation được đóng từ phía admin hoặc user tự đóng
      if (eventType === "CONVERSATION_CLOSED" || eventType === "CONVERSATION_CLOSED_BY_USER") {
        console.log("Conversation closed event received");
        setMode("ai");

        // reload conversation để lấy tin nhắn mới 
        loadConversation();
      }

      // cập nhật conversationId nếu có
      // if(response?.conversationId && !conversationId) {
      //   console.log("🔄 Updating conversationId from WebSocket:", response.conversationId)
      //   setConversationId(response.conversationId);
      // }

      // Xử lý tin nhắn mới
      if (response?.messages?.length) {
        const newMessages = parseMessages(response.messages);
        
        console.log("🔍 [DEBUG] Received WebSocket message:");
        console.log("  - eventType:", eventType);
        console.log("  - conversationId:", response.conversationId);
        console.log("  - messages:", newMessages.map(m => ({ id: m.id, content: m.content.substring(0, 30) })));
        
        setMessages((prev) => {
          console.log("  - Current messages count:", prev.length);
          const withoutTemp = prev.filter(msg => !msg.id?.startsWith('temp-'));
          
          const existingMap = new Map(withoutTemp.map(m => [m.id, m]));
          
          newMessages.forEach(msg => {
            if (!existingMap.has(msg.id)) {
              console.log("  - Adding NEW message:", msg.id);
              existingMap.set(msg.id, msg);
            } else {
              console.log("  - ⚠️ DUPLICATE ignored:", msg.id);
            }
          });
          
          const result = Array.from(existingMap.values());
          console.log("  - Result count:", result.length);
          return result;
        });
      }
    } catch (error) {
      console.error("Parse WebSocket message failed:", error);
    }
  }, [conversationId, parseMessages, loadConversation]);

  // WebSocket setup
  useEffect(() => {
    if (!conversationId || isAdminRoute) return;

    const topics = [
      {
        destination: `/topic/chat/${conversationId}`,
        callback: handleWebSocketMessage,
      },
    ];

    const client = createChatStompClient({
      subscribeTopics: topics,
      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    return () => {
      // Cleanup nếu cần
    };
  }, [conversationId, isAdminRoute, handleWebSocketMessage]);

  // Initial load
  useEffect(() => {
    if (isAdminRoute || hasInitialized.current) return;
    hasInitialized.current = true;
    loadConversation();
  }, [isAdminRoute, loadConversation]);


  // useChat.js - sendCurrentMessage
  const sendCurrentMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    const tempId = `temp-${Date.now()}-${messageIdCounter.current++}`;
    
    let currentConversationId = conversationId;
    let isNewConversation = false;

    if (currentConversationId && mode !== "ai") {
      console.log("📤 Sending admin message via WebSocket (no optimistic)");
      const client = getSharedChatClient();
      
      if (client?.connected) {
        client.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({ 
            conversationId: currentConversationId,
            message: messageText 
          }),
        });
      } else {
        // Fallback to HTTP
        console.log("📤 Sending via HTTP (WebSocket not connected)");
        await sendMessageApi({ 
          conversationId: currentConversationId, 
          message: messageText 
        });
      }
      setInput("");
      return; // Thoát luôn, không tạo temp message
    }
    
    // Optimistic update cho tin nhắn user
    const shouldOptimistic = mode === "ai" || !currentConversationId;
  
    let tempMessage = null;
    
    // Chỉ optimistic update khi cần
    if (shouldOptimistic) {
      tempMessage = {
        id: tempId,
        sender: "USER",
        content: messageText,
        timestamp: new Date().toISOString(),
        timeLabel: "Đang gửi...",
      };
      setMessages(prev => [...prev, tempMessage]);
    }
    
    //setMessages(prev => [...prev, tempMessage]);
    setInput("");

    try {
      // Nếu chưa có conversationId, tạo conversation mới qua API (sẽ có AI response)
      if (!currentConversationId) {
        console.log("📤 Creating new conversation via HTTP...");
        const response = await sendMessageApi({ message: messageText });
        const result = response?.data?.data || response?.data;
        
        if (result?.conversationId) {
          currentConversationId = result.conversationId;
          setConversationId(currentConversationId);
          isNewConversation = true;
          
          // Xóa temp message
          if (tempMessage) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
          }
          
          // Thêm messages từ API response (bao gồm user message + AI response)
          if (result?.messages?.length) {
            const serverMessages = parseMessages(result.messages);
            setMessages(prev => {
              const existingMap = new Map(prev.map(m => [m.id, m]));
              serverMessages.forEach(msg => {
                if (!existingMap.has(msg.id)) {
                  existingMap.set(msg.id, msg);
                }
              });
              return Array.from(existingMap.values());
            });
          }
          return; // Thoát vì đã có messages từ API
        } else {
          throw new Error("No conversationId returned");
        }
      }
      
      // Nếu đã có conversationId, gửi qua WebSocket
      const client = getSharedChatClient();
      
      if (client?.connected) {
        console.log("📤 Sending message via WebSocket, conversationId:", currentConversationId);
        client.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({ 
            conversationId: currentConversationId,
            message: messageText 
          }),
        });
        
        // Xóa temp message sau 1 giây (sẽ được thay bằng message thật từ WebSocket)
        // setTimeout(() => {
        //   setMessages(prev => prev.filter(m => m.id !== tempId));
        // }, 1000);
      } else {
        // Fallback to HTTP
        console.log("📤 Sending via HTTP (WebSocket not connected)");
        const response = await sendMessageApi({ 
          conversationId: currentConversationId, 
          message: messageText 
        });
        const result = response?.data?.data || response?.data;
        
        if (result?.messages?.length) {
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== tempId);
            const newMessages = parseMessages(result.messages);
            const existingMap = new Map(filtered.map(m => [m.id, m]));
            newMessages.forEach(msg => {
              if (!existingMap.has(msg.id)) {
                existingMap.set(msg.id, msg);
              }
            });
            return Array.from(existingMap.values());
          });
        }
      }
    } catch (error) {
      console.error("Send message failed:", error);
      setMessages(prev => prev.map(m => 
        m.id === tempId ? { ...m, content: `${m.content} (❌ Gửi thất bại)`, timeLabel: "Lỗi" } : m
      ));
    }
  }, [input, loading, conversationId, parseMessages, mode]);

  // Request handoff
  const requestAdminHandoff = useCallback(async () => {
    try {
      const client = getSharedChatClient();
      
      if (client?.connected && conversationId) {
        client.publish({
          destination: "/app/chat.handoff",
          body: JSON.stringify({}),
        });
      } else {
        await requestHandoffApi();
      }
      setMode("waiting");
      setShowHandoffBanner(true);

      // Tự động ẩn sau 30 giây nếu admin không claim
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current);
      }
      bannerTimeoutRef.current = setTimeout(() => {
        setShowHandoffBanner(false);
      }, 30000);

    } catch (error) {
      console.error("Request handoff failed:", error);
    }
  }, [conversationId]);

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current);
      }
    };
  }, []);

  // Typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    const client = getSharedChatClient();
    if (client?.connected && conversationId) {
      client.publish({
        destination: "/app/chat.typing",
        body: JSON.stringify({ conversationId, isTyping }),
      });
    }
  }, [conversationId]);

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
    createNewConversation,
    closeCurrentConversation,
    closeAndCreateNew,
    showHandoffBanner,
  };
}
