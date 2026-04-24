export const FormatTimeAgo = (dateString) => {
  if (!dateString) return "Mới cập nhật";

  let normalizedDate = dateString.replace(" ", "T");
  normalizedDate = normalizedDate.replace(" +", "+").replace(" -", "-");
  
  // Mẹo thêm: Thêm dấu ":" vào múi giờ (VD: +0700 thành +07:00) để chuẩn ISO 100%
  normalizedDate = normalizedDate.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');

  const date = new Date(normalizedDate);
  const now = new Date();

  const diffInSeconds = Math.floor((now - date) / 1000);

  // Xử lý các trường hợp hiển thị
  if (diffInSeconds < 0) return "Mới cập nhật"; 
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