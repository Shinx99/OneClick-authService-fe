# Auth Service Frontend

Frontend ứng dụng **Authentication / Dashboard** xây bằng **Next.js + React**, kết nối với backend **Spring Boot** qua REST API.

---

## 📚 Tech Stack

- **Next.js** 16+ (App Router)
- **React** 19
- **Axios** (HTTP client)
- **JavaScript** (ES6+)
- (Tuỳ chọn) Tailwind CSS hoặc CSS modules

---

##  Bắt đầu

### 1. Yêu cầu môi trường

- Node.js 18.17+  
- npm hoặc yarn  
- Backend Spring Boot đang chạy (mặc định: `http://localhost:8080`)

### 2. Cài đặt

```bash
# Clone repo
git clone https://github.com/Shinx99/OneClick-authService-fe.git
cd authservice-fe
```
```bash
# Cài dependencies
npm install
```

3. Cấu hình biến môi trường
Tạo file .env.local từ template:

```bash
cp .env.example .env
```
Cập nhật giá trị trong .env.local nếu cần:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Cài Axios 
```bash
npm install axios
```

5. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt tại:
http://localhost:3000


### Check list 

```bash
| Bước | Lệnh                       | Mục đích                      |
| ---- | -------------------------- | ----------------------------- |
| 1️⃣   | git clone <REPO_URL>       | Clone project về              |
| 2️⃣   | cd authservice-fe          | Di chuyển vào thư mục project |
| 3️⃣   | npm install                | Cài tất cả dependencies       |
| 4️⃣   | cp .env.example .env.local | Tạo file environment          |
| 5️⃣   | Chỉnh sửa .env.local       | Cấu hình URL backend          |
| 6️⃣   | npm run dev                | Chạy development server       |
| 7️⃣   | Mở http://localhost:3000   | Kiểm tra app                  |
```# OneClick-authService-fe
