"use client";
import React from "react";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { LuFilter, LuFileDown } from "react-icons/lu";

export default function JobTable({ data }) {
  return (
    <div className="space-y-6">
      {/* Header section giữ nguyên phong cách xịn của bạn */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">
            Duyệt tin đăng
          </h2>
          <p className="text-[11px] text-gray-400 mt-1 font-bold uppercase tracking-wider">
            Kiểm tra nội dung tin tuyển dụng
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-gray-100 transition-all uppercase tracking-widest">
            <LuFilter size={14} /> Lọc
          </button>
          <button className="flex items-center gap-2 bg-[#00c853] text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-green-100 hover:opacity-90 transition-all uppercase tracking-widest">
            <LuFileDown size={14} /> Xuất
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Tin tuyển dụng
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Công ty
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Mức lương
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Ngày đăng
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((job) => (
              <tr
                key={job.id}
                className="group hover:bg-gray-50/50 transition-all"
              >
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-black text-[#00c853] uppercase">
                      {job.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">
                        {job.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        ID: #{job.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 text-sm font-medium text-gray-500">
                  {job.company}
                </td>
                <td className="py-5 text-sm font-black text-gray-700">
                  {job.salary}
                </td>
                <td className="py-5 text-sm text-gray-400">{job.postDate}</td>
                <td className="py-5">
                  <span className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {job.status}
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
                      className="p-2 text-gray-300 hover:text-[#00c853] transition-colors"
                      title="Duyệt"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title="Xóa"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-2 pt-4 border-t border-gray-50">
        <span className="text-gray-300 text-[10px] font-black uppercase">
          Page 1 of 3
        </span>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-200 hover:text-gray-400">
            <FaChevronLeft size={10} />
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#00c853] text-white text-[10px] font-black">
            1
          </button>
          <button className="w-7 h-7 rounded-lg text-gray-400 text-[10px] font-black hover:bg-gray-50">
            2
          </button>
          <button className="p-2 text-gray-200 hover:text-gray-400">
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
