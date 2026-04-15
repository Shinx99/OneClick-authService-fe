// components/features/chat/ChatQuickReplies.js
"use client";

const QUICK_REPLIES = {
  candidate: [
    { id: "find-job", icon: "🔍", label: "Tìm việc làm", message: "Tôi muốn tìm việc làm phù hợp" },
    { id: "create-cv", icon: "📝", label: "Tạo CV", message: "Hướng dẫn tạo CV chuyên nghiệp" },
    { id: "company-info", icon: "🏢", label: "Thông tin nhà tuyển dụng", message: "Cho tôi thông tin về các nhà tuyển dụng" },
    { id: "salary", icon: "💰", label: "Mức lương", message: "Mức lương trung bình cho vị trí của tôi là bao nhiêu?" },
    { id: "interview", icon: "🎯", label: "Phỏng vấn", message: "Kinh nghiệm phỏng vấn xin việc" },
    { id: "support", icon: "💬", label: "Hỗ trợ", message: "Tôi cần hỗ trợ từ admin" },
  ],
  recruiter: [
    { id: "post-job", icon: "📢", label: "Đăng tin tuyển dụng", message: "Tôi muốn đăng tin tuyển dụng" },
    { id: "find-candidate", icon: "👥", label: "Tìm ứng viên", message: "Tìm kiếm ứng viên phù hợp" },
    { id: "statistics", icon: "📊", label: "Thống kê", message: "Xem thống kê hiệu quả tuyển dụng" },
    { id: "manage-messages", icon: "💬", label: "Quản lý tin nhắn", message: "Quản lý tin nhắn từ ứng viên" },
    { id: "support", icon: "🎧", label: "Hỗ trợ", message: "Tôi cần hỗ trợ từ admin" },
  ],
};

export default function ChatQuickReplies({ userType, mode, onSelect, visible = true }) {
  // Tính toán trực tiếp, không cần useEffect
  const replies = mode === "ai" 
    ? (QUICK_REPLIES[userType] || QUICK_REPLIES.candidate) 
    : [];

  if (!visible || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-card-border bg-background/50">
      {replies.map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSelect(reply.message)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-card-bg border border-card-border text-text-main hover:bg-[#00c853]/10 hover:border-[#00c853]/30 hover:text-[#00c853] transition-all duration-200"
        >
          <span className="text-sm">{reply.icon}</span>
          <span>{reply.label}</span>
        </button>
      ))}
    </div>
  );
}