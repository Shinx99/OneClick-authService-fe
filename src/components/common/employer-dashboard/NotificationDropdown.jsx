"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdOutlineNotifications } from "react-icons/md";
import { notificationService } from "@/services/notification.service";
import NotificationItem from "@/components/features/employer/notifications/NotificationItem";

const NotificationDropdown = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      const res = await notificationService.getRecentNotifications();
      if (res.success) setNotifications(res.data);
      setLoading(false);
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target))
        setShowNotif(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setShowNotif(!showNotif)}
        className={`relative p-2.5 rounded-xl transition-all ${showNotif ? "bg-emerald-50 text-emerald-600 dark:bg-slate-800" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"}`}
      >
        <MdOutlineNotifications className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-[#0f172a] px-1 animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotif && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-[360px] bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto custom-scrollbar relative">
            {loading ? (
              <div className="py-10 text-center text-sm text-slate-500">
                Đang tải...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  variant="dropdown"
                />
              ))
            ) : (
              <div className="py-10 text-center text-[13px] text-slate-500">
                Bạn chưa có thông báo nào mới.
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <Link
              href="/employer/notifications"
              onClick={() => setShowNotif(false)}
              className="text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors inline-block w-full"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
