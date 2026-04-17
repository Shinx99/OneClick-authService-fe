import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const TagInput = ({ value = [], onChange, placeholder = "Nhập kỹ năng..." }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-3 bg-background border border-card-border rounded-2xl focus-within:ring-2 focus-within:ring-[#00c853] transition-all">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#00c853]/10 text-[#00c853] text-sm font-medium rounded-full border border-[#00c853]/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 transition-colors"
            >
              <IoClose size={16} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-text-main font-medium"
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Nhấn Enter để thêm kỹ năng.
      </p>
    </div>
  );
};

export default TagInput;