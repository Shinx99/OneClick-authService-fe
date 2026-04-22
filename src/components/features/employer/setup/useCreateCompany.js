"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { companyService } from "@/services/company.service";

const URL_REGEX = /^https?:\/\/.+/i;
const TAX_CODE_REGEX = /^[0-9-]+$/;

const INITIAL_FORM = {
  company_name: "",
  tax_code: "",
  business_rep_name: "",
  industry: "IT Services",
  size_range: "1-50",
  province_code: "700000",
  address: "",
  website_url: "",
  overview: "",
};

/**
 * Hook chứa toàn bộ logic tạo công ty: state form, validate, gọi API.
 * Trả về handlers để CreateCompanyScreen dùng.
 *
 * @param {Object} opts
 * @param {(info: { companyId?: string, companyName: string }) => void} [opts.onSuccess]
 *        Gọi sau khi tạo company thành công (parent dùng để chuyển sang màn pending).
 */
export function useCreateCompany({ onSuccess } = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const logoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const setField = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (type === "logo" && file.type.includes("image/")) setLogoFile(file);
    else if (type === "doc") setDocFile(file);
    else toast.error("Định dạng file không hợp lệ!");
  };

  const validate = () => {
    if (!formData.company_name?.trim()) return "Vui lòng nhập tên công ty!";
    if (!formData.tax_code?.trim()) return "Vui lòng nhập mã số thuế!";
    if (formData.tax_code.length > 20) return "Mã số thuế tối đa 20 ký tự!";
    if (!TAX_CODE_REGEX.test(formData.tax_code))
      return "Mã số thuế chỉ chứa số và dấu -";
    if (!formData.size_range) return "Vui lòng chọn quy mô!";
    if (!formData.overview?.trim()) return "Vui lòng nhập giới thiệu công ty!";
    if (formData.website_url && !URL_REGEX.test(formData.website_url))
      return "Website phải bắt đầu bằng http:// hoặc https://";
    return null;
  };

  const buildPayload = () => {
    const raw = {
      companyName: formData.company_name.trim(),
      taxCode: formData.tax_code.trim(),
      sizeRange: formData.size_range,
      overview: formData.overview.trim(),
      industry: formData.industry,
      provinceCode: formData.province_code,
      address: formData.address,
      websiteUrl: formData.website_url,
      businessRepName: formData.business_rep_name,
    };
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    );
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setIsLoading(true);
    toast.loading("Đang khởi tạo hồ sơ doanh nghiệp...", { id: "setup" });

    try {
      // 1. POST /api/recruitment/company
      const res = await companyService.createCompany(buildPayload());
      const companyId = res?.data?.companyId;

      // 2. Upload logo best-effort
      if (logoFile) {
        try {
          await companyService.uploadCompanyLogo(logoFile);
        } catch (uploadErr) {
          console.warn("Upload logo thất bại:", uploadErr);
          toast.error(
            "Công ty đã tạo nhưng upload logo thất bại, bạn có thể tải lại sau.",
          );
        }
      }

      // 3. Đánh dấu đã có company để RestrictedWrapper mở khoá dashboard
      if (typeof window !== "undefined") {
        localStorage.setItem("hasCompany", "1");
        // status mới tạo BE luôn trả "pending" → dashboard sẽ show popup
        // "đang chờ admin duyệt" thay vì popup "yêu cầu xác thực".
        localStorage.setItem(
          "companyStatus",
          res?.data?.status || "pending",
        );
        if (companyId) localStorage.setItem("companyId", companyId);
      }

      toast.success(
        res?.message || "Tạo công ty thành công! Vui lòng chờ Admin duyệt.",
        { id: "setup" },
      );

      // 4. Chuyển sang màn pending — KHÔNG redirect ngay về dashboard
      onSuccess?.({
        companyId,
        companyName: res?.data?.companyName || formData.company_name.trim(),
      });
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Tạo công ty thất bại";

      if (status === 403) {
        toast.error(
          "Bạn không có quyền tạo công ty (yêu cầu role recruiter).",
          { id: "setup" },
        );
        return;
      }
      if (/already has a company/i.test(message)) {
        if (typeof window !== "undefined") {
          localStorage.setItem("hasCompany", "1");
          // Không biết status thật → để dashboard quyết theo flag có sẵn.
        }
        toast.error("Bạn đã có công ty, chuyển tới Dashboard...", {
          id: "setup",
        });
        setTimeout(() => router.push("/employer/dashboard"), 1200);
        return;
      }
      if (/hasn't verified profile/i.test(message)) {
        // BE báo recruiter chưa onboarded — về dashboard, AuthContext sẽ tự
        // gọi ensureRecruiterOnboarded() lần sau khi user thao tác.
        toast.error(
          "Hồ sơ employer chưa sẵn sàng, vui lòng đăng nhập lại.",
          { id: "setup" },
        );
        setTimeout(() => router.push("/employer/dashboard"), 1200);
        return;
      }

      toast.error(message, { id: "setup" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setField,
    logoFile,
    setLogoFile,
    docFile,
    setDocFile,
    logoInputRef,
    docInputRef,
    isLoading,
    handleDrop,
    handleSubmit,
  };
}
