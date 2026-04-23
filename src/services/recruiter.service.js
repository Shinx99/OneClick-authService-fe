// src/services/recruiter.service.js
import api from "@/lib/apiClient/api.config";

/**
 * @typedef {"REQUIRE_ONBOARDING" | "COMPLETED"} OnboardingStatus
 */

export const recruiterService = {
  // -------------------------------------------------------
  // GET onboarding status
  // GET /api/recruitment/employer/onboarding-status
  // Response.data = "REQUIRE_ONBOARDING" | "COMPLETED"
  // -------------------------------------------------------
  getOnboardingStatus: async () => {
    const response = await api.get("recruitment/employer/onboarding-status");
    return response.data; // { success, message, data }
  },

  // -------------------------------------------------------
  // Submit onboarding (tạo employer record, chưa kèm company)
  // POST /api/recruitment/employer/onboarding
  // Body: {}
  // -------------------------------------------------------
  submitOnboarding: async () => {
    const response = await api.post("recruitment/employer/onboarding", {});
    return response.data;
  },
};

// -------------------------------------------------------------------
// Helper: đảm bảo recruiter đã onboarded.
// - Gọi ngầm sau login / khi init auth.
// - Nếu đã COMPLETED → no-op.
// - Nếu REQUIRE_ONBOARDING → tự POST /employer/onboarding với body rỗng.
// - Swallow lỗi "đã hoàn thành" vì race condition (2 tab, F5 nhanh...).
// - Lỗi khác (network/500) → throw để caller xử lý toast.
// -------------------------------------------------------------------
export async function ensureRecruiterOnboarded() {
  const statusRes = await recruiterService.getOnboardingStatus();
  const status = statusRes?.data;

  if (status !== "REQUIRE_ONBOARDING") return; // COMPLETED hoặc unknown → bỏ qua

  try {
    await recruiterService.submitOnboarding();
  } catch (err) {
    const message = err?.response?.data?.message || "";
    // BE trả lỗi "Employer đã hoàn thành bước gửi thông tin Onboarding!" khi
    // đã có record → coi như thành công, không throw.
    if (/đã hoàn thành/i.test(message) || /already/i.test(message)) {
      return;
    }
    throw err;
  }
}
