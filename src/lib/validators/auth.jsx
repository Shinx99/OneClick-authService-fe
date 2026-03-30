import { z } from "zod";

// Định nghĩa luật cho Form Đăng Nhập
export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đăng nhập" })
    .email({ message: "Email không đúng định dạng" }) // Ép chuẩn định dạng email
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
    phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
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
    isEmployer: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // Logic kiểm tra 2 mật khẩu phải giống hệt nhau
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Báo lỗi đỏ ở ô Xác nhận mật khẩu
  });

// Form Đăng ký Nhà tuyển dụng
export const EmployerRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),

    email: z
      .string()
      .min(1, { message: "Vui lòng nhập Email" })
      .email({ message: "Email không đúng định dạng" }),

    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),

    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),

    genderIdentity: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Vui lòng chọn giới tính" }),
    }),

    phoneNumber: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),

    companyName: z
      .string()
      .min(2, { message: "Tên công ty phải có ít nhất 2 ký tự" }),

    officeLocation: z
      .string()
      .min(2, { message: "Địa chỉ văn phòng phải có ít nhất 2 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Form Thông tin Công ty
export const EmployerCompanySchema = z.object({
  industry: z.string().min(1, { message: "Vui lòng chọn lĩnh vực" }),
  companySize: z.string().min(1, { message: "Vui lòng chọn quy mô" }),
  website: z
    .string()
    .url({ message: "Website không hợp lệ" })
    .optional()
    .or(z.literal("")),
  taxCode: z.string().min(5, { message: "Mã số thuế không hợp lệ" }),
  description: z.string().max(1000, { message: "Mô tả tối đa 1000 ký tự" }),
});
