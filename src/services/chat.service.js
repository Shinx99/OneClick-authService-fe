import apiClient from "@/lib/apiClient/api.config";

// ==================== USER APIS ====================
export const getMyConversation = () => 
  apiClient.get("/chatbot/me/conversation");

export const getMyConversationById = (conversationId) =>
  apiClient.get(`/chatbot/me/conversations/${conversationId}`);

export const sendMessage = (dto) => 
  apiClient.post("/chatbot/me/messages", dto);

export const requestHandoff = () => 
  apiClient.post("/chatbot/me/handoff");

// Tạo conversation mới
export const createConversation = () => 
  apiClient.post("/chatbot/me/conversation");

// Get messages với phân trang (QUAN TRỌNG)
export const getMessagesWithPagination = (conversationId, page = 0, size = 20) =>
  apiClient.get(`/chatbot/me/conversations/${conversationId}/messages`, {
    params: { page, size }
  });

// Load more messages (infinite scroll)
export const loadMoreMessages = (conversationId, beforeDate, limit = 20) =>
  apiClient.get(`/chatbot/me/conversations/${conversationId}/messages/load-more`, {
    params: { beforeDate, limit }
  });

// Get new messages since last sync (cho realtime)
export const getNewMessagesSince = (conversationId, sinceDate) =>
  apiClient.get(`/chatbot/me/conversations/${conversationId}/messages/new`, {
    params: { sinceDate }
  });

// Mark messages as read
export const markMessagesAsRead = (conversationId) =>
  apiClient.post(`/chatbot/me/conversations/${conversationId}/read`);

// Get unread messages
export const getUnreadMessages = (conversationId) =>
  apiClient.get(`/chatbot/me/conversations/${conversationId}/unread`);

// ==================== ADMIN APIS ====================
// Lấy danh sách theo status (handoff, in_progress, closed)
export const getAdminConversationsByStatus = (status) =>
  apiClient.get(`/chatbot/admin/conversations/status/${status}`);

// Lấy grouped (3 tab cùng lúc)
export const getAdminConversationsGrouped = () =>
  apiClient.get("/chatbot/admin/conversations/grouped");

// Lấy conversation đã nhận của admin
export const getMyAssignedConversations = () =>
  apiClient.get("/chatbot/admin/conversations/my-assigned");

// Lấy waiting conversations (handoff)
export const getWaitingConversations = () =>
  apiClient.get("/chatbot/admin/conversations/waiting");

// Lấy tất cả conversations (có filter status)
export const getAdminConversations = (status = null) =>
  apiClient.get("/chatbot/admin/conversations", {
    params: status ? { status } : {}
  });

// Lấy history chi tiết
export const getAdminConversationHistory = (conversationId) =>
  apiClient.get(`/chatbot/admin/conversations/${conversationId}`);

// Get messages với phân trang cho admin
export const getAdminMessagesWithPagination = (conversationId, page = 0, size = 20) =>
  apiClient.get(`/chatbot/admin/conversations/${conversationId}/messages`, {
    params: { page, size }
  });

// Load more messages cho admin
export const adminLoadMoreMessages = (conversationId, beforeDate, limit = 20) =>
  apiClient.get(`/chatbot/admin/conversations/${conversationId}/messages/load-more`, {
    params: { beforeDate, limit }
  });

// Claim conversation
export const claimConversation = (conversationId) =>
  apiClient.post(`/chatbot/admin/conversations/${conversationId}/claim`);

// Close conversation
export const closeConversation = (conversationId) =>
  apiClient.post(`/chatbot/admin/conversations/${conversationId}/close`);

// Admin send message (REST)
export const adminSendMessage = (conversationId, message) =>
  apiClient.post(`/chatbot/admin/conversations/${conversationId}/messages`, { message });

// Convenience functions
export const getInProgressConversations = () =>
  getAdminConversationsByStatus("in_progress");

export const getClosedConversations = () =>
  getAdminConversationsByStatus("closed");

// User close conversation
export const closeUserConversation = (conversationId) =>
  apiClient.post(`/chatbot/me/conversations/${conversationId}/close`);