# Plan: Join Company Request Feature

## Mục tiêu
Thay thế mock data trong JoinCompanyScreen bằng API thật, cho phép employer tìm kiếm công ty và gửi yêu cầu gia nhập. Đồng thời thêm API service methods cho owner duyệt/từ chối yêu cầu (phục vụ TeamManager sau).

## Các file cần sửa/tạo

### 1. `src/services/company.service.js` — Thêm API methods
- `sendJoinRequest(companyId, message)` → POST `/recruitment/company/{companyId}/join-request`
- `getJoinRequests(params)` → GET `/recruitment/company/join-requests`
- `approveJoinRequest(requestId)` → PUT `/recruitment/company/join-request/{requestId}/approve`
- `rejectJoinRequest(requestId)` → PUT `/recruitment/company/join-request/{requestId}/reject`

### 2. `src/components/features/employer/setup/JoinCompanyScreen.jsx` — Refactor chính
- Xóa mock data `EXISTING_COMPANIES`
- Thêm search với debounce gọi `companyService.getAllCompanies({ keyword, page, size })`
- Hiển thị kết quả search thật (logo từ API, company name, industry, size)
- Khi submit: gọi `companyService.sendJoinRequest(companyId, message)`
- Set localStorage flags (`hasCompany: "1"`, `companyStatus: "pending"`) sau khi thành công
- Xử lý errors: 400 (đã có công ty/đã gửi), 404 (công ty không tồn tại)
- Chuyển sang `PendingApprovalScreen` sau khi gửi thành công

### 3. `src/components/common/employer-dashboard/TopNav.jsx` — Fix duplicate code
- File hiện tại bị duplicate (có 2 lần `export default TopNav` và code thừa ở cuối)

## Flow
1. Employer vào `/employer/setup` → chọn "Gia nhập công ty"
2. `JoinCompanyScreen` hiện search bar → gõ keyword → debounce 500ms → gọi API
3. Hiển thị danh sách công ty từ API → chọn 1 công ty
4. Chọn vai trò (HR Tổng / HR Phụ) — giữ nguyên UI hiện tại
5. Bấm "Gửi yêu cầu" → POST join-request → toast success → chuyển sang pending screen
6. localStorage flags được set → RestrictedWrapper hiện popup "đang chờ duyệt"

## Thứ tự thực hiện
1. Thêm API methods vào `company.service.js`
2. Refactor `JoinCompanyScreen.jsx` (search + submit)
3. Fix TopNav duplicate code
