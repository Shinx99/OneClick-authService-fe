"use client";
import React from "react";
import { FaStar } from "react-icons/fa";

// Nhận mảng reviews và điểm trung bình (rating) từ Props
const CompanyReviews = ({ reviews = [], rating = "0.0" }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          ⭐ Đánh giá từ nhân viên
        </h3>
        {/* Điểm số trung bình động */}
        <div className="text-[#00c853] font-black text-xl flex items-center gap-1">
          {rating} <FaStar size={16} />
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-gray-50 dark:bg-[#252525] rounded-3xl relative hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                    {rev.author}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {rev.role}
                  </p>
                </div>
                {/* Render số sao tương ứng với stars trong data */}
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(rev.stars || 5)].map((_, i) => (
                    <FaStar key={i} size={10} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {rev.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4 italic">
            Chưa có đánh giá nào cho công ty này.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyReviews;
