import React from "react";

const CompanyOverview = ({ description = "" }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all shadow-sm hover:shadow-md">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="w-1.5 h-6 bg-[#00c853] rounded-full"></span>
          Giới thiệu công ty
        </h3>

        {/* Khu vực nội dung giới thiệu */}
        <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-4 font-medium">
          {description ? (
            <p className="whitespace-pre-line text-justify">{description}</p>
          ) : (
            <div className="py-4">
              <p className="italic text-gray-400 text-center">
                Thông tin giới thiệu đang được cập nhật...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
