import React from "react";
import { FaStar } from "react-icons/fa";

const CompanyReviews = ({ reviews = [], rating = "0" }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all shadow-sm">
      {/* Header phần Review */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="w-1.5 h-6 bg-[#00c853] rounded-full"></span>
          Đánh giá từ nhân viên
        </h3>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-2xl">
          <FaStar className="text-[#00c853]" />
          <span className="font-black text-[#00c853]">{rating}</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-[1.5rem] bg-gray-50 dark:bg-[#252525] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {rev.author}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {rev.role}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={12}
                      className={
                        i < rev.stars
                          ? "text-[#00c853]"
                          : "text-gray-200 dark:text-gray-700"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                {rev.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400 italic">
              Chưa có đánh giá nào cho công ty này.
            </p>
          </div>
        )}
      </div>

      {/* Nút Viết đánh giá */}
      <button className="w-full mt-8 py-4 bg-[#00c853] dark:bg-white dark:text-gray-900 text-white rounded-2xl font-bold hover:opacity-90 transition-all active:scale-[0.98]">
        Viết đánh giá của bạn
      </button>
    </div>
  );
};

export default CompanyReviews;
