"use client";
import React, { useState, useEffect } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import { companyService } from "@/services/company.service";

// Mảng 63 tỉnh thành Việt Nam chuẩn
const VIETNAM_PROVINCES = [
  "Tất cả địa điểm",
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const CompanyFilter = ({
  onFilterChange,
  onReset,
  currentIndustry = "Tất cả lĩnh vực",
  currentScale = "Tất cả quy mô",
  currentLocation = "Tất cả địa điểm",
}) => {
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isScaleOpen, setIsScaleOpen] = useState(false);
  const [isLocOpen, setIsLocOpen] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState(currentIndustry);
  const [selectedScale, setSelectedScale] = useState(currentScale);
  const [selectedLoc, setSelectedLoc] = useState(currentLocation);

  const [industryOptions, setIndustryOptions] = useState(["Tất cả lĩnh vực"]);
  const [scaleOptions, setScaleOptions] = useState(["Tất cả quy mô"]);
  // Sử dụng danh sách tĩnh cho địa điểm
  const [locations, setLocations] = useState(VIETNAM_PROVINCES);

  useEffect(() => {
    setSelectedIndustry(currentIndustry);
    setSelectedScale(currentScale);
    setSelectedLoc(currentLocation);
  }, [currentIndustry, currentScale, currentLocation]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await companyService.getCompanyFilters();
        if (res && res.success) {
          if (res.data.industries?.length > 0) {
            setIndustryOptions(["Tất cả lĩnh vực", ...res.data.industries]);
          }
          if (res.data.companySizes?.length > 0) {
            setScaleOptions(["Tất cả quy mô", ...res.data.companySizes]);
          }
          // Đã XÓA phần cập nhật locations từ API ở đây
        }
      } catch (error) {
        console.error("Lỗi khi tải bộ lọc:", error);
      }
    };
    fetchFilters();
  }, []);

  const handleResetClick = () => {
    setSelectedIndustry("Tất cả lĩnh vực");
    setSelectedScale("Tất cả quy mô");
    setSelectedLoc("Tất cả địa điểm");
    setIsIndustryOpen(false);
    setIsScaleOpen(false);
    setIsLocOpen(false);
    onReset?.();
  };

  const toggleDropdown = (dropdownName) => {
    if (dropdownName === "industry") {
      setIsIndustryOpen(!isIndustryOpen);
      setIsScaleOpen(false);
      setIsLocOpen(false);
    } else if (dropdownName === "scale") {
      setIsScaleOpen(!isScaleOpen);
      setIsIndustryOpen(false);
      setIsLocOpen(false);
    } else if (dropdownName === "location") {
      setIsLocOpen(!isLocOpen);
      setIsIndustryOpen(false);
      setIsScaleOpen(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all">
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
      <div className="relative mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2 uppercase">
          <HiOutlineBriefcase className="text-[#00c853]" /> LĨNH VỰC
        </h3>
        <div
          onClick={() => toggleDropdown("industry")}
          className={`flex items-center justify-between px-4 py-2.5 rounded-full border transition-all duration-300 cursor-pointer bg-white ${
            isIndustryOpen ? "border-[#00c853]" : "border-[#00c853]"
          }`}
        >
          <span className="text-sm font-bold text-gray-800 line-clamp-1">
            {selectedIndustry}
          </span>
          <FaChevronDown
            className={`text-gray-500 transition-transform flex-shrink-0 ${isIndustryOpen ? "rotate-180" : ""}`}
            size={12}
          />
        </div>
        {isIndustryOpen && (
          <div className="absolute z-[52] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
            {industryOptions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedIndustry(item);
                  setIsIndustryOpen(false);
                  onFilterChange?.(
                    "industry",
                    item === "Tất cả lĩnh vực" ? "" : item,
                  );
                }}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors
                  ${selectedIndustry === item ? "bg-[#00c853] text-white font-bold" : "text-gray-500 hover:bg-gray-50"}`}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nhóm 2: Quy mô công ty */}
      <div className="relative mb-6">
        <h3 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2 uppercase">
          <HiOutlineOfficeBuilding className="text-[#00c853]" /> QUY MÔ
        </h3>
        <div
          onClick={() => toggleDropdown("scale")}
          className={`flex items-center justify-between px-4 py-2.5 rounded-full border transition-all duration-300 cursor-pointer bg-white ${
            isScaleOpen ? "border-[#00c853]" : "border-[#00c853]"
          }`}
        >
          <span className="text-sm font-bold text-gray-800 line-clamp-1">
            {selectedScale}
          </span>
          <FaChevronDown
            className={`text-gray-500 transition-transform flex-shrink-0 ${isScaleOpen ? "rotate-180" : ""}`}
            size={12}
          />
        </div>
        {isScaleOpen && (
          <div className="absolute z-[51] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
            {scaleOptions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedScale(item);
                  setIsScaleOpen(false);
                  onFilterChange?.(
                    "scale",
                    item === "Tất cả quy mô" ? "" : item,
                  );
                }}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors
                  ${selectedScale === item ? "bg-[#00c853] text-white font-bold" : "text-gray-500 hover:bg-gray-50"}`}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nhóm 3: Địa điểm */}
      <div className="relative">
        <h3 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2 uppercase">
          <HiOutlineLocationMarker className="text-[#00c853]" /> ĐỊA ĐIỂM
        </h3>
        <div
          onClick={() => toggleDropdown("location")}
          className={`flex items-center justify-between px-4 py-2.5 rounded-full border transition-all duration-300 cursor-pointer bg-white ${
            isLocOpen ? "border-[#00c853]" : "border-[#00c853]"
          }`}
        >
          <span className="text-sm font-bold text-gray-800 line-clamp-1">
            {selectedLoc}
          </span>
          <FaChevronDown
            className={`text-gray-500 transition-transform flex-shrink-0 ${isLocOpen ? "rotate-180" : ""}`}
            size={12}
          />
        </div>
        {isLocOpen && (
          <div className="absolute z-[50] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedLoc(loc);
                  setIsLocOpen(false);
                  onFilterChange?.(
                    "location",
                    loc === "Tất cả địa điểm" ? "" : loc,
                  );
                }}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors
                  ${selectedLoc === loc ? "bg-[#00c853] text-white font-bold" : "text-gray-500 hover:bg-gray-50"}`}
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
