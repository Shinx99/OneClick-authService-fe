"use client";
import React, { useState } from "react";
import { FaRobot, FaPaperPlane, FaMagic } from "react-icons/fa";

const AIConsultantChat = ({ jobId }) => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Chào Trung! Mình là OneClick AI. Mình đã phân tích hồ sơ của bạn cho vị trí này. Bạn có cần mình tư vấn cách trả lời phỏng vấn hay sửa lại CV không?",
    },
  ]);
  const [input, setInput] = useState("");

  const quickActions = [
    "Cách trả lời phỏng vấn?",
    "Sửa CV thế nào?",
    "Review mức lương?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Giả lập AI trả lời
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Đó là một câu hỏi hay! Đối với vị trí này, bạn nên tập trung vào...",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 flex flex-col h-[550px] overflow-hidden">
      {/* Top chat */}
      <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <FaRobot />
        </div>
        <div>
          <p className="font-bold text-sm">AI Consultant</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Nội dung chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "ai" ? "bg-slate-100 text-slate-700 rounded-tl-none" : "bg-indigo-600 text-white rounded-tr-none"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Gợi ý nhanh & Input */}
      <div className="p-4 border-t border-slate-50 space-y-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((act) => (
            <button
              key={act}
              onClick={() => setInput(act)}
              className="text-[10px] font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100"
            >
              {act}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi AI tư vấn..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultantChat;
