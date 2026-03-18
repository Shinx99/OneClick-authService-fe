"use client";
import React from "react";
import { FaEye, FaUserSlash, FaCheck } from "react-icons/fa";

export default function UserListTable({ data, type }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-gray-50">
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Người dùng
          </th>
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Email
          </th>
          {type === "employer" && (
            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Công ty
            </th>
          )}
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Trạng thái
          </th>
          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((user) => (
          <tr
            key={user.id}
            className="group hover:bg-gray-50/50 transition-all"
          >
            <td className="py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#00c853]">
                  {user.name.charAt(0)}
                </div>
                <span className="font-bold text-gray-700 text-sm">
                  {user.name}
                </span>
              </div>
            </td>
            <td className="py-5 text-sm text-gray-500">{user.email}</td>
            {type === "employer" && (
              <td className="py-5 text-sm font-medium text-gray-600">
                {user.company}
              </td>
            )}
            <td className="py-5">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  user.status === "ACTIVE" || user.status === "Active"
                    ? "bg-green-50 text-green-600 border-green-100"
                    : user.status === "PENDING" || user.status === "Pending"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-red-50 text-red-600 border-red-100"
                }`}
              >
                {user.status}
              </span>
            </td>
            <td className="py-5">
              <div className="flex justify-end gap-2">
                <button
                  className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                  title="Xem chi tiết"
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  title="Khóa tài khoản"
                >
                  <FaUserSlash />
                </button>
                {(user.status === "PENDING" || user.status === "Pending") && (
                  <button
                    className="p-2 text-gray-300 hover:text-[#00c853] transition-colors"
                    title="Duyệt"
                  >
                    <FaCheck />
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
