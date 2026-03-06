"use client";
import React from "react";
import {
  FaRegFilePdf,
  FaRegFileWord,
  FaEllipsisV,
  FaPlus,
} from "react-icons/fa";

const DocumentSidebar = () => {
  // Dữ liệu mẫu tài liệu
  const documents = [
    {
      id: 1,
      name: "CV_NguyenVanA.pdf",
      updateAt: "Cập nhật 2 ngày trước",
      type: "pdf",
    },
    {
      id: 2,
      name: "Cover_Letter.docx",
      updateAt: "Cập nhật 1 tháng trước",
      type: "word",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Khối Tài liệu */}
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span>
          Tài liệu của bạn
        </h3>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border border-gray-50 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
                  {doc.type === "pdf" ? (
                    <FaRegFilePdf size={20} />
                  ) : (
                    <FaRegFileWord className="text-blue-500" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                    {doc.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{doc.updateAt}</p>
                </div>
              </div>
              <button className="text-gray-300 group-hover:text-gray-500">
                <FaEllipsisV size={12} />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 text-sm font-bold hover:border-[#00c853] hover:text-[#00c853] transition-all flex items-center justify-center gap-2">
          <FaPlus size={12} /> Tải lên tài liệu mới
        </button>
      </div>

      {/* Khối gợi ý (Gợi ý cho bạn) */}
      <div className="bg-gradient-to-br from-white to-green-50/30 dark:from-[#1e1e1e] dark:to-[#1a2e24] p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          💡 Gợi ý cho bạn
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Hoàn thiện hồ sơ giúp tăng 70% cơ hội được nhà tuyển dụng liên hệ.
        </p>
        <button className="mt-4 w-full py-2 bg-white dark:bg-[#2a2a2a] text-[#00c853] text-xs font-bold rounded-full shadow-sm">
          Thêm chứng chỉ
        </button>
      </div>
    </div>
  );
};

export default DocumentSidebar;
