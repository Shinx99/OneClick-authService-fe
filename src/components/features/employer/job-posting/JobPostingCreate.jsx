"use client";
import React from "react";
import { MdOutlineSave, MdOutlinePublish, MdOutlineLocationOn } from "react-icons/md";

// ===== CẤU HÌNH FORM: Mỗi section là 1 object, mỗi field là 1 object nhỏ =====
const formSections = [
  {
    number: 1,
    title: "Thông tin chung",
    fields: [
      { name: "jobTitle", label: "Chức danh", placeholder: "VD: Senior Java Backend Developer", colSpan: 2 },
      { name: "industry", label: "Ngành nghề", type: "select", options: ["Công nghệ thông tin", "Tài chính & Ngân hàng", "Marketing", "Y tế", "Giáo dục"] },
      { name: "sectorLevel", label: "Cấp bậc", type: "select", options: ["Nhân viên mới", "Trung cấp", "Cao cấp", "Trưởng nhóm", "Quản lý"] },
      { name: "jobType", label: "Hình thức làm việc", type: "select", options: ["Toàn thời gian", "Bán thời gian", "Hợp đồng", "Làm việc từ xa"] },
      { name: "salary", label: "Mức lương", placeholder: "VD: 15.000.000 - 30.000.000 VNĐ" },
    ],
  },
  {
    number: 2,
    title: "Chi tiết công việc",
    fields: [
      { name: "jobDescription", label: "Mô tả công việc", type: "textarea", placeholder: "Mô tả vai trò và các trách nhiệm chính...", colSpan: 2 },
      { name: "candidateRequirements", label: "Yêu cầu ứng viên", type: "textarea", placeholder: "Liệt kê các kỹ năng hoặc kinh nghiệm yêu cầu...", colSpan: 2 },
      { name: "benefits", label: "Phúc lợi", type: "textarea", placeholder: "Liệt kê các phúc lợi, đãi ngộ...", colSpan: 2 },
    ],
  },
  {
    number: 3,
    title: "Yêu cầu & Thiết lập",
    fields: [
      { name: "startDate", label: "Ngày bắt đầu", type: "date" },
      { name: "endDate", label: "Ngày kết thúc", type: "date" },
      { name: "slots", label: "Số lượng", placeholder: "5 - 10 vị trí", type: "number" },
      { name: "jobTags", label: "Từ khóa", placeholder: "VD: React, Node.js, Python..." },
      { name: "workersStaying", label: "Hình thức làm việc", type: "select", options: ["Tại văn phòng", "Làm việc từ xa", "Kết hợp"] },
    ],
  },
  {
    number: 4,
    title: "Địa điểm & Thời hạn",
    fields: [
      { name: "publishedDate", label: "Ngày đăng", type: "date" },
      { name: "applicationDeadline", label: "Hạn nộp hồ sơ", type: "date" },
      { name: "country", label: "Quốc gia", type: "select", options: ["Việt Nam", "Hoa Kỳ", "Singapore", "Nhật Bản"] },
      { name: "city", label: "Thành phố", type: "select", options: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"] },
      { name: "address", label: "Địa chỉ", placeholder: "VD: 131 Đường Mathis, Phòng 445", icon: true, colSpan: 2 },
    ],
  },
];

// ===== COMPONENT RENDER 1 FIELD =====
const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";

const FormField = ({ field }) => {
  if (field.type === "select") {
    return (
      <select className={`${inputClass} text-slate-600`} defaultValue="">
        <option value="">Chọn {field.label.toLowerCase()}</option>
        {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }
  if (field.type === "textarea") {
    return <textarea placeholder={field.placeholder} rows={3} className={`${inputClass} resize-none`} />;
  }
  return (
    <div className={field.icon ? "relative" : ""}>
      {field.icon && <MdOutlineLocationOn className="absolute left-3 top-3 w-5 h-5 text-slate-400" />}
      <input type={field.type || "text"} placeholder={field.placeholder} className={`${inputClass} ${field.icon ? "pl-10" : ""}`} />
    </div>
  );
};

// ===== COMPONENT CHÍNH =====
const JobPostingForm = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tạo tin tuyển dụng mới</h2>
          <p className="text-sm text-slate-400 mt-1">Điền thông tin chi tiết để đăng tin tuyển dụng mới</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all">
            <MdOutlineSave className="w-5 h-5" /> Lưu nháp
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
            <MdOutlinePublish className="w-5 h-5" /> Đăng tin
          </button>
        </div>
      </div>

      {/* Render tất cả sections từ config */}
      <div className="space-y-6">
        {formSections.map((section) => (
          <div key={section.number} className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
                {section.number}
              </span>
              {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.name} className={field.colSpan === 2 ? "col-span-2" : ""}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  <FormField field={field} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Map Placeholder + Submit */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="w-full h-40 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center">
            <div className="text-center">
              <MdOutlineLocationOn className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm text-emerald-600 font-medium">Xem trước bản đồ</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-md">
            <MdOutlinePublish className="w-5 h-5" /> Đăng tin tuyển dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
