"use client";
import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaRocket,
  FaDiceD6,
} from "react-icons/fa";

const AIAnalysisDashboard = ({ jobId }) => {
  const data = {
    score: 87,
    matchLevel: "Rất phù hợp",
    analysis:
      "Hồ sơ của bạn có nền tảng kỹ thuật rất sát với yêu cầu của dự án, đặc biệt là phần React và tư duy xử lý logic.",
    skills: [
      {
        name: "ReactJS / Next.js",
        status: "match",
        detail: "Kinh nghiệm 2 năm trùng khớp",
      },
      {
        name: "Tailwind CSS",
        status: "match",
        detail: "Đã sử dụng trong 3 dự án",
      },
      {
        name: "TypeScript",
        status: "missing",
        detail: "JD yêu cầu mức độ trung cấp",
      },
      {
        name: "Docker/CI-CD",
        status: "missing",
        detail: "Điểm cộng lớn nếu có",
      },
    ],
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * data.score) / 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- PHẦN ĐIỂM SỐ (CARD CHÍNH) --- */}
      <div className="relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-indigo-500/5 p-8 md:p-12">
        {/* Decor nền mờ */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          {/* Radial Progress */}
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="#F1F5F9"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="url(#gradientScore)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                className="transition-all duration-[1500ms] ease-out"
              />
              <defs>
                <linearGradient
                  id="gradientScore"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-800 tracking-tighter">
                {data.score}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Match Rate
              </span>
            </div>
          </div>

          {/* Nội dung chữ */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-100">
              <FaRocket size={10} className="animate-bounce" />{" "}
              {data.matchLevel}
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Phân tích từ <span className="text-indigo-600">OneClick AI</span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
              &quot;{data.analysis}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* --- CHI TIẾT KỸ NĂNG --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.skills.map((skill, index) => (
          <div
            key={index}
            className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${skill.status === "match" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}
              >
                {skill.status === "match" ? (
                  <FaCheckCircle size={18} />
                ) : (
                  <FaTimesCircle size={18} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {skill.name}
                </h4>
                <p className="text-xs text-slate-400">{skill.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- LỜI KHUYÊN --- */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <FaDiceD6 className="absolute -bottom-10 -right-10 text-9xl text-white/5 rotate-12" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="p-3 bg-indigo-500 rounded-2xl">
            <FaLightbulb className="text-yellow-300" size={20} />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-3 uppercase tracking-wider">
              Chiến lược tối ưu
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                Bổ sung từ khóa &quot;JavaScript&quot; vào phần kỹ năng chuyên
                môn.
              </p>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                Mô tả chi tiết hơn về cách tối ưu Performance dự án.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;
