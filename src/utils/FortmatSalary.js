import React from "react";

const FormatSalary = (min, max) => {
  if (min == null && max == null) return "Thỏa thuận";
  const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `$${v}`);
  if (min != null && max != null) return `${fmt(min)}-${fmt(max)}`;
  return min != null ? `>${fmt(min)}` : `<${fmt(max)}`;
};
export default FormatSalary;
