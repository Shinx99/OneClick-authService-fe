"use client";
import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";

const AIAnalysisDashboard = ({ jobId, matchResult }) => {
  // Nếu không có dữ liệu, hiển thị loading
  if (!matchResult || matchResult.matchScore === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c853] mx-auto mb-4"></div>
          <p className="text-text-muted">Đang phân tích dữ liệu...</p>
        </div>
      </div>
    );
  }

  const score = Math.round(matchResult.matchScore);
  const matchLevel = score >= 80 ? "Rất phù hợp" :
                     score >= 60 ? "Phù hợp" :
                     score >= 40 ? "Có thể phù hợp" : "Cần cải thiện";
  
  const getScoreColor = () => {
    if (score >= 80) return "#10B981"; // green
    if (score >= 60) return "#3B82F6"; // blue
    if (score >= 40) return "#F59E0B"; // orange
    return "#EF4444"; // red
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="space-y-6">
      {/* === CARD ĐIỂM MATCH === */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke={getScoreColor()}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gray-800">
                {score}%
              </span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">
                Match Rate
              </span>
            </div>
          </div>

          {/* Thông tin phân tích */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-bold mb-4">
              <FaRocket size={14} />
              {matchLevel}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Kết quả phân tích CV
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {matchResult.matchReason || "Đang phân tích chi tiết..."}
            </p>
          </div>
        </div>
      </div>

      {/* === KỸ NĂNG PHÙ HỢP === */}
      {matchResult.matchedSkills && matchResult.matchedSkills.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-xl">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Kỹ năng phù hợp
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              {matchResult.matchedSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {matchResult.matchedSkills.map((skill, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium hover:shadow-md transition-all"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === KỸ NĂNG CÒN THIẾU === */}
      {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-xl">
              <FaTimesCircle className="text-orange-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Kỹ năng cần bổ sung
            </h3>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
              {matchResult.missingSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {matchResult.missingSkills.map((skill, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-medium hover:shadow-md transition-all"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === GỢI Ý CẢI THIỆN === */}
      {matchResult.improvementTips && matchResult.improvementTips.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
              <FaLightbulb className="text-yellow-300 text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-indigo-600" />
                Gợi ý cải thiện
              </h3>
              <ul className="space-y-3">
                {matchResult.improvementTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></span>
                    <span className="text-gray-700 text-base leading-relaxed">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị khi không có dữ liệu chi tiết */}
      {(!matchResult.matchedSkills || matchResult.matchedSkills.length === 0) &&
       (!matchResult.missingSkills || matchResult.missingSkills.length === 0) &&
       (!matchResult.improvementTips || matchResult.improvementTips.length === 0) && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
          <p className="text-gray-500">Đang tổng hợp phân tích chi tiết...</p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisDashboard;