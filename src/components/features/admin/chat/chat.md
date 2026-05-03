

```bash
npm install @stomp/stompjs sockjs-client
npm install remark-gfm
npm install react-markdown
```


```bash
features/admin/chat/
├── AdminChatPanel.jsx      ← Danh sách conversation đang chờ
├── AdminChatWindow.jsx     ← Cửa sổ chat với user đang được claim
└── hooks/
    └── useAdminChat.js     ← STOMP subscribe /admin.chat.send, claim, close
```
```bash
features/chat/
├── ChatWidget.jsx          ← Component tổng, điều phối AI hay Admin mode
├── ChatMessages.jsx        ← Render danh sách tin nhắn
├── ChatInput.jsx           ← Ô nhập + nút gửi
├── ChatHandoffBanner.jsx   ← Banner "Đang kết nối với admin..."
└── hooks/
    └── useChat.js          ← Tất cả logic: state, STOMP, gọi service
```


// chat.service.js
export const getMyConversation = () => api.get('/api/chatbot/me/conversation')
export const sendMessage = (dto) => api.post('/api/chatbot/me/messages', dto)
export const requestHandoff = () => api.post('/api/chatbot/me/handoff')

// Admin
export const getWaitingConversations = () => api.get('/api/chatbot/admin/conversations')
export const claimConversation = (id) => api.post(`/api/chatbot/admin/conversations/${id}/claim`)
export const closeConversation = (id) => api.post(`/api/chatbot/admin/conversations/${id}/close`)


## Mount vào layout
Vị trí: src/app/(main)/layout.jsx, src/app/(employer-dashboard)/layout.jsx

```bash
jsx
// Sau khi user đăng nhập → hiển thị trên mọi page
export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingChatButton />  {/* ← đặt đây, dùng được trên tất cả page */}
    </>
  )
}
```

## Flow
```bash
User mở chat
    ↓
useChat() → GET /api/chatbot/me/conversation
    ↓ không có
Tạo mới → POST /api/chatbot/me/messages (STOMP: /chat.send)
    ↓
AI trả lời → STOMP event: MESSAGE_CREATED
    ↓ user bấm "Kết nối hỗ trợ"
POST /handoff → STOMP event: HANDOFF_REQUESTED
    ↓
ChatWidget chuyển mode → 'waiting', hiện ChatHandoffBanner
    ↓ admin claim
STOMP event: CLAIMED → mode = 'admin'
    ↓
Admin và user nhắn qua STOMP /admin.chat.send
    ↓ admin đóng
POST /close → conversation kết thúc
```
```bash
| Loại                   | File                                                       | Lớp             |
| ---------------------- | ---------------------------------------------------------- | --------------- |
| Floating button shell  | components/ui/FloatingChatButton.jsx                       | Shared UI       |
| Chat widget logic + UI | components/features/chat/ChatWidget.jsx                    | Feature         |
| STOMP + state hook     | components/features/chat/hooks/useChat.js                  | Feature logic   |
| API calls              | services/chat.service.js                                   | Service         |
| Admin chat UI          | components/features/admin/chat/AdminChatPanel.jsx          | Feature (Admin) |
| Mount point            | app/(main)/layout.jsx, app/(employer-dashboard)/layout.jsx | Router/Layout   |
```