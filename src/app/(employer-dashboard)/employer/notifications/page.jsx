import React from "react";
import NotificationList from "@/components/features/employer/notifications/NotificationList";

export const metadata = {
  title: "Quản lý thông báo | OneClick Employer",
};

const EmployerNotificationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Thông báo của bạn
        </h1>
        <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Xem lại các tương tác mới nhất từ hệ thống và ứng viên tiềm năng.
        </p>
      </div>
      <NotificationList />
    </div>
  );
};

export default EmployerNotificationsPage;
