"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  claimConversation as claimConversationApi,
  closeConversation as closeConversationApi,
  getAdminConversationHistory,
  getAdminConversationsByStatus,
  adminSendMessage,
} from "@/services/chat.service";
import {
  createChatStompClient,
  disconnectSharedChatClient,
  getSharedChatClient,
} from "@/lib/chat/ws.client";

export function useAdminChat() {
  const [waitingConversations, setWaitingConversations] = useState([]);
  const [inProgressConversations, setInProgressConversations] = useState([]);
  const [closedConversations, setClosedConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});
  const { user } = useAuth();
  const adminId = user?.id;
  const subscriptionsRef = useRef([]);
  const activeConvSubRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const getUserDisplayName = useCallback((userType, userId) => {
    if (userType === "candidate") return "Ứng viên";
    if (userType === "recruiter") return "Nhà tuyển dụng";
    return `User ${userId?.slice(0, 8)}`;
  }, []);

  const activeConversationIdRef = useRef(null);
  const isReconnectingRef = useRef(false);
  const [wsConnected, setWsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const isRefreshingRef = useRef(false); // Thêm flag để tránh refresh loop
  const stableCallbacks = useRef({});

  const parseMessages = useCallback((messages) => {
    if (!messages || !messages.length) return [];
    return messages.map((msg, idx) => ({
      id: msg.id || msg.messageId || `${idx}`,
      sender: msg.senderType === "admin" ? "ADMIN" : 
              msg.senderType === "ai" ? "AI" : "USER",
      content: msg.content,
      createdAt: msg.createdAt,
      createdAtLabel: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : "",
    }));
  }, []); // Không có dependencies -> ổn định

  // 3. Tạo stable references
  const stableRefreshWaitingList = useCallback(async () => {
    // ... code
  }, [getUserDisplayName]); // getUserDisplayName ổn định

  const stableRefreshInProgressList = useCallback(async () => {
    // ... code
  }, [getUserDisplayName]); // Bỏ activeConversation khỏi dependencies

  // 4. SỬA useEffect WebSocket - giảm dependencies
  useEffect(() => {
    if (!adminId) return;

    let isMounted = true;
    let cleanup = null;

    const init = async () => {
      await loadAllConversations();

      const subscribeTopics = [
        {
          destination: "/topic/admin/waiting-conversations",
          callback: () => {
            if (!isReconnectingRef.current && isMounted) {
              refreshWaitingList();
              playNotificationSound();
            }
          },
        },
        {
          destination: `/user/${adminId}/queue/admin/messages`,
          callback: handleAdminQueueMessage,
          userSpecific: true,
        },
        {
          destination: "/topic/admin/broadcast",
          callback: handleBroadcastMessage,
        },
      ];

      const client = createChatStompClient({
        subscribeTopics,
        onStompError: (frame) => console.error("Admin STOMP error", frame),
        onConnect: () => {
          if (!isMounted) return;
          console.log("✅ Admin WebSocket connected");
          isReconnectingRef.current = false;
          loadAllConversations();
          
          if (activeConversationIdRef.current) {
            console.log("🔄 Re-subscribing to active conversation:", activeConversationIdRef.current);
            subscribeToConversation(activeConversationIdRef.current);
            
            getAdminConversationHistory(activeConversationIdRef.current)
              .then(historyResponse => {
                if (!isMounted) return;
                const history = historyResponse?.data?.data || historyResponse?.data || {};
                setActiveConversation(prev => ({
                  ...prev,
                  messages: parseMessages(history.messages || []),
                  lastMessagePreview: history.lastMessagePreview,
                  lastMessageAt: history.lastMessageAt,
                }));
              })
              .catch(err => console.error("Failed to reload conversation after reconnect:", err));
          }
        },
        onDisconnect: () => {
          console.log("⚠️ Admin WebSocket disconnected");
          isReconnectingRef.current = true;
        },
      });

      cleanup = () => {
        if (activeConvSubRef.current) {
          try {
            activeConvSubRef.current.unsubscribe();
          } catch (e) {}
          activeConvSubRef.current = null;
        }
        subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
        subscriptionsRef.current = [];
        disconnectSharedChatClient();
      };
    };

    init();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [adminId]); 

  const loadAllConversations = useCallback(async () => {
    if (!adminId) return;
    
    setLoading(true);
    try {
      const [waitingRes, inProgressRes, closedRes] = await Promise.all([
        getAdminConversationsByStatus("handoff"),
        getAdminConversationsByStatus("in_progress"),
        getAdminConversationsByStatus("closed"),
      ]);
      
      const waiting = waitingRes?.data?.data || waitingRes?.data || [];
      const inProgress = inProgressRes?.data?.data || inProgressRes?.data || [];
      const closed = closedRes?.data?.data || closedRes?.data || [];
      
      const mapConversation = (c) => ({
        ...c,
        displayName: c.userFullName || c.userEmail || `${c.userType === "candidate" ? "Ứng viên" : "Nhà tuyển dụng"}`
      });
      
      setWaitingConversations(waiting.map(mapConversation));
      setInProgressConversations(inProgress.map(mapConversation));
      setClosedConversations(closed.map(mapConversation));
    } catch (error) {
      console.error("Load conversations failed", error);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  const refreshWaitingList = useCallback(async () => {
    try {
      const response = await getAdminConversationsByStatus("handoff");
      const data = response?.data?.data || response?.data || [];
      setWaitingConversations(data.map(c => ({
        ...c,
        userName: getUserDisplayName(c.userType, c.userId)
      })));
    } catch (error) {
      console.error("Refresh waiting list failed", error);
    }
  }, [getUserDisplayName]);

  // refreshInProgressList - KHÔNG phụ thuộc vào activeConversation
  const refreshInProgressList = useCallback(async () => {
    // Tránh refresh loop
    if (isRefreshingRef.current) {
      console.log("⏸️ Already refreshing, skipping");
      return;
    }
    
    isRefreshingRef.current = true;
    try {
      const response = await getAdminConversationsByStatus("in_progress");
      const data = response?.data?.data || response?.data || [];
      
      if (isReconnectingRef.current) {
        console.log("⏸️ Skipping refresh during reconnect");
        return;
      }
      
      // Chỉ cập nhật danh sách, KHÔNG dùng activeConversation
      setInProgressConversations(data.map(c => ({
        ...c,
        userName: c.userFullName || c.userEmail || getUserDisplayName(c.userType, c.userId)
      })));
    } catch (error) {
      console.error("Refresh in-progress list failed", error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [getUserDisplayName]);

  const refreshClosedList = useCallback(async () => {
    try {
      const response = await getAdminConversationsByStatus("closed");
      const data = response?.data?.data || response?.data || [];
      setClosedConversations(data.map(c => ({
        ...c,
        userName: getUserDisplayName(c.userType, c.userId)
      })));
    } catch (error) {
      console.error("Refresh closed list failed", error);
    }
  }, [getUserDisplayName]);

  const playNotificationSound = useCallback(() => {
    try {
      // Kiểm tra xem file có tồn tại không trước khi play
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.3;
      
      // Thêm event listener để bắt lỗi load
      audio.addEventListener('error', (e) => {
        console.log("Notification sound file not found, skipping");
      });
      
      audio.play().catch(e => {
        console.log("Audio play failed:", e.message);
      });
    } catch (error) {
      console.log("Sound notification not supported");
    }
  }, []);

  const subscribeToConversation = useCallback((conversationId) => {
    const client = getSharedChatClient();
    if (!client?.connected) return;

    if (activeConvSubRef.current) {
      try {
        activeConvSubRef.current.unsubscribe();
      } catch (e) {
        console.log("Unsubscribe error:", e);
      }
      activeConvSubRef.current = null;
    }

    console.log("🔵 [Admin] Subscribing to conversation:", conversationId);
    
    const sub = client.subscribe(`/topic/chat/${conversationId}`, (frame) => {
      try {
        const payload = JSON.parse(frame.body);
        const response = payload?.payload || payload;
        const eventType = payload?.eventType;

         // Xử lý CONVERSATION_CLOSED ở TRONG callback
      if (eventType === "CONVERSATION_CLOSED") {
        console.log("📨 [Admin] Conversation closed in topic:", conversationId);
        if (activeConversation?.conversationId === conversationId) {
          setActiveConversation(null);
        }
        return;
      }
        
        if (eventType === "TYPING") {
          const { userId, isTyping } = payload;
          if (isTyping) {
            setTypingUsers(prev => ({ ...prev, [conversationId]: userId }));
            setTimeout(() => {
              setTypingUsers(prev => {
                if (prev[conversationId] === userId) {
                  const newState = { ...prev };
                  delete newState[conversationId];
                  return newState;
                }
                return prev;
              });
            }, 3000);
          } else {
            setTypingUsers(prev => {
              const newState = { ...prev };
              delete newState[conversationId];
              return newState;
            });
          }
          return;
        }
        
        if (response?.messages?.length) {
          const newMessage = response.messages[0];
          const isAdminMessage = newMessage.senderType === "admin";
          
          if (isAdminMessage) {
            console.log("📨 [Admin] Admin message received, updating UI");
            
            setActiveConversation(prev => {
              if (!prev || prev.conversationId !== conversationId) return prev;
              
              const isDuplicate = prev.messages?.some(m => m.id === newMessage.id);
              if (isDuplicate) return prev;
              
              const updatedMessages = [...(prev.messages || []), {
                id: newMessage.id || `msg-${Date.now()}`,
                sender: "ADMIN",
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                createdAtLabel: "Vừa xong",
              }];
              
              return {
                ...prev,
                messages: updatedMessages,
                lastMessagePreview: newMessage.content,
                lastMessageAt: new Date().toISOString(),
              };
            });
          }
        }
      } catch (error) {
        console.error("Parse message failed:", error);
      }
    });
    activeConvSubRef.current = sub;
  }, [activeConversation]);

  const handleAdminQueueMessage = useCallback((frame) => {
    try {
      const payload = JSON.parse(frame.body);
      console.log("📨 [Admin] Queue message received:", payload);
      
      const response = payload?.payload || payload;
      const eventType = payload?.eventType;

      // Xử lý CONVERSATION_CLOSED
    if (eventType === "CONVERSATION_CLOSED") {
      console.log("📨 [Admin] Conversation closed, refreshing lists");
      refreshWaitingList();
      refreshInProgressList();
      refreshClosedList();
      
      // Nếu conversation đang active, đóng nó
      if (activeConversation?.conversationId === response?.conversationId) {
        setActiveConversation(null);
      }
      
      playNotificationSound();
      return;
    }

      if (eventType === "USER_MESSAGE" && response?.messages?.length) {
        const userMessage = response.messages[0];
        const receivedConversationId = response.conversationId;
        
        if (activeConversation?.conversationId === receivedConversationId) {
          setActiveConversation(prev => {
            if (!prev) return prev;
            
            const isDuplicate = prev.messages?.some(m => m.id === userMessage.id);
            if (isDuplicate) return prev;
            
            const newMessage = {
              id: userMessage.id || `user-${Date.now()}`,
              sender: "USER",
              content: userMessage.content,
              createdAt: userMessage.createdAt,
              createdAtLabel: "Vừa xong",
            };
            
            const updatedMessages = [...(prev.messages || []), newMessage];
            
            return {
              ...prev,
              messages: updatedMessages,
              lastMessagePreview: userMessage.content,
              lastMessageAt: new Date().toISOString(),
            };
          });
          
          playNotificationSound();
        } else {
          refreshInProgressList();
          playNotificationSound();
        }
      }
      
      if (eventType === "HANDOFF_REQUESTED") {
        refreshWaitingList();
        playNotificationSound();
      }
    } catch (error) {
      console.error("Admin queue message parse failed", error);
    }
  }, [activeConversation, refreshInProgressList, refreshWaitingList, refreshClosedList, playNotificationSound]);

  const handleBroadcastMessage = useCallback((frame) => {
    try {
      // Kiểm tra frame có body không
      if (!frame || !frame.body) {
        console.log("📨 [Admin] Empty broadcast message, skipping");
        return;
      }
      
      const payload = JSON.parse(frame.body);
      console.log("📨 [Admin] Broadcast received:", payload);
      
      const eventType = payload.eventType;
      const response = payload.payload;

      // Xử lý CONVERSATION_CLOSED
    if (eventType === "CONVERSATION_CLOSED") {
      console.log("📨 [Admin] Conversation closed via broadcast, refreshing lists");
      refreshWaitingList();
      refreshInProgressList();
      refreshClosedList();
      
      if (activeConversation?.conversationId === response?.conversationId) {
        setActiveConversation(null);
      }
      
      playNotificationSound();
      return;
    }
      
      if (eventType === "USER_MESSAGE" && response?.messages?.length) {
        const userMessage = response.messages[0];
        const receivedConversationId = response.conversationId;
        
        console.log("📨 [Admin] User message via broadcast:", {
          conversationId: receivedConversationId,
          activeConversationId: activeConversation?.conversationId,
          message: userMessage.content
        });
        
        // LUÔN cập nhật activeConversation nếu đúng conversationId
        setActiveConversation(prev => {
          // Nếu chưa có activeConversation hoặc không phải conversation này
          if (!prev || prev.conversationId !== receivedConversationId) {
            console.log("📨 [Admin] Not active conversation, skipping UI update");
            return prev;
          }
          
          // Kiểm tra duplicate message
          const isDuplicate = prev.messages?.some(m => 
            m.id === userMessage.id || 
            (m.content === userMessage.content && 
            new Date(m.createdAt).getTime() === new Date(userMessage.createdAt).getTime())
          );
          
          if (isDuplicate) {
            console.log("📨 [Admin] Duplicate message, skipping");
            return prev;
          }
          
          console.log("📨 [Admin] Adding new message to active conversation");
          const newMessage = {
            id: userMessage.id || `user-${Date.now()}`,
            sender: "USER",
            content: userMessage.content,
            createdAt: userMessage.createdAt,
            createdAtLabel: "Vừa xong",
          };
          
          const updatedMessages = [...(prev.messages || []), newMessage];
          
          // Cập nhật cả inProgressConversations để đồng bộ danh sách
          setInProgressConversations(prevList => 
            prevList.map(conv => 
              conv.conversationId === receivedConversationId
                ? { 
                    ...conv, 
                    messages: updatedMessages, 
                    lastMessagePreview: userMessage.content,
                    lastMessageAt: new Date().toISOString()
                  }
                : conv
            )
          );
          
          return {
            ...prev,
            messages: updatedMessages,
            lastMessagePreview: userMessage.content,
            lastMessageAt: new Date().toISOString(),
          };
        });
        
        playNotificationSound();
      }
    } catch (error) {
      console.error("Parse broadcast failed:", error);
    }
  }, [activeConversation, refreshWaitingList, refreshInProgressList, refreshClosedList, playNotificationSound]);

  useEffect(() => {
    if (activeConversation?.conversationId) {
      activeConversationIdRef.current = activeConversation.conversationId;
      console.log("💾 Saved active conversation ID:", activeConversationIdRef.current);
    }
  }, [activeConversation]);


  const sendTypingIndicator = useCallback((conversationId, isTyping) => {
    const client = getSharedChatClient();
    if (!client?.connected || !conversationId) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    client.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({ conversationId, isTyping }),
    });
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        client.publish({
          destination: "/app/chat.typing",
          body: JSON.stringify({ conversationId, isTyping: false }),
        });
      }, 2000);
    }
  }, []);

  const claimConversation = async (conversationId) => {
    try {
      console.log("🔵 [Admin] Claiming conversation:", conversationId);
      await claimConversationApi(conversationId);
      
      const historyResponse = await getAdminConversationHistory(conversationId);
      const history = historyResponse?.data?.data || historyResponse?.data || {};
      
      const newConversation = {
        conversationId: history.conversationId,
        userId: history.userId,
        userType: history.userType,
        userFullName: history.userFullName,
        userEmail: history.userEmail,
        userAvatar: history.userAvatar,
        displayName: history.userFullName || history.userEmail || `${history.userType === "candidate" ? "Ứng viên" : "Nhà tuyển dụng"}`,
        status: history.status,
        messages: parseMessages(history.messages || []),
        lastMessagePreview: history.lastMessagePreview,
        lastMessageAt: history.lastMessageAt,
      };
      
      setActiveConversation(newConversation);
      subscribeToConversation(conversationId);
      await refreshWaitingList();
      await refreshInProgressList();
      
      console.log("🔵 [Admin] Conversation claimed successfully");
    } catch (error) {
      console.error("Claim conversation failed:", error);
    }
  };

  const openConversation = async (conversationId, status) => {
    try {
      const historyResponse = await getAdminConversationHistory(conversationId);
      const history = historyResponse?.data?.data || historyResponse?.data || {};
      
      setActiveConversation({
        conversationId: history.conversationId,
        userName: getUserDisplayName(history.userType, history.userId),
        userType: history.userType,
        status: history.status,
        messages: parseMessages(history.messages || []),
        lastMessagePreview: history.lastMessagePreview,
        lastMessageAt: history.lastMessageAt,
      });
      
      if (status !== "closed") {
        subscribeToConversation(conversationId);
      }
    } catch (error) {
      console.error("Open conversation failed:", error);
    }
  };

  const closeConversation = async (conversationId) => {
    try {
      await closeConversationApi(conversationId);
      setActiveConversation(null);
      
      if (activeConvSubRef.current) {
        try {
          activeConvSubRef.current.unsubscribe();
        } catch (e) {}
        activeConvSubRef.current = null;
      }
      
      await loadAllConversations();
    } catch (error) {
      console.error("Close conversation failed:", error);
    }
  };

  const sendAdminMessage = async (conversationId, message) => {
    const client = getSharedChatClient();
    
    if (client?.connected) {
      client.publish({
        destination: "/app/admin.chat.send",
        body: JSON.stringify({ conversationId, message }),
      });
    } else {
      try {
        await adminSendMessage(conversationId, message);
      } catch (error) {
        console.error("Send message failed:", error);
        return;
      }
    }

  };

  const isUserTyping = (conversationId) => {
    return !!typingUsers[conversationId];
  };

  return {
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
    loadAllConversations,
  };
}