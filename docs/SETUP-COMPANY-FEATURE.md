# Feature: Xac Thuc Doanh Nghiep (Company Setup Flow)

## Muc luc

1. [Tong quan](#1-tong-quan)
2. [Cac file lien quan](#2-cac-file-lien-quan)
3. [Flow tong the](#3-flow-tong-the)
4. [Giai thich chi tiet tung file](#4-giai-thich-chi-tiet-tung-file)
5. [API Endpoints](#5-api-endpoints)
6. [Luu tru trang thai (localStorage)](#6-luu-tru-trang-thai-localstorage)
7. [Dev Override (Tinh nang cho developer)](#7-dev-override)

---

## 1. Tong quan

Khi mot employer (nha tuyen dung) dang nhap vao he thong lan dau, ho chua co cong ty nao.
He thong se **khoa dashboard** va bat buoc ho phai **xac thuc doanh nghiep** truoc khi
co the dang tin tuyen dung, tim kiem ung vien, v.v.

Co 2 cach de employer co cong ty:
- **Tao cong ty moi**: Dien thong tin phap ly, upload giay phep DKKD → gui admin duyet.
- **Gia nhap cong ty co san**: Tim cong ty tren he thong, gui yeu cau → owner cong ty duyet.

Sau khi gui thanh cong, employer se o trang thai **"cho duyet"** cho den khi admin/owner
phe duyet. Luc do dashboard moi mo khoa hoan toan.

---

## 2. Cac file lien quan

```
src/
├── context/
│   └── SetupPopupContext.jsx          # Context cho dev toggle (tat/bat popup)
│
├── app/(employer-dashboard)/
│   ├── layout.jsx                     # Layout chinh cua employer dashboard
│   └── employer/setup/
│       └── page.jsx                   # Trang /employer/setup (dieu phoi cac man hinh)
│
├── components/
│   ├── common/employer-dashboard/
│   │   └── TopNav.jsx                 # Thanh dieu huong tren cung (co nut dev toggle)
│   │
│   └── features/employer/
│       ├── auth/
│       │   └── RestrictedWrapper.jsx  # Component khoa dashboard + hien popup
│       │
│       └── setup/
│           ├── SelectFlowScreen.jsx   # Man hinh chon: "Tao moi" hay "Gia nhap"
│           ├── CreateCompanyScreen.jsx # Form tao cong ty moi (UI)
│           ├── useCreateCompany.js    # Logic xu ly tao cong ty (hook)
│           ├── JoinCompanyScreen.jsx  # Man hinh tim va gia nhap cong ty
│           ├── PendingApprovalScreen.jsx # Man hinh "Cho duyet"
│           └── SetupSidebar.jsx       # Sidebar ben trai cua trang setup
│
└── services/
    └── company.service.js             # Tat ca API calls lien quan company
```

---

## 3. Flow tong the

```
Employer dang nhap
       |
       v
Layout.jsx kiem tra quyen (isRecruiter?)
       |
       ├── KHONG phai recruiter → redirect /login
       |
       └── LA recruiter → Render dashboard
              |
              v
       RestrictedWrapper kiem tra localStorage
              |
              ├── hasCompany = CHUA CO (none)
              │      |
              │      v
              │   Hien popup "Yeu cau xac thuc doanh nghiep"
              │      |
              │      v  (User click "Xac thuc ngay")
              │   Redirect toi /employer/setup
              │      |
              │      v
              │   SelectFlowScreen (Buoc 1: Chon flow)
              │      |
              │      ├── Click "Tao cong ty moi"
              │      │      |
              │      │      v
              │      │   CreateCompanyScreen (Buoc 2a)
              │      │      |  Dien form → click "Gui ho so duyet"
              │      │      v
              │      │   useCreateCompany.js:
              │      │      1. Validate form
              │      │      2. Goi API POST /recruitment/company
              │      │      3. Upload logo (neu co)
              │      │      4. Luu localStorage: hasCompany=1, companyStatus=pending
              │      │      5. Goi onSuccess() → chuyen sang man pending
              │      │
              │      └── Click "Gia nhap cong ty"
              │             |
              │             v
              │          JoinCompanyScreen (Buoc 2b)
              │             |  Chon cong ty → click "Gui yeu cau gia nhap"
              │             v
              │          Goi API POST /recruitment/company/{id}/join-request
              │             |
              │             v
              │          onSuccess() → chuyen sang man pending
              │
              │      (Ca 2 flow deu den day)
              │             |
              │             v
              │      PendingApprovalScreen (Buoc 3: Cho duyet)
              │          Hien thong bao "Da gui thanh cong, cho admin/owner duyet"
              │          Nut "Ve Dashboard"
              │
              ├── companyStatus = "pending"
              │      |
              │      v
              │   Hien popup "Dang cho admin duyet" (khong cho dung dashboard)
              │
              └── companyStatus = "verified"
                     |
                     v
                  MO KHOA dashboard binh thuong
```

---

## 4. Giai thich chi tiet tung file

---

### 4.1. `SetupPopupContext.jsx`

**Muc dich**: Tao mot React Context de dev co the tat/bat popup xac thuc ma khong can
thay doi localStorage.

**Code chay nhu nao**:

```
SetupPopupProvider
    |
    ├── State: devOverride (mac dinh = null)
    │      null  = khong override, de RestrictedWrapper tu quyet dinh
    │      false = ep AN popup (dev mode - mo khoa)
    │      true  = ep HIEN popup (khoa lai)
    │
    ├── toggleDevOverride():
    │      null → false (tat popup)
    │      true → false (tat popup)
    │      false → null (bat lai popup, de RestrictedWrapper tu quyet)
    │
    └── isDevUnlocked = (devOverride === false)
           true  → popup bi an, dashboard mo khoa
           false → popup hien binh thuong
```

**Tai sao can cai nay?**
Khi dev dang lam viec, ho khong muon phai tao company that moi co the xem dashboard.
Nut toggle tren TopNav cho phep dev tat popup nhanh chong.

---

### 4.2. `layout.jsx` (Employer Dashboard Layout)

**Muc dich**: Layout bao boc TOAN BO cac trang trong employer dashboard.

**Code chay nhu nao**:

```
EmployerDashboardLayout
    |
    v
SetupPopupProvider (boc tat ca children)
    |
    v
EmployerDashboardContent
    |
    ├── Lay isRecruiter, isLoading tu AuthContext
    │
    ├── NEU dang loading → hien "Dang kiem tra quyen truy cap..."
    │
    ├── NEU khong phai recruiter → toast loi + redirect /login
    │
    └── NEU la recruiter → Render:
           ┌──────────────────────────────────────┐
           │  Sidebar (fixed ben trai, w-64)      │
           │         ┌───────────────────────────┐ │
           │         │ TopNav (sticky tren cung) │ │
           │         ├───────────────────────────┤ │
           │         │                           │ │
           │         │   {children}              │ │
           │         │   (noi dung trang)        │ │
           │         │                           │ │
           │         └───────────────────────────┘ │
           └──────────────────────────────────────┘
```

**Diem quan trong**:
- `SetupPopupProvider` o day → tat ca page con deu dung duoc `useSetupPopup()`.
- `pl-64` = padding-left 256px de noi dung khong bi de boi Sidebar (vi Sidebar la fixed).

---

### 4.3. `TopNav.jsx`

**Muc dich**: Thanh dieu huong phia tren cua dashboard.

**Code chay nhu nao**:

```
TopNav
    |
    ├── Lay user tu AuthContext (de hien ten, email, avatar)
    ├── Lay isDevUnlocked, toggleDevOverride tu SetupPopupContext
    │
    └── Render 3 khu vuc:
           ┌─────────────┬──────────────────┬──────────────────┐
           │  BEN TRAI   │     GIUA         │    BEN PHAI      │
           │             │                  │                  │
           │  Nut Dev    │  Thanh tim kiem  │  Nut Dang tin    │
           │  Toggle     │  (Search bar)    │  Notification    │
           │  (o khoa)   │                  │  Avatar user     │
           └─────────────┴──────────────────┴──────────────────┘
```

**Nut Dev Toggle hoat dong nhu nao**:
- Click → goi `toggleDevOverride()`
- Neu dang khoa (isDevUnlocked = false): hien icon FaLock + text "Mo khoa"
- Neu da mo khoa (isDevUnlocked = true): hien icon FaLockOpen + text "Da mo khoa"
  va doi mau xanh emerald de dev biet popup da bi tat.

---

### 4.4. `RestrictedWrapper.jsx`

**Muc dich**: Day la component **QUAN TRONG NHAT** cua feature nay. No quyet dinh
employer co duoc dung dashboard hay khong.

**Code chay nhu nao**:

```
RestrictedWrapper
    |
    ├── Doc localStorage khi mount (useEffect):
    │      hasCompany = localStorage.getItem("hasCompany")
    │      companyStatus = localStorage.getItem("companyStatus")
    │
    │      NEU hasCompany !== "1"         → companyState = "none"
    │      NEU hasCompany === "1" VA status === "verified" → companyState = "verified"
    │      CON LAI (hasCompany === "1" nhung chua verified) → companyState = "pending"
    │
    ├── Tinh toan locked:
    │      locked = KHONG phai dev override
    │               VA (companyState === "none" HOAC "pending")
    │
    │      → Neu locked = true: khoa dashboard
    │      → Neu locked = false: mo khoa binh thuong
    │
    └── Render:
           ┌──────────────────────────────────────────┐
           │                                          │
           │   {children} ← noi dung dashboard        │
           │   (NEU locked: bi blur, mo, ko click dc) │
           │                                          │
           │   ┌──────────────────────────┐           │
           │   │                          │           │ ← POPUP (hien de tren)
           │   │  NEU companyState="none" │           │
           │   │  → "Yeu cau xac thuc"   │           │
           │   │  → Nut "Xac thuc ngay"  │           │
           │   │    (redirect /setup)     │           │
           │   │                          │           │
           │   │  NEU companyState=       │           │
           │   │     "pending"            │           │
           │   │  → "Dang cho admin duyet"│           │
           │   │  → Timeline 3 buoc      │           │
           │   │                          │           │
           │   └──────────────────────────┘           │
           └──────────────────────────────────────────┘
```

**CSS khi locked**:
- `opacity-30`: lam mo noi dung xuong 30%
- `grayscale-[40%]`: chuyen 40% sang trang den
- `pointer-events-none`: khong the click vao bat ky dau
- `select-none`: khong the boi den text
- `blur-[4px]`: lam nhoe nhe 4px

---

### 4.5. `page.jsx` (Setup Page - /employer/setup)

**Muc dich**: Trang chinh dieu phoi toan bo flow setup.

**Code chay nhu nao**:

```
SetupBusinessPage
    |
    ├── State: flowMode ("select" | "create" | "join" | "pending")
    ├── State: successInfo (luu ten cong ty + flowType sau khi thanh cong)
    │
    ├── backToSelect(): set flowMode = "select"
    ├── handleCreateSuccess(info): luu info → set flowMode = "pending"
    ├── handleJoinSuccess(info): luu info → set flowMode = "pending"
    │
    └── Render:
           ┌──────────────────────────────────────┐
           │  Background: nen slate-900 +          │
           │  gradient xanh emerald phia tren      │
           │                                       │
           │  ┌───────────┬──────────────────────┐ │
           │  │           │                      │ │
           │  │  Setup    │  flowMode="select"   │ │
           │  │  Sidebar  │  → SelectFlowScreen  │ │
           │  │  (30%)    │                      │ │
           │  │           │  flowMode="create"   │ │
           │  │  Hien:    │  → CreateCompanyScreen│ │
           │  │  - Logo   │                      │ │
           │  │  - Buoc   │  flowMode="join"     │ │
           │  │  - Mo ta  │  → JoinCompanyScreen │ │
           │  │  - Nut    │                      │ │
           │  │    quay   │  flowMode="pending"  │ │
           │  │    lai    │  → PendingApproval   │ │
           │  │           │                      │ │
           │  └───────────┴──────────────────────┘ │
           └──────────────────────────────────────┘
```

**Diem quan trong**:
- `flowMode` la state trung tam dieu khien man hinh nao duoc hien.
- Khi `onSuccess` duoc goi (tu CreateCompany hoac JoinCompany) → chuyen sang "pending".
- Component nay la fullscreen (`fixed inset-0 z-[100]`) de phu len toan bo trang.

---

### 4.6. `SetupSidebar.jsx`

**Muc dich**: Sidebar ben trai cua trang setup, hien thong tin buoc hien tai.

**Code chay nhu nao**:

```
SetupSidebar nhan prop: flowMode, onBack
    |
    ├── TITLES va DESCRIPTIONS: 2 object map flowMode → text tuong ung
    │      select  → "Khoi tao khong gian" / "Chon tao moi neu..."
    │      create  → "Tao cong ty moi" / "Dien day du thong tin..."
    │      join    → "Gia nhap to chuc" / "Tim kiem cong ty..."
    │      pending → "Cho phe duyet" / "Ho so da gui thanh cong..."
    │
    ├── Buoc hien tai:
    │      select         → "Buoc 1 / 3"
    │      create / join  → "Buoc 2 / 3"
    │      pending        → "Hoan tat"
    │
    └── Nut quay lai (handleBack):
           NEU flowMode = "pending" → router.push("/employer/dashboard")
           NEU flowMode != "select" → goi onBack() (quay ve SelectFlowScreen)
           NEU flowMode = "select" → router.push("/employer/dashboard")
```

---

### 4.7. `SelectFlowScreen.jsx`

**Muc dich**: Man hinh dau tien (Buoc 1) de employer chon 1 trong 2 flow.

**Code chay nhu nao**:

```
SelectFlowScreen nhan prop: onSelect
    |
    ├── OPTIONS: mang 2 phan tu dinh nghia san:
    │      [0] mode="create" → icon FaBuilding, title "Tao cong ty moi"
    │      [1] mode="join"   → icon FaUsers, title "Gia nhap cong ty"
    │
    └── Render:
           ┌────────────────────────────────┐
           │  Badge: "Bat dau"              │
           │  Title: "Xac thuc doanh nghiep"│
           │  Subtitle: "Ban muon tao moi   │
           │  hay gia nhap?"                │
           │                                │
           │  ┌──────────────────────────┐  │
           │  │ [icon] Tao cong ty moi   │  │ ← Click → onSelect("create")
           │  │ Mo ta...              →  │  │
           │  └──────────────────────────┘  │
           │                                │
           │  ┌──────────────────────────┐  │
           │  │ [icon] Gia nhap cong ty  │  │ ← Click → onSelect("join")
           │  │ Mo ta...              →  │  │
           │  └──────────────────────────┘  │
           │                                │
           │  [Goi y]: "Chua chac chan?     │
           │  Tim kiem ten cong ty trong    │
           │  muc Gia nhap..."             │
           └────────────────────────────────┘

    Khi click → onSelect("create" hoac "join")
    → Parent (page.jsx) se setFlowMode → render man hinh tuong ung
```

---

### 4.8. `CreateCompanyScreen.jsx` + `useCreateCompany.js`

**Muc dich**: Form de tao cong ty moi (Buoc 2a).

#### CreateCompanyScreen.jsx (UI)

Chi la giao dien, KHONG co logic. Tat ca logic nam trong hook `useCreateCompany`.

```
CreateCompanyScreen nhan prop: onCancel, onSuccess
    |
    ├── Goi hook: useCreateCompany({ onSuccess })
    │   → Tra ve: formData, setField, logoFile, docFile, isLoading, handleSubmit,...
    │
    └── Render form:
           ┌────────────────────────────────────────┐
           │  Title: "Thong tin phap ly cong ty"     │
           │                                         │
           │  ┌─ Nhom phap ly (vien xanh) ─────────┐│
           │  │ [input] Ten cong ty *               ││
           │  │ [input] Ma so thue *                ││
           │  │ [input] Nguoi dai dien phap luat    ││
           │  └─────────────────────────────────────┘│
           │                                         │
           │  [select] Nganh nghe    [select] Quy mo*│
           │  [select] Tinh/TP      [input] Website  │
           │  [input] Dia chi chi tiet                │
           │  [textarea] Gioi thieu tong quan *       │
           │                                         │
           │  ┌─────────────┐ ┌─────────────┐       │
           │  │ Upload Logo │ │ Upload DKKD │       │
           │  │ (tuy chon)  │ │ (bat buoc)  │       │
           │  └─────────────┘ └─────────────┘       │
           │                                         │
           │  [Huy]                   [Gui ho so duyet]│
           └────────────────────────────────────────┘
```

**Cac sub-component noi bo** (chi dung trong file nay):
- `FieldLabel`: Hien label cua input (uppercase, nho, co 2 tone mau)
- `IconInput`: Input co icon ben trai
- `IconSelect`: Select dropdown co icon ben trai
- `FileUpload`: Khu vuc upload file (keo tha hoac click chon)

#### useCreateCompany.js (Logic)

```
useCreateCompany({ onSuccess })
    |
    ├── State:
    │   formData = { company_name, tax_code, business_rep_name,
    │                industry, size_range, province_code,
    │                address, website_url, overview }
    │   logoFile = null (file anh logo)
    │   docFile = null (file giay phep)
    │   isLoading = false
    │
    ├── setField(key, value): cap nhat 1 truong trong formData
    │      VD: setField("company_name", "FPT Software")
    │      → formData = { ...formData, company_name: "FPT Software" }
    │
    ├── handleDrop(event, type): xu ly keo tha file vao upload area
    │      type="logo" + file la image → setLogoFile(file)
    │      type="doc"                  → setDocFile(file)
    │      khong hop le               → toast loi
    │
    ├── validate(): kiem tra form truoc khi gui
    │      - company_name rong?     → "Vui long nhap ten cong ty!"
    │      - tax_code rong?         → "Vui long nhap ma so thue!"
    │      - tax_code > 20 ky tu?  → "Ma so thue toi da 20 ky tu!"
    │      - tax_code co ky tu la? → "Ma so thue chi chua so va dau -"
    │      - size_range rong?       → "Vui long chon quy mo!"
    │      - overview rong?         → "Vui long nhap gioi thieu!"
    │      - website sai format?    → "Website phai bat dau bang http(s)://"
    │      - Tat ca OK              → return null
    │
    ├── buildPayload(): chuyen formData (snake_case) → payload (camelCase) cho BE
    │      formData.company_name → payload.companyName
    │      formData.tax_code     → payload.taxCode
    │      formData.size_range   → payload.sizeRange
    │      ... (loc bo truong rong)
    │
    └── handleSubmit(): FLOW CHINH khi user click "Gui ho so duyet"
           |
           ├── Buoc 1: validate()
           │   NEU co loi → toast.error(loi) → DUNG LAI
           │
           ├── Buoc 2: setIsLoading(true) + toast.loading("Dang khoi tao...")
           │
           ├── Buoc 3: Goi API tao company
           │   const res = await companyService.createCompany(buildPayload())
           │   const companyId = res?.data?.companyId
           │
           ├── Buoc 4: Upload logo (best-effort)
           │   NEU co logoFile:
           │      TRY: await companyService.uploadCompanyLogo(logoFile)
           │      CATCH: toast("Upload logo that bai, co the tai lai sau")
           │      → KHONG dung lai, van tiep tuc flow
           │
           ├── Buoc 5: Luu localStorage
           │   localStorage.setItem("hasCompany", "1")
           │   localStorage.setItem("companyStatus", "pending")
           │   localStorage.setItem("companyId", companyId)
           │
           ├── Buoc 6: toast.success("Tao thanh cong!")
           │
           ├── Buoc 7: Goi onSuccess({ companyId, companyName })
           │   → Parent (page.jsx) se setFlowMode("pending")
           │   → Hien PendingApprovalScreen
           │
           └── XU LY LOI:
                  status 403 → "Khong co quyen (can role recruiter)"
                  "already has a company" → luu localStorage + redirect dashboard
                  "hasn't verified profile" → toast loi + redirect dashboard
                  Loi khac → hien message tu BE
```

---

### 4.9. `JoinCompanyScreen.jsx`

**Muc dich**: Man hinh tim va gia nhap cong ty co san (Buoc 2b).

**Code chay nhu nao**:

```
JoinCompanyScreen nhan prop: onCancel, onSuccess
    |
    ├── State:
    │   searchQuery = "" (text user go vao o search)
    │   debouncedQuery = "" (text sau khi cho 400ms)
    │   companies = [] (danh sach cong ty tu API)
    │   page = 0 (trang hien tai, bat dau tu 0)
    │   totalPages = 0
    │   selectedCompany = null (cong ty user da click chon)
    │   message = "" (loi nhan gui kem yeu cau)
    │   isSubmitting = false
    │
    ├── DEBOUNCE SEARCH (useEffect):
    │   Moi khi searchQuery thay doi:
    │      Huy timer cu (clearTimeout)
    │      Dat timer moi: sau 400ms → set debouncedQuery = searchQuery
    │
    │   Tai sao can debounce?
    │   → User go "FPT" → tung ky tu: "F", "FP", "FPT"
    │   → Khong co debounce: goi API 3 lan (lang phi)
    │   → Co debounce 400ms: chi goi API 1 lan voi "FPT"
    │
    ├── FETCH COMPANIES (useEffect + useCallback):
    │   Moi khi debouncedQuery HOAC page thay doi:
    │      → Goi companyService.getAllCompanies({ page, size: 10, keyword })
    │      → Cap nhat: companies, totalPages, totalElements
    │      → Hien spinner khi dang loading
    │
    ├── RENDER:
    │   ┌──────────────────────────────────────┐
    │   │  Title: "Chon cong ty de gia nhap"   │
    │   │                                       │
    │   │  [Search input voi debounce 400ms]    │
    │   │                                       │
    │   │  Danh sach cong ty:                   │
    │   │  ┌──────────────────────────────────┐ │
    │   │  │ [logo] Ten cong ty A             │ │ ← Click → selectedCompany
    │   │  │        Nganh • Quy mo        (o) │ │    (o) = radio button
    │   │  └──────────────────────────────────┘ │
    │   │  ┌──────────────────────────────────┐ │
    │   │  │ [logo] Ten cong ty B             │ │
    │   │  │        Nganh • Quy mo        ( ) │ │
    │   │  └──────────────────────────────────┘ │
    │   │                                       │
    │   │  Trang 1/5 — 48 cong ty   [<] [>]    │ ← Phan trang
    │   │                                       │
    │   │  (Hien sau khi chon cong ty:)         │
    │   │  ┌──────────────────────────────────┐ │
    │   │  │ Loi nhan gui cong ty (tuy chon)  │ │
    │   │  │ [textarea]                       │ │
    │   │  │ "Yeu cau se gui toi Owner cua    │ │
    │   │  │  Cong ty A de phe duyet."        │ │
    │   │  └──────────────────────────────────┘ │
    │   │                                       │
    │   │  [Huy]            [Gui yeu cau gia nhap]│
    │   └──────────────────────────────────────┘
    │
    └── handleSubmit(): khi click "Gui yeu cau gia nhap"
           |
           ├── Kiem tra: da chon cong ty chua?
           │   CHUA → toast.error("Vui long chon cong ty!")
           │
           ├── Chong spam: neu submittingRef.current = true → bo qua
           │   (Ref dung thay vi state vi ref cap nhat NGAY LAP TUC,
           │    state can re-render moi cap nhat)
           │
           ├── Goi API:
           │   companyService.sendJoinRequest(companyId, message)
           │
           ├── THANH CONG:
           │   toast.success("Gui yeu cau thanh cong!")
           │   Goi onSuccess({ companyName, requestData, flowType: "join" })
           │   → Parent chuyen sang PendingApprovalScreen
           │
           └── THAT BAI:
                  Doc err.response.data.message
                  NEU message chung chung (unexpected error, internal server error)
                  → Thay bang: "Ban da gui yeu cau hoac da thuoc mot cong ty"
                  toast.error(message cu the)
```

---

### 4.10. `PendingApprovalScreen.jsx`

**Muc dich**: Man hinh cuoi (Buoc 3) bao user rang yeu cau da duoc gui.

**Code chay nhu nao**:

```
PendingApprovalScreen nhan prop: companyName, flowType ("create" | "join")
    |
    └── Render:
           ┌──────────────────────────────────────┐
           │          [icon tick xanh lon]          │
           │                                        │
           │     Badge: "Dang cho duyet"            │
           │                                        │
           │  NEU flowType = "join":                │
           │     "Yeu cau gia nhap da duoc gui!"    │
           │  NEU flowType = "create":              │
           │     "Xac thuc cong ty thanh cong!"     │
           │                                        │
           │  Ten cong ty: {companyName}             │
           │                                        │
           │  Mo ta:                                │
           │  - join: "Owner se phe duyet..."       │
           │  - create: "Admin duyet trong 24h..."  │
           │                                        │
           │  Timeline:                             │
           │  ┌────────────────────────────────┐    │
           │  │ [v] Gui ho so / yeu cau        │    │ ← Hoan tat (xanh)
           │  │ [~] Admin/Owner dang duyet...   │    │ ← Dang xu ly (vang)
           │  │ [3] Bat dau tuyen dung          │    │ ← Chua den (xam)
           │  └────────────────────────────────┘    │
           │                                        │
           │        [Ve Dashboard →]                │
           └──────────────────────────────────────┘
```

---

### 4.11. `company.service.js`

**Muc dich**: Tap trung TAT CA API calls lien quan den company.

```
companyService = {

  // === DOC DU LIEU ===

  getTop6Companies()
      GET /recruitment/company/top-6
      → Lay top 6 cong ty (cho trang chu)

  getAllCompanies({ page, size, keyword })
      GET /recruitment/company/all?page=0&size=10&keyword=FPT
      → Lay danh sach cong ty (co phan trang + tim kiem)
      → Dung trong JoinCompanyScreen

  getCompanyById(companyId)
      GET /recruitment/company/{companyId}
      → Lay chi tiet 1 cong ty

  getCompanyFilters()
      GET /recruitment/company/filters
      → Lay bo loc (nganh nghe, quy mo,...)

  getJobsByCompanyId(companyId, params)
      GET /recruitment/company/{companyId}/jobs
      → Lay danh sach viec lam cua 1 cong ty

  // === TAO CONG TY ===

  createCompany(payload)
      POST /recruitment/company
      Body: { companyName, taxCode, sizeRange, overview, industry,... }
      → Tao cong ty moi
      → Dung trong useCreateCompany.js

  // === UPLOAD ===

  uploadCompanyLogo(file)
      PUT /recruitment/company/logo/upload
      Body: FormData { logoImage: file }
      → Upload logo cong ty

  uploadCompanyBackground(file)
      PUT /recruitment/company/background/upload
      Body: FormData { backgroundImage: file }
      → Upload anh bia cong ty

  // === JOIN REQUEST (GIA NHAP) ===

  sendJoinRequest(companyId, message)
      POST /recruitment/company/{companyId}/join-request
      Body: { message: "..." } (tuy chon)
      → Employer gui yeu cau gia nhap
      → Dung trong JoinCompanyScreen

  getJoinRequests({ page, size })
      GET /recruitment/company/join-requests
      → Owner xem danh sach yeu cau dang cho

  approveJoinRequest(requestId)
      PUT /recruitment/company/join-request/{requestId}/approve
      → Owner duyet yeu cau

  rejectJoinRequest(requestId)
      PUT /recruitment/company/join-request/{requestId}/reject
      → Owner tu choi yeu cau
}
```

---

## 5. API Endpoints

| Method | Endpoint | Muc dich | Dung trong file |
|--------|----------|----------|-----------------|
| GET | `/recruitment/company/all` | Lay DS cong ty (search + paging) | JoinCompanyScreen |
| POST | `/recruitment/company` | Tao cong ty moi | useCreateCompany |
| PUT | `/recruitment/company/logo/upload` | Upload logo | useCreateCompany |
| POST | `/recruitment/company/{id}/join-request` | Gui yeu cau gia nhap | JoinCompanyScreen |
| GET | `/recruitment/company/join-requests` | Owner xem DS yeu cau | (chua dung trong feature nay) |
| PUT | `/recruitment/company/join-request/{id}/approve` | Owner duyet | (chua dung trong feature nay) |
| PUT | `/recruitment/company/join-request/{id}/reject` | Owner tu choi | (chua dung trong feature nay) |

---

## 6. Luu tru trang thai (localStorage)

Feature nay dung localStorage de luu trang thai company cua employer:

| Key | Gia tri | Y nghia |
|-----|---------|---------|
| `hasCompany` | `"1"` hoac khong co | Employer da co company hay chua |
| `companyStatus` | `"pending"` / `"verified"` | Trang thai duyet cua company |
| `companyId` | `"abc-123-..."` | ID cua company (de dung o cac trang khac) |

**RestrictedWrapper doc cac key nay de quyet dinh hien popup nao:**
- Khong co `hasCompany` → popup "Yeu cau xac thuc"
- Co `hasCompany` + status `pending` → popup "Dang cho duyet"
- Co `hasCompany` + status `verified` → mo khoa

**Luu y**: Day la giai phap TAM THOI. Sau nay se thay bang API call
`GET /api/recruitment/employer/profile` de lay trang thai that tu server.

---

## 7. Dev Override

Tinh nang nay chi danh cho developer khi dang phat trien:

**Van de**: Khi dev lam viec tren cac trang dashboard khac (VD: trang quan ly tin tuyen dung),
ho bi popup xac thuc chan lai vi chua co company that tren he thong.

**Giai phap**: Nut toggle tren TopNav cho phep dev tat popup tam thoi.

**Cach su dung**:
1. Dang nhap voi tai khoan recruiter
2. Nhin len TopNav → ben trai co nut hinh o khoa
3. Click vao → text doi thanh "Da mo khoa" (mau xanh)
4. Popup bien mat → co the dung dashboard binh thuong
5. Click lai → popup tro lai

**Code flow**:
```
TopNav: click nut → toggleDevOverride()
    |
    v
SetupPopupContext: devOverride = null → false (isDevUnlocked = true)
    |
    v
RestrictedWrapper: locked = !isDevUnlocked && (...) = !true && (...) = false
    |
    v
Popup khong hien → dashboard mo khoa
```

**Luu y**: Dev override chi ton tai trong phien lam viec hien tai (state React).
Khi refresh trang, no se reset ve mac dinh (popup hien lai).
