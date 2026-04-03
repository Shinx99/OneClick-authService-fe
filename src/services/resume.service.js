// src/services/resume.service.js
import { apiClient } from "@/lib/apiClient/api.config";

export const resumeService = {
  /**
   * 1. Lấy danh sách CV của ứng viên
   */
  getResumes: async () => {
    // KHI CÓ API THẬT, MỞ COMMENT:
    // const response = await apiClient.get(`/candidates/resumes`);
    // return response.data; // Tuỳ theo cấu trúc response của BE (VD: response.data.data)

    // HIỆN TẠI MOCK DATA ĐỂ TEST UI (Giả lập delay 1s)
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "CV_Frontend_Developer.pdf",
            updateAt: "2 ngày trước",
            isDefault: true,
            url: "/sample.pdf",
          },
          {
            id: 2,
            name: "Le_Hoang_Trung_Resume.pdf",
            updateAt: "1 tuần trước",
            isDefault: false,
            url: "/sample2.pdf",
          },
        ]);
      }, 1000),
    );
  },

  /**
   * 2. Tải lên CV mới (Xử lý FormData)
   */
  uploadResume: async (file) => {
    // KHI CÓ API THẬT, MỞ COMMENT:
    // const formData = new FormData();
    // formData.append("file", file);

    // Lưu ý: apiClient mặc định là 'application/json', nhưng khi truyền FormData,
    // trình duyệt sẽ tự động set 'multipart/form-data' với đúng boundary.
    // Nếu BE yêu cầu chặt, có thể truyền thêm cấu hình headers như dưới.

    // const response = await apiClient.post(`/candidates/resumes/upload`, formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });
    // return response.data;

    // HIỆN TẠI MOCK DATA ĐỂ TEST UI (Giả lập delay 1.5s)
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id: Date.now(),
          name: file.name,
          updateAt: "Vừa xong",
          isDefault: false,
          url: URL.createObjectURL(file), // Tạo URL tạm để preview ở FE
        });
      }, 1500),
    );
  },

  /**
   * 3. Cập nhật CV mặc định
   */
  setDefaultResume: async (id) => {
    // KHI CÓ API THẬT, MỞ COMMENT:
    // await apiClient.patch(`/candidates/resumes/${id}/set-default`);

    // HIỆN TẠI MOCK DATA ĐỂ TEST UI (Giả lập delay 500ms)
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500),
    );
  },

  /**
   * 4. Xóa CV
   */
  deleteResume: async (id) => {
    // KHI CÓ API THẬT, MỞ COMMENT:
    // await apiClient.delete(`/candidates/resumes/${id}`);

    // HIỆN TẠI MOCK DATA ĐỂ TEST UI (Giả lập delay 500ms)
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500),
    );
  },
};
