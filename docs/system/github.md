# Git Workflow Guide

Quy trình Git đơn giản cho team Auth Service Frontend.

---

## 📊 Branch Strategy
```text
main (production)
└── develop (development)
├── feat/nam/user-login-#1
├── feat/vuong/user-profile-#2
└── fix/vu/email-validation-#3
```

**Branch chính:**
- `main`: Code production, đã release
- `develop`: Code development, chuẩn bị release

**Branch làm việc:**
- `feat/{tên}/{feature}-#{issue}`: Tính năng mới
- `fix/{tên}/{bug}-#{issue}`: Sửa bug thường
- `hotfix/{tên}/{urgent}-#{issue}`: Sửa bug khẩn cấp production

---

## 🌳 Các loại Branch

| Branch | Mục đích | Branch từ | Merge về | Xóa sau merge |
|--------|----------|-----------|----------|---------------|
| `main` | Production code | - | - | `❌`|
| `develop` | Development code | main | - | `❌` |
| `feat/` | Tính năng mới | develop | develop | ✅ |
| `fix/` | Sửa bug thường | develop | develop | ✅ |
| `hotfix/` | Sửa bug khẩn cấp | main | main + develop | ✅ |

---

## 🏷️ Branch Naming Convention

### Công thức
```text
{type}/{your-name}/{feature}-#{issue-id}
```


### Các thành phần

- `{type}`: `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`
- `{your-name}`: Tên viết thường, không dấu (vd: `nam`, `vuong`, `vu`)
- `{feature}`: Mô tả ngắn gọn, tiếng Anh, dùng dấu `-`
- `#{issue-id}`: Số issue trên GitHub

### Ví dụ

```bash
feat/nam/user-login-#1
feat/vuong/profile-page-#2
fix/vu/email-validation-#3
hotfix/trac/auth-crash-#10
refactor/hai/api-service-#15
docs/trung/update-readme-#20
```

## 📝 Commit Message Convention
Format

```text
<type>(<scope>): <subject>
```

⚠️ LƯU Ý: KHÔNG có tên người trong commit message!
Types
|Type |	Khi nào dùng |	Ví dụ |
|-----|--------------|--------|
|feat	| Tính năng mới |	feat(profile): add user profile form |
|fix |	Sửa bug |	fix(auth): resolve login validation bug |
|docs |	Cập nhật | docs	docs: update API integration guide |
|style |	Format code |	style: run prettier |
|refactor |	Refactor code |	refactor(auth): simplify token logic |
|test |	Tests |	test(auth): add login unit tests |
|chore |	Maintenance |	chore: update dependencies |

**Ví dụ:**

```bash
✅ feat(auth): add login form with validation
✅ fix(api): handle network timeout error
✅ docs: update troubleshooting guide
✅ refactor(profile): extract validation logic

❌ nam/feature(auth): add login form      # SAI - có tên người
❌ feature(auth): add login               # SAI - type phải ngắn
❌ update code                            # SAI - quá chung chung
```
---

## 🚀 Quy trình làm việc
**Bước 1: Tạo branch**
```bash
# Luôn update develop trước
git checkout develop
git pull origin develop
# Tạo branch theo convention
git checkout -b feat/nam/user-login-#1
```
**Bước 2: Code & commit**
```bash
# Code xong một phần → commit
git add .
git commit -m "feat(auth): add login form UI"
```
```bash
Quy tắc commit:
Mỗi commit = 1 thay đổi logic nhỏ
Message ngắn gọn (< 50 ký tự)
Theo format: type(scope): description
```
**Bước 3: Push**
```bash
# Push branch lên remote
git push origin feat/nam/user-login-#1
```
**Bước 4: Tạo Pull Request Trên GtHub**

Vào repository → Pull Requests → New Pull Request

Chọn:
```text
Base: develop
Compare: feat/nam/user-login-#1
```
Điền thông tin:
```text
Title:
{Tên của bạn} {Feature} #{issue-id}
```
**Ví dụ:**

```bash
Nam User Login #1
Vuong User Profile #2
Vu Fix Email Validation #3
Description:

#📋 Descripton
Thêm form login với validation email/password

# ✨ Những việc đã làm
- Tạo LoginForm component
- Thêm validation
- Tích hợp với auth API
- Thêm error handling

# 🧪 Testing
- [x] Manual testing trên Chrome/Firefox
- [x] Responsive trên mobile
- [x] Không có console errors

# 🔗 Related Issues

Closes #1

Reviewers:
Tag: Team Lead hoặc người quản lý
```
**Bước 5: Sau khi merge**

```bash
# Update develop local
git checkout develop
git pull origin develop

# Xóa branch đã merge
git branch -d feat/nam/user-login-#1
```
---
## **⚠️ Quy tắc quan trọng**

`❌` ĐỪNG làm:
- Commit trực tiếp vào main
- Commit trực tiếp vào develop
- Force push: git push -f lên main/develop
- Merge PR của chính mình (cần review)
- Dùng tên người trong commit message

`✅` NÊN làm:
- Luôn tạo branch riêng
- Mọi thay đổi qua Pull Request
- Ít nhất 1 người review trước merge
- Xóa branch sau khi merge
- Commit message theo convention

`✅` Checklist nhanh
Khi bắt đầu task:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/tên/feature-#issue
```

Khi code:

```bash
git add .
git commit -m "feat(scope): description"  # KHÔNG có tên người!
```
Khi push:

```bash
git push origin feat/tên/feature-#issue
```

Khi tạo PR:
```text
Title: {Tên} {Feature} #{issue-id}

Description: Mô tả + checklist

Reviewers: Tag lead

Sau khi merge:
```

```bash
git checkout develop
git pull origin develop
git branch -d feat/tên/feature-#issue
```

## 💡 Ghi nhớ
- Branch để làm việc, PR để merge, main/develop để ổn định.
- Commit message KHÔNG có tên người, chỉ có trong branch name và PR title.
- Không chắc → hỏi lead, đừng đoán!

## 🆘 Hotfix (Khẩn cấp)
- Chỉ dùng khi có bug nghiêm trọng trên production:

```bash
# 1. Branch từ main
git checkout main
git pull origin main
git checkout -b hotfix/trac/auth-crash-#10

# 2. Fix & commit
git add .
git commit -m "hotfix: fix authentication crash"

# 3. Merge vào main
git checkout main
git merge hotfix/trac/auth-crash-#10
git tag v1.2.1
git push origin main --tags

# 4. Merge vào develop (QUAN TRỌNG!)
git checkout develop
git merge hotfix/trac/auth-crash-#10
git push origin develop

# 5. Cleanup
git branch -d hotfix/trac/auth-crash-#10

```

---
 #  Happy Coding! 