"use client";
import React, { useState, useRef } from "react";
import {
  FaRegFilePdf,
  FaEllipsisV,
  FaPlus,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaStar,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const DocumentSidebar = () => {
  // Dữ liệu mẫu khởi tạo
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "CV_Frontend_Developer.pdf",
      updateAt: "2 ngày trước",
      isDefault: true,
      url: "/sample.pdf",
    },
    {
      id: 2,
      name: "Le_Hoang_Trung_Resume.pdf",
      updateAt: "1 tuần trước",
      isDefault: false,
      url: "/sample2.pdf",
    },
  ]);

  const [activeMenu, setActiveMenu] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Xử lý tải lên file mới
  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        updateAt: "Vừa xong",
        isDefault: false,
        url: URL.createObjectURL(file),
      };
      setDocuments([...documents, newDoc]);
    } else {
      alert("Vui lòng chọn định dạng file PDF.");
    }
  };

  // Đặt làm mặc định
  const handleSetDefault = (id) => {
    setDocuments((prev) =>
      prev.map((doc) => ({
        ...doc,
        isDefault: doc.id === id,
      })),
    );
    setActiveMenu(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      setDocuments(documents.filter((doc) => doc.id !== id));
      setActiveMenu(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white uppercase text-xs tracking-widest">
          <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span>
          Tài liệu của bạn
        </h3>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`relative flex items-center justify-between p-4 border rounded-2xl transition-all ${
                doc.isDefault
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm"
                  : "border-gray-50 dark:border-gray-800 hover:border-indigo-100"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`p-2 rounded-xl ${doc.isDefault ? "bg-indigo-600 text-white" : "bg-red-50 text-red-500"}`}
                >
                  <FaRegFilePdf size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[130px]">
                    {doc.name}
                  </p>
                  {doc.isDefault ? (
                    <span className="flex items-center gap-1 text-[10px] text-indigo-600 font-black uppercase tracking-tighter">
                      <FaCheckCircle size={8} /> Đang mặc định
                    </span>
                  ) : (
                    <p className="text-[10px] text-gray-400 font-medium">
                      Cập nhật {doc.updateAt}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  setActiveMenu(activeMenu === doc.id ? null : doc.id)
                }
                className="text-gray-300 hover:text-gray-600 p-2 transition-colors"
              >
                <FaEllipsisV size={14} />
              </button>

              {/* Dropdown Menu Chức Năng */}
              {activeMenu === doc.id && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setActiveMenu(null)}
                  ></div>
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-[#252525] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 py-2 overflow-hidden animate-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setPreviewUrl(doc.url);
                        setActiveMenu(null);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FaEye className="text-slate-400" /> Xem nhanh
                    </button>
                    <a
                      href={doc.url}
                      download
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FaDownload className="text-slate-400" /> Tải xuống
                    </a>
                    {!doc.isDefault && (
                      <button
                        onClick={() => handleSetDefault(doc.id)}
                        className="w-full px-4 py-2.5 text-left text-xs font-black text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <FaStar className="text-indigo-400" /> Đặt làm mặc định
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 dark:border-gray-800 mt-1"
                    >
                      <FaTrash className="text-red-400" /> Xóa tài liệu
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />
        <button
          onClick={handleUploadClick}
          className="w-full mt-6 py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 text-sm font-bold hover:border-[#00c853] hover:text-[#00c853] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <FaPlus size={12} /> Tải lên CV mới
        </button>
      </div>

      {/* Pop-up Preview PDF */}
      {previewUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-5xl h-[92vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/20">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-6 right-6 z-50 p-4 bg-slate-900/80 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              <FaTimes size={20} />
            </button>
            <div className="w-full h-full">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSidebar;
