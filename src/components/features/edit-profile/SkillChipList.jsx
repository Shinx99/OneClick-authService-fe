"use client";
import React from "react";
import { IoClose } from "react-icons/io5";

const SkillChipList = ({ skills = [], onRemove }) => {
  if (!skills || skills.length === 0) {
    return (
      <p className="text-sm text-text-muted italic py-4">
        Chưa có kỹ năng nào. Nhấn "Thêm mới" để bổ sung.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00c853]/10 text-[#00c853] text-sm font-medium rounded-full border border-[#00c853]/20 shadow-sm"
        >
          {skill}
          <button
            type="button"
            onClick={() => onRemove(skill)}
            className="text-[#00c853] hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/20"
            aria-label={`Xóa ${skill}`}
          >
            <IoClose size={16} />
          </button>
        </span>
      ))}
    </div>
  );
};

export default SkillChipList;