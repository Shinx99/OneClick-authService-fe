

*** 📝 Nội dung các file quan trọng ***

Welcome to Dev-Storm!

## Hệ điều hành
- **Khuyến nghị**: Ubuntu 22.04 LTS hoặc 24.04 LTS
- **Hỗ trợ**: Windows 10/11, macOS 12+

## IDE: VS Code (khuyến nghị), WebStorm hoặc editor bất kỳ mà bạn quen dùng.
- Công cụ bắt buộc:
- Node.js 20.9+
- npm 10+ (hoặc pnpm/yarn tùy team)
- Git 2.30+


## 📚 Tech Stack
- Next.js 16+
- Node.js 20.9+
- React 19
- JavaScript (ES6+)
- HTTP Client:
    - - Native Fetch API (mặc định)
    - - Axios (chỉ dùng khi cần interceptors, retry, progress upload/download)
- JavaScript (ECMAScript 2024+ – ES2024+)


## Folder Structure

```bash
authservice-fe/
├── public/                           # Static files
│   ├── images/
│   │   └── logo.png
│   ├── icons/
│   │   └── favicon.ico
│   └── fonts/
│
├── src/
│   ├── app/                          # Next.js App Router - Pages & Routing
│   │   ├── layout.js                 # Root layout
│   │   ├── page.js                   # Homepage (/)
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── (auth)/                   # Route group cho auth pages
│   │   │   ├── login/
│   │   │   │   └── page.js           # Login page (/login)
│   │   │   └── register/
│   │   │       └── page.js           # Register page (/register)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.js             # Dashboard layout (với Sidebar)
│   │   │   ├── page.js               # Dashboard home (/dashboard)
│   │   │   ├── profile/
│   │   │   │   └── page.js           # User profile (/dashboard/profile)
│   │   │   └── settings/
│   │   │       └── page.js           # Settings (/dashboard/settings)
│   │   │
│   │   └── api/                      # API routes (optional - nếu cần BFF)
│   │       └── auth/
│   │           └── route.js          # Middleware cho auth
│   │
│   ├── components/                   # React Components
│   │   ├── ui/                       # Basic reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── Spinner.jsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.jsx            # Main header/navbar
│   │   │   ├── Footer.jsx            # Footer
│   │   │   ├── Sidebar.jsx           # Dashboard sidebar
│   │   │   └── Container.jsx         # Page container wrapper
│   │   │
│   │   └── features/                 # Feature-specific components
│   │       ├── auth/
│   │       │   ├── LoginForm.jsx     # Login form với logic
│   │       │   ├── RegisterForm.jsx  # Register form
│   │       │   └── PasswordReset.jsx # Password reset form
│   │       │
│   │       ├── user/
│   │       │   ├── UserProfile.jsx   # User profile component
│   │       │   ├── UserAvatar.jsx    # User avatar
│   │       │   └── UserCard.jsx      # User card
│   │       │
│   │       └── dashboard/
│   │           ├── StatsCard.jsx     # Statistics card
│   │           └── ActivityFeed.jsx  # Activity feed
│   │
│   ├── services/                     # API Services - Gọi Spring Boot
│   │   ├── api.config.js             # Axios instance configuration
│   │   ├── auth.service.js           # Auth APIs
│   │   ├── user.service.js           # User APIs
│   │   └── dashboard.service.js      # Dashboard APIs
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useAuth.js                # Authentication hook
│   │   ├── useUser.js                # User data hook
│   │   ├── useForm.js                # Form handling hook
│   │   └── useFetch.js               # Data fetching hook
│   │
│   ├── context/                      # React Context - Global State
│   │   ├── AuthContext.js            # Auth state (user, token)
│   │   ├── ThemeContext.js           # Theme state (dark/light)
│   │   └── ToastContext.js           # Toast notifications
│   │
│   ├── lib/                          # Utilities & Helpers
│   │   ├── utils.js                  # General utilities
│   │   ├── constants.js              # App constants
│   │   ├── validation.js             # Validation functions
│   │   └── formatters.js             # Data formatters
│   │
│   ├── middleware/                   # Next.js Middleware
│   │   └── auth.middleware.js        # Auth check middleware
│   │
│   └── styles/                       # Additional styles (nếu không dùng Tailwind)
│       ├── components/               # Component-specific CSS
│       └── variables.css             # CSS variables
│
├── .env                        # Environment variables (local)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── jsconfig.json                     # JavaScript/Path config
└── README.md                         # Project documentation
```

## Tóm tắt vai trò

