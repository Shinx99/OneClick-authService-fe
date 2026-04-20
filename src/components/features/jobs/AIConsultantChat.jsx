"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaSpinner, FaLightbulb, FaQuestionCircle, FaChartLine } from "react-icons/fa";
import { aiMatchService } from "@/services/ai-match.service";
import toast from "react-hot-toast"; 

const AIConsultantChat = ({ jobId, matchResult }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const messagesEndRef = useRef(null);

  // Khởi tạo chat khi có matchResult
  useEffect(() => {
    if (matchResult && matchResult.parsedCv) {
      const score = Math.round(matchResult.matchScore || 0);
      const matchedCount = matchResult.matchedSkills?.length || 0;
      const missingCount = matchResult.missingSkills?.length || 0;
      
      setMessages([{
        role: "ai",
        content: `👋 Chào ${matchResult.parsedCv?.personal?.fullName || "bạn"}!
        
📊 **Độ phù hợp với vị trí này: ${score}%**

✅ **Kỹ năng phù hợp:** ${matchedCount} kỹ năng
⚠️ **Kỹ năng cần bổ sung:** ${missingCount} kỹ năng

${matchResult.matchReason ? `📝 **Nhận xét:** ${matchResult.matchReason.substring(0, 200)}...` : ''}

Tôi có thể giúp bạn:
• 💡 **Cải thiện CV** - Dựa trên kỹ năng còn thiếu
• 🎯 **Câu hỏi phỏng vấn** - Tạo câu hỏi thực tế
• 📈 **Định hướng phát triển** - Lộ trình học tập
• 💬 **Giải đáp thắc mắc** - Bất kỳ câu hỏi nào về công việc

Bạn muốn tôi tư vấn gì hôm nay?`
      }]);
    }
  }, [matchResult]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !matchResult?.parsedCv) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiMatchService.consultantChat(
        jobId,
        matchResult.parsedCv,
        userMessage,
        sessionId
      );

      setMessages(prev => [...prev, { 
        role: "ai", 
        content: response.content 
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    if (!matchResult?.parsedCv) {
      toast.error("Vui lòng phân tích CV trước khi chat!");
      return;
    }

    setIsLoading(true);
    
    let userQuestion = "";
    let aiResponse = null;

    try {
      switch (action) {
        case "improve_cv":
          userQuestion = "Hãy tư vấn cách cải thiện CV của tôi để phù hợp hơn với vị trí này";
          const improveRes = await aiMatchService.getImprovementAdvice(jobId, matchResult.parsedCv);
          aiResponse = improveRes.content;
          break;
          
        case "interview_questions":
          userQuestion = "Hãy tạo câu hỏi phỏng vấn cho tôi dựa trên CV và yêu cầu công việc";
          const interviewRes = await aiMatchService.generateInterviewQuestions(jobId, matchResult.parsedCv);
          aiResponse = interviewRes.content;
          break;
          
        case "skill_gap":
          userQuestion = "Phân tích khoảng cách kỹ năng của tôi so với yêu cầu công việc";
          const gapRes = await aiMatchService.consultantChat(
            jobId, matchResult.parsedCv, userQuestion, sessionId
          );
          aiResponse = gapRes.content;
          break;
          
        default:
          return;
      }
      
      setMessages(prev => [...prev, 
        { role: "user", content: userQuestion },
        { role: "ai", content: aiResponse }
      ]);
      
    } catch (error) {
      console.error("Quick action error:", error);
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu chưa có matchResult, hiển thị placeholder
  if (!matchResult || !matchResult.parsedCv) {
    return (
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 flex flex-col h-[550px] overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <FaRobot />
          </div>
          <div>
            <p className="font-bold text-sm">AI Consultant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Chờ phân tích CV
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <FaRobot className="text-5xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">
              Vui lòng phân tích CV trước<br />
              để tôi có thể tư vấn chi tiết!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 flex flex-col h-[550px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-50 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <FaRobot />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-800">AI Consultant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                Sẵn sàng tư vấn
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-indigo-600">
              {Math.round(matchResult.matchScore || 0)}% Match
            </p>
            <p className="text-[9px] text-slate-400">
              {matchResult.matchedSkills?.length || 0}/{matchResult.missingSkills?.length || 0} skills
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pt-4 pb-2 flex gap-2 border-b border-slate-50">
        <button
          onClick={() => handleQuickAction("improve_cv")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-medium hover:bg-green-100 transition-all"
        >
          <FaLightbulb size={12} />
          Cải thiện CV
        </button>
        <button
          onClick={() => handleQuickAction("interview_questions")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 text-xs font-medium hover:bg-purple-100 transition-all"
        >
          <FaQuestionCircle size={12} />
          Câu hỏi PV
        </button>
        <button
          onClick={() => handleQuickAction("skill_gap")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-xs font-medium hover:bg-orange-100 transition-all"
        >
          <FaChartLine size={12} />
          Khoảng cách KN
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === "user" 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <FaSpinner className="animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Hỏi tôi bất cứ điều gì về CV và công việc..."
            className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
        <p className="text-[9px] text-slate-400 text-center mt-2">
          AI tư vấn dựa trên CV và mô tả công việc của bạn
        </p>
      </div>
    </div>
  );
};

export default AIConsultantChat;