import { apiClient, testClient, getAccessToken } from "@/lib/apiClient/api.config";
import toast from "react-hot-toast";

export const resumeService = {
  /**
   * 1. Lấy danh sách CV của ứng viên
   * GET /api/profile/cvs
   */
  getResumes: async () => {
    try {
      const response = await apiClient.get('/profile/cvs');
      const apiResponse = response.data;

      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to fetch resumes');
      }

      const cvResponse = apiResponse.data;
      const cvs = cvResponse?.cvs || [];

      // Transform CvDto to frontend format - CHÚ Ý: field là 'filename' không phải 'fileName'
      return cvs.map(cv => ({
        id: cv.resumeId,
        name: cv.filename,        // Sửa: fileName -> filename
        updateAt: formatDate(cv.updatedAt),
        isDefault: cv.isDefault || false,
        url: getCvDownloadUrl(cv.filename),  // Sửa: fileName -> filename
        fileName: cv.filename,     // Sửa: fileName -> filename
        status: cv.status
      }));
    } catch (error) {
      console.error("Get resumes error:", error);
      return [];
    }
  },

  /**
   * 2. Tải lên CV mới
   * POST /api/profile/scan-cv
   */
  // services/resume.service.js
  // services/resume.service.js
  // uploadResume: async (file) => {
  //   try {
  //     console.log("📤 Uploading file:", {
  //       name: file.name,
  //       size: file.size,
  //       type: file.type
  //     });

  //     const formData = new FormData();
  //     formData.append("resumeFile", file); // Tên field = resumeFile

  //     // Log FormData content
  //     for (let pair of formData.entries()) {
  //       console.log("FormData entry:", pair[0], pair[1]);
  //     }

  //     const response = await apiClient.post('/profile/scan-cv', formData);

  //     console.log("📦 Upload response:", response.data);

  //     // Kiểm tra response
  //     if (response.data?.success && response.data?.data?.success !== false) {
  //       return { success: true };
  //     } else {
  //       throw new Error(response.data?.data?.message || response.data?.message || 'Upload failed');
  //     }
  //   } catch (error) {
  //     console.error("❌ Upload error:", error);
  //     throw error;
  //   }
  // },

  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);

      const token = getAccessToken();
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

      const response = await fetch(`${baseURL}/profile/scan-cv`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (data?.success) {
        return { success: true };
      } else {
        throw new Error(data?.message || 'Upload failed');
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },



  setDefaultResume: async (resumeId) => {
    if (!resumeId) {
      throw new Error('Invalid resume ID');
    }

    try {
      const response = await apiClient.patch(`/profile/cv/${resumeId}/default`);
      const apiResponse = response.data;

      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to set default resume');
      }

      return apiResponse;
    } catch (error) {
      console.error("Set default resume error:", error);
      throw error;
    }
  },

  deleteResume: async (resumeId) => {
    if (!resumeId || resumeId === 'undefined') {
      throw new Error('Invalid resume ID');
    }

    try {
      const response = await apiClient.delete(`/profile/cv/${resumeId}`);
      const apiResponse = response.data;

      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || 'Failed to delete resume');
      }

      return apiResponse;
    } catch (error) {
      console.error("Delete resume error:", error);
      throw error;
    }
  },

  downloadResume: async (fileName) => {
    if (!fileName || fileName === 'undefined') {
      throw new Error('Invalid file name');
    }

    try {
      const response = await apiClient.get(`/profile/cv/${encodeURIComponent(fileName)}`, {
        responseType: 'blob'
      });

      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const error = JSON.parse(text);
        throw new Error(error.message || 'Download failed');
      }

      return {
        blob: response.data,
        contentType: response.headers['content-type'] || 'application/pdf',
        fileName: fileName
      };
    } catch (error) {
      console.error("Download resume error:", error);
      throw error;
    }
  },

  previewResume: async (fileName) => {
    if (!fileName || fileName === 'undefined') {
      throw new Error('Invalid file name');
    }

    try {
      const response = await apiClient.get(`/profile/cv/stream/${encodeURIComponent(fileName)}`, {
        responseType: 'blob'
      });

      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const error = JSON.parse(text);
        throw new Error(error.message || 'Preview failed');
      }

      return {
        blob: response.data,
        contentType: response.headers['content-type'] || 'application/pdf'
      };
    } catch (error) {
      console.error("Preview resume error:", error);
      throw error;
    }
  },


  //------------------------------------------------------------------------------------------------------------
  // Vuong edit
  //------------------------------------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------------------------------
  // CV MARKET
  //------------------------------------------------------------------------------------------------------------

  // Fetch All
  fetchAllResumes: async ({ keyword = '', page = 0, size = 9 } = {}) => {
    const { data } = await apiClient.get("/recruitment/candidate/profile/resume/fetchAll", {
      params: {
        keyword: keyword || undefined,  // không gửi nếu rỗng -> BE se fetchAll
        page,
        size
      }
    });
    return data.data;
  },


  // Fetch Resume By Id
  fetchResumeByResumeId: async ({ resumeId }) => {
    const { data } = await apiClient.get(`recruitment/candidate/profile/resume/fetchResumeById/${resumeId}`);
    return data.data;
  },

  //------------------------------------------------------------------------------------------------------------
  // CV MARKET
  //------------------------------------------------------------------------------------------------------------


  fetchResume: async () => {
    const { data } = await apiClient.get("/recruitment/candidate/profile/resume/fetchData");
    return data.data;
  },


  updateCover: async (file) => {
    const formData = new FormData();
    formData.append("coverImage", file);
    const { data } = await apiClient.put("/recruitment/candidate/profile/resume/cover/update", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data.data;
  },


  deleteCover: async () => {
    await apiClient.delete("/recruitment/candidate/profile/resume/cover/delete");
  },


  updateResume: async (payload) => {
    const { data } = await apiClient.put("/recruitment/candidate/profile/resume/update", payload);
    //return data.data;
  },

  /**
   * Recruiter xem CV của candidate (có kiểm tra quyền)
   * GET /api/profile/cv/stream/{candidateId}/{fileName}
   */
  previewCandidateResume: async (candidateId, fileName) => {
    if (!fileName || !candidateId) {
      throw new Error('Invalid file name or candidate ID');
    }

    try {
      const response = await apiClient.get(`/profile/cv/stream/${candidateId}/${encodeURIComponent(fileName)}`, {
        responseType: 'blob'
      });

      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const error = JSON.parse(text);
        throw new Error(error.message || 'Preview failed');
      }

      return {
        blob: response.data,
        contentType: response.headers['content-type'] || 'application/pdf'
      };
    } catch (error) {
      console.error("Preview candidate resume error:", error);
      throw error;
    }
  },
};

// Helper functions
function formatDate(dateString) {
  if (!dateString) return 'Vừa xong';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return date.toLocaleDateString('vi-VN');
}

function extractFileNameFromUrl(url) {
  if (!url) return null;
  try {
    let fileName = url.split('/').pop();
    fileName = decodeURIComponent(fileName);
    fileName = fileName.split('?')[0];
    return fileName;
  } catch (e) {
    return null;
  }
}

function getCvDownloadUrl(fileName) {
  if (!fileName) return '';
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  return `${baseURL}/profile/cv/stream/${encodeURIComponent(fileName)}`;
}



export default resumeService;