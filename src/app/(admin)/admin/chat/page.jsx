"use client";

import AdminChatPanel from "@/components/features/admin/chat/AdminChatPanel";

export default function AdminChatPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Hỗ trợ trực tuyến
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Quản lý và trả lời tin nhắn từ người dùng
        </p>
      </div>
      
      <div className="flex-1 min-h-0 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <AdminChatPanel />
      </div>
    </div>
  );
}