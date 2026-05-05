import { z } from "zod";

// ==========================================
// 1. CONSTANTS, HELPERS & COMMON RULES (Tái sử dụng & Dễ bảo trì)
// ==========================================

// Regex SĐT VN: 10 số, đầu 03, 05, 07, 08, 09
const vnPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

// --- Các hàm Helper mô phỏng chính xác logic từ PasswordUtil.java (Backend) ---

const COMMON_PASSWORDS = [
  "password",
  "12345678",
  "123456789",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
];

// Hàm kiểm tra ký tự liên tiếp (VD: 123, abc, 321, cba)
const hasSequentialCharacters = (password) => {
  const lower = password.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);

    // Kiểm tra chuỗi tăng dần hoặc giảm dần
    if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
      return true;
    }
  }
  return false;
};

// Hàm kiểm tra lặp ký tự (VD: aaa, 111)
const hasRepeatedCharacters = (password) => {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
      return true;
    }
  }
  return false;
};

// --- Chuẩn mật khẩu mạnh dùng chung (Đồng bộ 100% với Backend) ---
const strongPassword = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .max(128, "Mật khẩu không được vượt quá 128 ký tự") // Cập nhật theo max length của BE
  .regex(/[a-z]/, {
    message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
  })
  .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa" })
  .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số" })
  // Cập nhật lại regex ký tự đặc biệt cho khớp chuẩn với chuỗi Pattern của BE
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, {
    message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
  })
  .refine((val) => !COMMON_PASSWORDS.includes(val.toLowerCase()), {
    message: "Mật khẩu quá phổ biến và dễ đoán",
  })
  .refine((val) => !hasSequentialCharacters(val), {
    message:
      "Mật khẩu không được chứa chuỗi ký tự liên tiếp (VD: '123', 'abc')",
  })
  .refine((val) => !hasRepeatedCharacters(val), {
    message: "Mật khẩu không được chứa quá nhiều ký tự lặp lại (VD: 'aaa')",
  });

// ==========================================
// 2. SCHEMAS ĐỊNH NGHĨA FORM
// ==========================================

// --- Form Đăng Nhập ---
export const LoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập tên đăng nhập" })
    .max(255, { message: "Tên đăng nhập quá dài" }) // Tránh spam text
    .email({ message: "Email không đúng định dạng" }),

  password: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .max(128, { message: "Mật khẩu không hợp lệ" }), // Cập nhật max

  remember: z.boolean().optional(),
});

// --- Form Đăng ký ---
export const RegisterSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .regex(vnPhoneRegex, { message: "Số điện thoại không hợp lệ" }),

    username: z
      .string()
      .trim()
      .min(1, { message: "Vui lòng nhập Email" })
      .max(255, { message: "Email quá dài" })
      .email({ message: "Email không đúng định dạng" }),

    password: strongPassword,

    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),

    terms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với các điều khoản",
    }),

    isEmployer: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// --- Form Đăng ký Nhà tuyển dụng ---
export const EmployerRegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
      .max(100, { message: "Họ và tên tối đa 100 ký tự" }),

    email: z
      .string()
      .trim()
      .min(1, { message: "Vui lòng nhập Email" })
      .max(255, { message: "Email quá dài" })
      .email({ message: "Email không đúng định dạng" }),

    password: strongPassword,

    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),

    genderIdentity: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Vui lòng chọn giới tính" }),
    }),

    phoneNumber: z
      .string()
      .trim()
      .regex(vnPhoneRegex, { message: "Số điện thoại không hợp lệ" }),

    companyName: z
      .string()
      .trim()
      .min(2, { message: "Tên công ty phải có ít nhất 2 ký tự" })
      .max(200, { message: "Tên công ty quá dài" }),

    officeLocation: z
      .string()
      .trim()
      .min(2, { message: "Địa chỉ văn phòng phải có ít nhất 2 ký tự" })
      .max(255, { message: "Địa chỉ quá dài" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// --- Form Thông tin Công ty ---
export const EmployerCompanySchema = z.object({
  industry: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng chọn lĩnh vực" })
    .max(100),
  companySize: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng chọn quy mô" })
    .max(50),

  // PRO UX: Tự động thêm https:// nếu user quên nhập (Smart Transform)
  website: z
    .string()
    .trim()
    .transform((url) => {
      if (url && !/^https?:\/\//i.test(url)) {
        return `https://${url}`;
      }
      return url;
    })
    .pipe(
      z
        .string()
        .url({ message: "Website không hợp lệ" })
        .optional()
        .or(z.literal("")),
    ),

  taxCode: z
    .string()
    .trim()
    .regex(/^[0-9\-]{5,15}$/, { message: "Mã số thuế không hợp lệ" }),

  description: z
    .string()
    .trim()
    .max(1000, { message: "Mô tả tối đa 1000 ký tự" }),
});

// --- Form Đổi mật khẩu ---
export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại").max(128),
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

// --- Form Quên mật khẩu ---
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập email" })
    .max(255)
    .email({ message: "Email không đúng định dạng" }),
});

// --- Form Đặt lại mật khẩu ---
export const ResetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });
