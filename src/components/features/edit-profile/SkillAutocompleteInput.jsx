"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { IoClose } from "react-icons/io5";

const SkillAutocompleteInput = ({
  allSkills = [],        // Toàn bộ skill từ DB
  existingSkills = [],    // Skill đã có của candidate
  onAdd,
  onCancel
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Lọc danh sách gợi ý dựa trên input (local, không cần debounce phức tạp)
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const keyword = inputValue.trim().toLowerCase();
    return allSkills
      .filter(skill => 
        skill.toLowerCase().includes(keyword) && 
        !existingSkills.includes(skill)
      )
      .slice(0, 8); // Giới hạn hiển thị 8 gợi ý
  }, [inputValue, allSkills, existingSkills]);

  // Focus input khi mở
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (inputValue.trim()) {
        handleAddNew();
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleSelect = (skillName) => {
    if (!existingSkills.includes(skillName)) {
      onAdd(skillName);
    }
    setInputValue("");
    onCancel(); // Đóng input sau khi thêm
  };

  const handleAddNew = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !existingSkills.includes(trimmed)) {
      onAdd(trimmed);
    }
    setInputValue("");
    onCancel();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tên kỹ năng (VD: React, Node.js...)"
          className="w-full p-3.5 pr-10 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Dropdown gợi ý */}
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-card-bg border border-card-border rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((skill, index) => (
            <div
              key={skill}
              onClick={() => handleSelect(skill)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-[#00c853]/10 text-[#00c853]"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {skill}
            </div>
          ))}
        </div>
      )}

      {/* Trường hợp không có gợi ý nhưng có nhập text */}
      {inputValue && suggestions.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-card-bg border border-card-border rounded-xl shadow-lg p-4 text-center">
          <p className="text-sm text-gray-500">Không có kỹ năng khớp</p>
          <button
            onClick={handleAddNew}
            className="mt-2 text-[#00c853] font-medium text-sm hover:underline"
          >
            + Thêm "{inputValue}" mới
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillAutocompleteInput;