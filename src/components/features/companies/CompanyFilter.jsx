"use client";
import React, { useState, useEffect } from "react";
import { FaFilter, FaChevronDown, FaCheckCircle } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";

const CompanyFilter = ({
  onFilterChange,
  onReset,
  selectedIndustries = [],
  selectedScale = [],
  currentLocation = "Tất cả địa điểm",
}) => {
  const [isLocOpen, setIsLocOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState(currentLocation);

  // Cập nhật local state nếu prop currentLocation thay đổi (ví dụ khi Reset)
  useEffect(() => {
    setSelectedLoc(currentLocation);
  }, [currentLocation]);

  const industryOptions = [
    "Bất động sản",
    "Tài chính - Ngân hàng",
    "Giáo dục & Đào tạo",
    "Công nghệ thông tin",
    "Y tế & Dược phẩm",
  ];

  const scaleOptions = [
    "1 - 50 nhân viên",
    "51 - 200 nhân viên",
    "201 - 500 nhân viên",
    "500+ nhân viên",
  ];

  const locations = [
    "Tất cả địa điểm",
    "Hà Nội",
    "TP.HCM",
    "Đà Nẵng",
    "Cần Thơ",
  ];

  const handleResetClick = () => {
    setSelectedLoc("Tất cả địa điểm");
    onReset?.();
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
      {/* Tiêu đề Bộ lọc */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#00c853]">
          <FaFilter size={18} /> Bộ lọc
        </h2>
        <button
          onClick={handleResetClick}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors font-bold uppercase tracking-wider cursor-pointer"
        >
          Xóa hết
        </button>
      </div>

      {/* Nhóm 1: Lĩnh vực */}
      <div className="mb-8">
        <h3 className="font-bold text-base mb-4 text-gray-900 dark:text-white">
          Lĩnh vực
        </h3>
        <div className="space-y-4">
          {industryOptions.map((item, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-200 checked:border-[#00c853] checked:bg-[#00c853] transition-all cursor-pointer"
                  // Kiểm tra trạng thái từ props để đồng bộ giao diện
                  checked={selectedIndustries.includes(item)}
                  onChange={(e) =>
                    onFilterChange?.("industry", item, e.target.checked)
                  }
                />
                <FaCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#00c853] transition-colors font-medium">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Nhóm 2: Quy mô công ty */}
      <div className="mb-8">
        <h3 className="font-bold text-base mb-4 text-gray-900 dark:text-white">
          Quy mô công ty
        </h3>
        <div className="space-y-4">
          {scaleOptions.map((item, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-200 checked:border-[#00c853] checked:bg-[#00c853] transition-all cursor-pointer"
                  // Kiểm tra trạng thái từ props
                  checked={selectedScale.includes(item)}
                  onChange={(e) =>
                    onFilterChange?.("scale", item, e.target.checked)
                  }
                />
                <FaCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#00c853] transition-colors font-medium">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Nhóm 3: Địa điểm */}
      <div className="relative">
        <h3 className="font-bold text-base mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <HiOutlineLocationMarker className="text-[#00c853]" /> ĐỊA ĐIỂM
        </h3>

        {/* Trigger Dropdown */}
        <div
          onClick={() => setIsLocOpen(!isLocOpen)}
          className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer 
            ${isLocOpen ? "border-[#00c853] ring-4 ring-[#00c853]/5" : "border-gray-100 dark:border-gray-800 bg-gray-50/50"}`}
        >
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {selectedLoc}
          </span>
          <FaChevronDown
            className={`text-gray-400 transition-transform ${isLocOpen ? "rotate-180 text-[#00c853]" : ""}`}
            size={12}
          />
        </div>

        {/* Dropdown Menu Địa điểm */}
        {isLocOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedLoc(loc);
                  setIsLocOpen(false);
                  onFilterChange?.("location", loc);
                }}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors
                  ${selectedLoc === loc ? "bg-[#00c853] text-white font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/10"}`}
              >
                {loc}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyFilter;
