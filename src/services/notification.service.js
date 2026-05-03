const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    type: "application",
    title: "Ứng viên mới",
    message: "Nguyễn Ngọc Hải vừa ứng tuyển vào vị trí Frontend Developer.",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "notif_2",
    type: "system",
    title: "Tin tuyển dụng sắp hết hạn",
    message: "Chiến dịch tuyển dụng 'Senior Java' sẽ hết hạn sau 3 ngày nữa.",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: "notif_3",
    type: "success",
    title: "Đăng tin thành công",
    message: "Tin tuyển dụng 'Business Analyst' của bạn đã được duyệt.",
    time: "1 ngày trước",
    read: true,
  },
];

export const notificationService = {
  getRecentNotifications: async () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve({ success: true, data: MOCK_NOTIFICATIONS.slice(0, 5) }),
        300,
      );
    });
  },
  getAllNotifications: async (page = 0, size = 10) => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve({ success: true, data: { content: MOCK_NOTIFICATIONS } }),
        500,
      );
    });
  },
  markAllAsRead: async () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 300),
    );
  },
};
