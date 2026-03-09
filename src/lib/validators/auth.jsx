import { z } from "zod";

// Định nghĩa luật cho Form Đăng Nhập
export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đăng nhập" })
    .trim(),

  password: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  remember: z.boolean().optional(), // Thêm dòng này cho checkbox
});

// Form Đăng ký
export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),

    username: z
      .string()
      .min(1, { message: "Vui lòng nhập Email" })
      .email({ message: "Email không đúng định dạng" }), // Ép chuẩn định dạng email

    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),

    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),

    terms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với các điều khoản",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // Logic kiểm tra 2 mật khẩu phải giống hệt nhau
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Báo lỗi đỏ ở ô Xác nhận mật khẩu
  });
