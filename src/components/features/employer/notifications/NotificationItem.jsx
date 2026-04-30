"use client";
import React from "react";
import {
  MdPersonOutline,
  MdInfoOutline,
  MdCheckCircleOutline,
} from "react-icons/md";

const NotificationItem = ({ notif, variant = "list", onClick }) => {
  const isDropdown = variant === "dropdown";

  const getNotifIcon = (type) => {
    const iconSize = isDropdown ? "w-5 h-5" : "w-6 h-6";
    switch (type) {
      case "application":
        return <MdPersonOutline className={`${iconSize} text-blue-500`} />;
      case "success":
        return (
          <MdCheckCircleOutline className={`${iconSize} text-emerald-500`} />
        );
      default:
        return <MdInfoOutline className={`${iconSize} text-amber-500`} />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex ${isDropdown ? "gap-4 p-4" : "gap-5 p-6"} border-b border-slate-100 dark:border-slate-800/50 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 last:border-0 ${
        !notif.read ? "bg-emerald-50/20 dark:bg-emerald-900/10" : ""
      }`}
    >
      <div
        className={`${isDropdown ? "w-10 h-10" : "w-12 h-12"} rounded-full flex items-center justify-center shrink-0 ${
          !notif.read
            ? "bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-100 dark:ring-slate-700"
            : "bg-slate-100 dark:bg-slate-800/50"
        }`}
      >
        {getNotifIcon(notif.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`flex ${isDropdown ? "flex-col" : "justify-between items-start gap-4"}`}
        >
          <h4
            className={`${isDropdown ? "text-[13px] truncate" : "text-[15px]"} ${
              !notif.read
                ? "font-bold text-slate-800 dark:text-slate-100"
                : "font-semibold text-slate-600 dark:text-slate-300"
            }`}
          >
            {notif.title}
          </h4>
          {!isDropdown && (
            <span className="text-[12px] font-medium text-slate-400 whitespace-nowrap shrink-0">
              {notif.time}
            </span>
          )}
        </div>
        <p
          className={`${isDropdown ? "text-[12px] mt-0.5 line-clamp-2" : "text-[14px] mt-1.5"} text-slate-500 dark:text-slate-400 leading-relaxed`}
        >
          {notif.message}
        </p>
        {isDropdown && (
          <p className="text-[11px] font-medium text-slate-400 mt-2">
            {notif.time}
          </p>
        )}
      </div>

      {!notif.read && (
        <div
          className={`flex items-center ${isDropdown ? "mt-2 items-start" : ""}`}
        >
          <div
            className={`${isDropdown ? "w-2 h-2" : "w-2.5 h-2.5"} bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0`}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
