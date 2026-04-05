```bash
features/chat/
├── ChatWidget.jsx          ← Component tổng, điều phối AI hay Admin mode
├── ChatMessages.jsx        ← Render danh sách tin nhắn
├── ChatInput.jsx           ← Ô nhập + nút gửi
├── ChatHandoffBanner.jsx   ← Banner "Đang kết nối với admin..."
└── hooks/
    └── useChat.js          ← Tất cả logic: state, STOMP, gọi service
```