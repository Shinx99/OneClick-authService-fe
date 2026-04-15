"use client";

import React, { useEffect, useState } from "react";
import {
  FaFilter,
  FaBriefcase,
  FaUsers,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { companyService } from "@/services/company.service";

const VIETNAM_PROVINCES = [
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
  currentKeyword = "",
  currentIndustry = "",
  currentScale = "",
  currentLocation = "",
}) => {
  // States lưu trữ options từ API
  const [industryOptions, setIndustryOptions] = useState([]);
  const [scaleOptions, setScaleOptions] = useState([]);

  // States lưu trữ giá trị đang chọn
  const [selectedKeyword, setSelectedKeyword] = useState(currentKeyword);
  const [selectedIndustry, setSelectedIndustry] = useState(currentIndustry);
  const [selectedScale, setSelectedScale] = useState(currentScale);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  useEffect(() => {
    setSelectedKeyword(currentKeyword);
    setSelectedIndustry(currentIndustry);
    setSelectedScale(currentScale);
    setSelectedLocation(currentLocation);
  }, [currentKeyword, currentIndustry, currentScale, currentLocation]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await companyService.getCompanyFilters();
        if (res?.success) {
          if (res.data?.industries?.length) {
            setIndustryOptions(res.data.industries);
          }
          if (res.data?.companySizes?.length) {
            setScaleOptions(res.data.companySizes);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải bộ lọc:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleReset = () => {
    setSelectedKeyword("");
    setSelectedIndustry("");
    setSelectedScale("");
    setSelectedLocation("");
    onReset?.();
  };

  const handleChange = (type, value) => {
    //if (type === "keyword") setSelectedKeyword(value);
    if (type === "industry") setSelectedIndustry(value);
    if (type === "sizeRange") setSelectedScale(value);
    if (type === "location") setSelectedLocation(value);

    // Gửi dữ liệu lên component cha để lọc
    onFilterChange?.(type, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onFilterChange?.("keyword", selectedKeyword);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 items-center">
        {/* CỘT 1: Tiêu đề bộ lọc */}
        <div className="flex items-center gap-4 p-1">
          <div className="w-12 h-12 bg-[#00c853] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <FaFilter size={20} />
          </div>
          <div>
            <h2 className="font-black text-text-main text-[15px] uppercase leading-tight">
              Bộ lọc <br /> công ty
            </h2>
          </div>
        </div>

        {/* CỘT 2: Ô SEARCH */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00c853]">
            <FaSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Nhập tên + Enter..."
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-11 pr-4 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-[#00c853] transition-all hover:bg-gray-50 placeholder:font-normal"
          />
        </div>

        {/* CỘT 3: Lĩnh vực */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00c853]">
            <FaBriefcase size={16} />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => handleChange("industry", e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-[#00c853] transition-all appearance-none cursor-pointer hover:bg-gray-50"
          >
            <option value="">Tất cả lĩnh vực</option>
            {industryOptions.map((item, idx) => (
              <option key={`ind-${idx}`} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* CỘT 4: Quy mô */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00c853]">
            <FaUsers size={16} />
          </div>
          <select
            value={selectedScale}
            onChange={(e) => handleChange("sizeRange", e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-[#00c853] transition-all appearance-none cursor-pointer hover:bg-gray-50"
          >
            <option value="">Tất cả quy mô</option>
            {scaleOptions.map((item, idx) => (
              <option key={`scale-${idx}`} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* CỘT 5: Địa điểm & Nút Xóa */}
        <div className="flex items-center gap-1">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00c853]">
              <FaMapMarkerAlt size={16} />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-background border border-card-border rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-[#00c853] transition-all appearance-none cursor-pointer hover:bg-gray-50"
            >
              <option value="">Tất cả địa điểm</option>
              {VIETNAM_PROVINCES.map((item, idx) => (
                <option key={`loc-${idx}`} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleReset}
            className="whitespace-nowrap p-1.5 py-3.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl font-bold text-xs uppercase shadow-sm cursor-pointer"
          >
            Xóa hết
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyFilter;
