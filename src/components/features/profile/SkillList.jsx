"use client";
import React from "react";
import { FaPlus, FaLightbulb } from "react-icons/fa";

const SkillList = ({ skills = [] }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <FaLightbulb className="text-[#00c853]" />
          Kỹ năng
        </h2>
        {/* Nút chỉnh sửa nhanh dẫn đến trang edit */}
        <button className="p-2 text-gray-400 hover:text-[#00c853] transition-colors active:scale-90">
          <FaPlus size={16} />
        </button>
      </div>

      {/* Hiển thị danh sách tag kỹ năng */}
      <div className="flex flex-wrap gap-3">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill.id}
              className="px-5 py-2 rounded-full bg-blue-50 dark:bg-[#252a3d] text-blue-600 dark:text-blue-400 text-sm font-bold border border-blue-100 dark:border-blue-900/30 hover:bg-[#00c853] hover:text-white hover:border-[#00c853] transition-all cursor-default shadow-sm"
            >
              {skill.name}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">
            Chưa có thông tin kỹ năng.
          </p>
        )}

        {/* Nút thêm kỹ năng mới cho UI - Giữ nguyên form dashed của bạn */}
        <button className="px-5 py-2 rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 text-sm font-bold hover:border-[#00c853] hover:text-[#00c853] transition-all active:scale-95">
          + Thêm kỹ năng
        </button>
      </div>
    </div>
  );
};

export default SkillList;
