import apiClient from "@/lib/apiClient/api.config";

export const getMyConversation = () => apiClient.get("/chatbot/me/conversation");

export const getMyConversationById = (conversationId) =>
  apiClient.get(`/chatbot/me/conversations/${conversationId}`);

export const sendMessage = (dto) => apiClient.post("/chatbot/me/messages", dto);

export const requestHandoff = () => apiClient.post("/chatbot/me/handoff");

export const getWaitingConversations = () =>
  apiClient.get("/chatbot/admin/conversations");

export const getAdminConversationHistory = (conversationId) =>
  apiClient.get(`/chatbot/admin/conversations/${conversationId}`);

export const claimConversation = (conversationId) =>
  apiClient.post(`/chatbot/admin/conversations/${conversationId}/claim`);

export const closeConversation = (conversationId) =>
  apiClient.post(`/chatbot/admin/conversations/${conversationId}/close`);