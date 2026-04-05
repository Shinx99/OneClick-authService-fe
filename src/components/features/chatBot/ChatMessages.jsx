// ChatMessages.jsx

"use client";

export default function ChatMessages({ 
  messages = [], 
  loading = false,
  isTyping = false, // Thêm prop
  typingUserId = null, // Ai đang typing
}) {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <div className="h-8 w-2/3 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="ml-auto h-8 w-1/2 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-8 w-3/4 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((message) => {
        const sender = (message.sender || "AI").toUpperCase();
        const isUser = sender === "USER";
        const isAdmin = sender === "ADMIN";

        return (
          <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={[
                "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                isUser
                  ? "rounded-br-sm bg-teal-700 text-white"
                  : isAdmin
                  ? "rounded-bl-sm bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                  : "rounded-bl-sm bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
              ].join(" ")}
            >
              <div>{message.content}</div>
              <div className="mt-1 text-[10px] opacity-60">
                {message.createdAtLabel || message.createdAt || ""}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="rounded-bl-sm rounded-2xl rounded-tr-2xl bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}