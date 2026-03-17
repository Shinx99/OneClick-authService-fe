"use client";
import React, { useState } from "react";
import {
  FaPlus,
  FaBriefcase,
  FaUsers,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

export default function CategoryContent({ initialData }) {
  const [activeTab, setActiveTab] = useState("industries");

  const tabs = [
    { id: "industries", label: "Ngành nghề", icon: <FaBriefcase /> },
    { id: "company_sizes", label: "Quy mô", icon: <FaUsers /> },
    { id: "locations", label: "Tỉnh/Thành", icon: <FaMapMarkerAlt /> },
  ];

  const currentData = initialData[activeTab];

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* CỘT TRÁI: Loại danh mục */}
      <div className="col-span-3 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
            Loại danh mục
          </p>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all
                  ${activeTab === tab.id ? "bg-green-50 text-[#00c853]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <span
                  className={
                    activeTab === tab.id ? "text-[#00c853]" : "text-gray-300"
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Box Lưu ý */}
        <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100">
          <p className="text-[#00c853] font-bold text-sm mb-2 flex items-center gap-2">
            💡 Lưu ý
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Mọi thay đổi trong danh mục sẽ ảnh hưởng trực tiếp đến dữ liệu hiển
            thị trên ứng dụng.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: Bảng danh sách */}
      <div className="col-span-9">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách {tabs.find((t) => t.id === activeTab).label}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Hiển thị {currentData.length} mục trên tổng số 24
              </p>
            </div>
            <button className="bg-[#00c853] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all text-sm">
              <FaPlus size={14} /> Thêm mục mới
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-50">
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  ID
                </th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Tên mục
                </th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-5 text-sm font-bold text-gray-300">
                    #{item.id}
                  </td>
                  <td className="py-5 text-sm font-bold text-gray-700">
                    {item.name}
                  </td>
                  <td className="py-5">
                    <div className="flex justify-end gap-3">
                      <button className="p-2 text-gray-300 hover:text-[#00c853] transition-colors">
                        <FaEdit size={16} />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-auto pt-8 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-[#00c853] text-white font-bold text-sm shadow-lg shadow-green-200">
              1
            </button>
            <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 font-bold text-sm">
              2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
