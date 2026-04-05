import { z } from "zod";

const emptyToNull = (val) => {
    if (typeof val === "string" && val.trim() === "") return null;
    return val;
};

export const CandidateProfileSchema = z.object({
    candidateId: z.string().optional().or(z.literal("")),

    surname: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập họ và tên đệm" })
        .max(100, { message: "Họ và tên đệm tối đa 100 ký tự" }),

    name: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập tên" })
        .max(50, { message: "Tên tối đa 50 ký tự" }),

    about: z.preprocess(emptyToNull, z.string().trim().max(5000, { message: "Giới thiệu bản thân tối đa 5000 ký tự" }).nullable()),

    birthday: z.preprocess(emptyToNull, z.string().nullable()),

    gender: z
        .boolean({ invalid_type_error: "Vui lòng chọn giới tính" })
        .optional()
        .refine((val) => val !== undefined, {
            message: "Vui lòng chọn giới tính",
        }),

    province: z.preprocess(emptyToNull, z.string().trim().max(100, { message: "Tỉnh/Thành phố tối đa 100 ký tự" }).nullable()),

    commune: z.preprocess(emptyToNull, z.string().trim().max(100, { message: "Xã/Phường tối đa 100 ký tự" }).nullable()),

    referenceLink: z.preprocess(
        emptyToNull,
        z.string().trim().url({ message: "Link tham chiếu không hợp lệ" }).nullable()
    ),
});