import React from "react";

const FormatLocationDisplay = (code) => {
  if (!code) return "Toàn quốc";
  const locations = {
    100000: "Hà Nội",
    700000: "TP. Hồ Chí Minh",
    500000: "Đà Nẵng",
    750000: "Bình Dương",
    760000: "Đồng Nai",
    180000: "Hải Phòng",
    940000: "Cần Thơ",
    570000: "Khánh Hòa",
  };
  return locations[String(code).trim()] || code;
};
export default FormatLocationDisplay;
