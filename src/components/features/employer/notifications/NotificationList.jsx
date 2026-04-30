"use client";
import React, { useState, useEffect } from "react";
import { notificationService } from "@/services/notification.service";
import { MdDoneAll, MdInfoOutline } from "react-icons/md";
import NotificationItem from "./NotificationItem";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAllNotifs = async () => {
      const res = await notificationService.getAllNotifications();
      if (res.success) setNotifications(res.data.content);
      setLoading(false);
    };
    fetchAllNotifs();
  }, []);

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const displayNotifs =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-max">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === "all" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === "unread" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
          >
            Chưa đọc{" "}
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <MdDoneAll size={18} /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="p-0">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : displayNotifs.length > 0 ? (
          <div className="flex flex-col">
            {displayNotifs.map((notif) => (
              <NotificationItem key={notif.id} notif={notif} variant="list" />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <MdInfoOutline className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Không có thông báo nào phù hợp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
