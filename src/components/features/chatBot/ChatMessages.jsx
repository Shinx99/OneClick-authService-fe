"use client";

export default function ChatMessages({ messages = [], loading = false }) {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6 bg-background">
        <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-card-border" />
        <div className="ml-auto h-10 w-1/2 animate-pulse rounded-2xl bg-card-border" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 bg-background transition-colors scrollbar-thin">
      {messages.map((message) => {
        const isUser = (message.sender || "AI").toUpperCase() === "USER";

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`relative max-w-[85%] px-4 py-3 rounded-[22px] text-[13.5px] leading-relaxed shadow-sm ${
                isUser
                  ? "bg-[#00c853] text-white rounded-br-none font-medium"
                  : "bg-card-bg text-text-main border border-card-border rounded-bl-none shadow-black/5"
              }`}
            >
              {message.content}
              {/* Timestamp tinh tế */}
              <div
                className={`absolute bottom-[-18px] text-[9px] font-bold uppercase tracking-tighter opacity-30 whitespace-nowrap ${isUser ? "right-1" : "left-1"}`}
              >
                {message.createdAtLabel || ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