```bash
| Folder                   | Chức năng chính                                    | Ghi chú sử dụng                                          |
| ------------------------ | -------------------------------------------------- | -------------------------------------------------------- |
| authservice-fe/          | Thư mục root của toàn bộ project frontend          | Chứa source, config, tài liệu                            |
| public/                  | Lưu tài nguyên tĩnh (hình ảnh, icons, fonts)       | Dùng trực tiếp qua đường dẫn /images/...                 |
| src/                     | Toàn bộ mã nguồn ứng dụng                          | Nơi làm việc chính của dev FE                            |
| src/app/                 | Routing & pages theo Next.js App Router            | Định nghĩa URL, layout, trang cụ thể                     |
| src/components/          | Tất cả React components                            | Chia nhỏ theo ui/, layout/, features/                    |
| src/components/ui/       | UI nhỏ, thuần giao diện, tái sử dụng               | Button, Input, Card, Modal, Spinner…                     |
| src/components/layout/   | Bố cục chung (layout components)                   | Header, Footer, Sidebar, Container…                      |
| src/components/features/ | Components theo tính năng (feature)                | LoginForm, RegisterForm, UserProfile, Stats…             |
| src/services/            | Gọi API tới Spring Boot                            | auth.service, user.service, dashboard.service…           |
| src/hooks/               | Custom hooks chứa logic tái sử dụng                | useAuth, useUser, useForm, useFetch…                     |
| src/context/             | Global state với React Context                     | AuthContext, ThemeContext, ToastContext…                 |
| src/lib/                 | Utilities & helpers (utils, constants, validation) | Hàm format, validate, hằng số dùng chung                 |
| src/middleware/          | Middleware cho routing (auth check, redirect)      | Bảo vệ các route như /dashboard/*                        |
| src/styles/              | CSS bổ sung cho project                            | CSS cho component, biến CSS, nếu không chỉ dùng Tailwind |
| .env / .env.example      | Biến môi trường & template cho team                | Khai báo URL Spring Boot, config khác                    |
| .gitignore               | Quy tắc loại trừ file/thư mục khỏi Git             | Bỏ qua node_modules, .env, .next…                        |
| next.config.js           | Cấu hình Next.js                                   | Cấu hình images, env, redirects…                         |
| package.json             | Dependencies & scripts của project                 | Chạy npm run dev, build, start…                          |
| jsconfig.json            | Cấu hình alias đường dẫn                           | Thường map @/ → src/                                     |
| README.md                | Tài liệu hướng dẫn project                         | Hướng dẫn setup, run, mô tả cấu trúc                     |

```
## 🧩 Hướng dẫn code cho team

### Pages (`src/app/`)
- Chỉ nên **ghép components**, hạn chế viết business logic trực tiếp
- Mỗi route tương ứng một folder có `page.js`

### UI components (`src/components/ui/`)
- Thuần UI, không gọi API, không chứa logic phức tạp
- Dùng được ở nhiều nơi trong app

### Feature components (`src/components/features/`)
- Form + logic UI + dùng hooks + gọi services
- Ví dụ: `LoginForm`, `RegisterForm`, `UserProfile`

### Services (`src/services/`)
- Chỉ **gọi HTTP** tới Spring Boot
- Không chứa JSX, không dùng hooks

### Hooks (`src/hooks/`)
- Đóng gói logic để tái sử dụng (auth flow, form handling, fetching…)

### Context (`src/context/`)
- Dùng cho state dùng chung (user login, theme, toast…)

### Lib (`src/lib/`)
- Bất cứ helper/constant/validator nào có thể dùng lại nhiều chỗ

---

## 🐛 Troubleshooting

### CORS errors
- Đảm bảo Spring Boot đã enable CORS cho origin `http://localhost:3000`
- Kiểm tra mapping CORS cho prefix `/api/**`

### Connection failed
- Xác nhận backend Spring Boot đang chạy (mặc định `http://localhost:8080`)
- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local` trùng với URL backend

### Port 3000 đã được dùng
```bash
# macOS / Linux
lsof -ti:3000 | xargs kill
# hoặc đổi port:
npm run dev -- -p 3001
```

🧪 Scripts hữu ích khác
```bash
npm run dev      # Chạy môi trường phát triển
npm run build    # Build production
npm run start    # Chạy build production
npm run lint     # Chạy ESLint
```

## 🤝 Quy ước phát triển
- Sử dụng functional components + hooks
- Tất cả API call phải thông qua services/
- Logic phức tạp nên tách sang hooks/ hoặc lib/
- Tránh truyền props quá sâu → ưu tiên dùng context/ khi cần share state
- Mỗi feature lớn nên có folder riêng trong components/features/
