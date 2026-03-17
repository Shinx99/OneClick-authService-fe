"use client";
import React from "react";
import { FaEye, FaCheck, FaTimes, FaFilePdf } from "react-icons/fa";

export default function CompanyTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Công ty
            </th>
            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Mã số thuế
            </th>
            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Giấy phép
            </th>
            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Ngày gửi
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
          {data.map((item) => (
            <tr
              key={item.id}
              className="group hover:bg-gray-50/50 transition-all"
            >
              <td className="py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-black text-blue-500 uppercase">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 text-sm">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-5 text-sm font-bold text-gray-500">
                {item.taxCode}
              </td>
              <td className="py-5">
                <a
                  href={item.licenseUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors"
                  title="Xem PDF"
                >
                  <FaFilePdf size={18} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    View License
                  </span>
                </a>
              </td>
              <td className="py-5 text-sm text-gray-400 font-medium">
                {item.requestDate}
              </td>
              <td className="py-5">
                <span className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {item.status}
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
                    title="Từ chối"
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
  );
}
