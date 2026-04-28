export const FormatTime = (dateString) => {
  if (!dateString) return "Mới cập nhật";

  // Trên Windows (Chrome, Edge), bạn cứ ném thẳng chuỗi vào new Date()
  const date = new Date(dateString);

  // Vẫn nên giữ chốt chặn này đề phòng API lỗi, trả về chuỗi rác ("abc") thay vì ngày tháng
  if (isNaN(date.getTime())) {
    return "Mới cập nhật"; 
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Xử lý các trường hợp hiển thị
  if (diffInSeconds < 60) return "Vừa xong";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} tháng trước`;
};