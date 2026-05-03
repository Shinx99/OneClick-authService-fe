"use client";
import React from "react";
import { FaEye, FaUserSlash, FaUserCheck } from "react-icons/fa";

export default function UserListTable({ data, type, onView, onToggleStatus }) {
  // Hàm lấy key duy nhất dựa vào loại dữ liệu
  const getRowKey = (user) => {
    if (type === "employer") {
      return user.employerId || user.id || Math.random().toString(36).substr(2, 9);
    }
    // Mặc định cho candidate
    return user.candidateId || user.id || Math.random().toString(36).substr(2, 9);
  };

  // Map status ra nhãn hiển thị và màu sắc
  const renderStatus = (status) => {
    let label = status;
    let color = "";
    switch (status?.toLowerCase()) {
      case "active":
        label = "Hoạt động";
        color = "bg-green-50 text-green-600 border-green-100";
        break;
      case "inactive":
      case "banned":
        label = "Đã khóa";
        color = "bg-red-50 text-red-600 border-red-100";
        break;
      case "pending":
        label = "Chờ duyệt";
        color = "bg-amber-50 text-amber-600 border-amber-100";
        break;
      default:
        color = "bg-gray-50 text-gray-600 border-gray-100";
    }
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-gray-50">
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
          {type === "employer" && (
            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Công ty</th>
          )}
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((user) => (
          <tr key={getRowKey(user)} className="group hover:bg-gray-50/50 transition-all">
            <td className="py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#00c853]">
                  {user.name ? user.name.charAt(0) : user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-gray-700 text-sm">
                  {user.surname ? `${user.surname} ${user.name}` : user.name}
                </span>
              </div>
            </td>
            <td className="py-5 text-sm text-gray-500">{user.email}</td>
            {type === "employer" && (
              <td className="py-5 text-sm font-medium text-gray-600">{user.companyName || "N/A"}</td>
            )}
            <td className="py-5">{renderStatus(user.status)}</td>
            <td className="py-5">
              <div className="flex justify-end gap-2">
                {onView && (
                  <button
                    onClick={() => onView(getRowKey(user))}
                    className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                    title="Xem chi tiết"
                  >
                    <FaEye />
                  </button>
                )}
                {onToggleStatus && (
                  <button
                    onClick={() => onToggleStatus(getRowKey(user), user.status)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  >
                    {user.status === "active" ? <FaUserSlash /> : <FaUserCheck />}
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}