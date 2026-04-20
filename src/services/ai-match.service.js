// services/ai-match.service.js
import apiClient from "@/lib/apiClient/api.config";

const API_BASE = "/ai-cv-match";

export const aiMatchService = {
  /**
   * Match với resume đã lưu (có cache tự động qua backend)
   * @param {string} resumeId - ID của resume
   * @param {string} jobId - ID của job
   * @returns {Promise<Object>} Kết quả match
   */
  matchWithResume: async (resumeId, jobId) => {
    const response = await apiClient.post(`${API_BASE}/resume/${resumeId}/job/${jobId}`);
    return response.data;
  },

  /**
   * Match với file mới upload
   * @param {string} jobId - ID của job
   * @param {File} file - File CV cần upload
   * @returns {Promise<Object>} Kết quả match
   */
  matchWithNewFile: async (jobId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`${API_BASE}/new/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Match với S3 URL (external CV)
   * @param {string} jobId - ID của job
   * @param {string} cvS3Url - S3 URL của CV
   * @returns {Promise<Object>} Kết quả match
   */
  matchWithS3Url: async (jobId, cvS3Url) => {
    const response = await apiClient.post(`${API_BASE}/s3/${jobId}`, { cvS3Url });
    return response.data;
  },

  /**
   * Match với cached data (nhanh nhất - dùng khi có parsedData từ resume)
   * @param {string} jobId - ID của job
   * @param {string} parsedCvJson - JSON string của parsed CV
   * @returns {Promise<Object>} Kết quả match
   */
  matchWithCache: async (jobId, parsedCvJson) => {
    const response = await apiClient.post(`${API_BASE}/cache/${jobId}`, { parsedCvJson });
    return response.data;
  },

   // ========== CONSULTANT APIs ==========

  /**
   * Chat tư vấn với AI dựa trên CV và Job đã match
   * @param {string} jobId - ID của job
   * @param {Object} parsedCv - Dữ liệu CV đã parse (từ matchResult.parsedCv)
   * @param {string} question - Câu hỏi của người dùng
   * @param {string} sessionId - Session ID để duy trì context
   * @returns {Promise<Object>} Câu trả lời từ AI
   */
  consultantChat: async (jobId, parsedCv, question, sessionId) => {
    const response = await apiClient.post(`${API_BASE}/consultant/chat`, {
      jobId,
      parsedCv,
      question,
      sessionId
    });
    return response.data;
  },

  /**
   * Tạo câu hỏi phỏng vấn dựa trên CV và Job
   * @param {string} jobId - ID của job
   * @param {Object} parsedCv - Dữ liệu CV đã parse
   * @returns {Promise<Object>} Danh sách câu hỏi phỏng vấn
   */
  generateInterviewQuestions: async (jobId, parsedCv) => {
    const response = await apiClient.post(`${API_BASE}/consultant/interview-questions`, {
      jobId,
      parsedCv
    });
    return response.data;
  },

  /**
   * Lấy gợi ý cải thiện CV
   * @param {string} jobId - ID của job
   * @param {Object} parsedCv - Dữ liệu CV đã parse
   * @param {string} specificQuestion - Câu hỏi cụ thể (optional)
   * @returns {Promise<Object>} Gợi ý cải thiện
   */
  getImprovementAdvice: async (jobId, parsedCv, specificQuestion = null) => {
    const response = await apiClient.post(`${API_BASE}/consultant/improve-cv`, {
      jobId,
      parsedCv,
      question: specificQuestion
    });
    return response.data;
  }
};