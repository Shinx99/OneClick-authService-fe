"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { ensureRecruiterOnboarded } from "@/services/recruiter.service";
import { refreshTokenOnce } from "@/lib/apiClient/api.config";

export const ROLES = {
  ADMIN: "admin",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate",
};

// Gọi ngầm onboarding cho recruiter. Không block UI, không hiện loading.
// Lỗi network/500 → toast nhẹ, KHÔNG throw để không phá flow login.
const runRecruiterOnboarding = async (parsedUser) => {
  if (!parsedUser?.roles?.includes(ROLES.RECRUITER)) return;
  try {
    await ensureRecruiterOnboarded();
  } catch (err) {
    console.warn("Onboarding recruiter thất bại:", err);
    toast.error("Không thể khởi tạo hồ sơ, vui lòng đăng nhập lại");
  }
};

// Xoá toàn bộ flag local liên quan đến công ty (tránh user A nhìn thấy
// trạng thái công ty của user B vì localStorage chia sẻ giữa các session).
const clearCompanyLocalFlags = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hasCompany");
  localStorage.removeItem("companyStatus");
  localStorage.removeItem("companyId");
};

// Đã bỏ : any
const parseUser = (result) => ({
  id: result.accountId,
  email: result.email,
  phone: result.phone,
  status: result.status,
  roles: result.roles ?? [],
});

const AuthContext = createContext(null);

// Đã bỏ khai báo kiểu cho { children }
export const AuthProvider = ({ children }) => {
  // Đã bỏ <any> và <string | null>
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 1. Tự động refresh auth khi app chạy (bao gồm F5)
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        const refreshed = await refreshTokenOnce();

        if (refreshed && refreshed.data) {
          const result = refreshed.data;
          const parsedUser = parseUser(result);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Recruiter: chạy ngầm onboarding khi F5 (không await để không chặn UI)
          runRecruiterOnboarding(parsedUser);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // refreshAuth throw error → coi như chưa đăng nhập, không redirect
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // Dù thành công hay thất bại, LUÔN tắt loading
        setIsLoading(false); // ← QUAN TRỌNG NHẤT
      }
    };

    if (typeof window !== "undefined") {
      initAuth();
    }
  }, []);

  // 2. Login (Đã bỏ : string)
  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await authService.login(email, password);
        // Xoá flag của session cũ trước khi set user mới
        clearCompanyLocalFlags();
        const parsedUser = parseUser(result);
        setUser(parsedUser);
        setIsAuthenticated(true);

        toast.success("Đăng nhập thành công!");

        const roles = parsedUser.roles;
        if (roles.includes(ROLES.ADMIN)) router.push("/admin");
        else if (roles.includes(ROLES.RECRUITER)) {
          // Chờ onboarding xong rồi mới redirect để dashboard có ngữ cảnh đúng.
          await runRecruiterOnboarding(parsedUser);
          router.push("/employer/dashboard");
        }
        else if (roles.includes(ROLES.CANDIDATE)) {
          router.push("/");
        }
        else router.push("/");

        return { success: true };
      } catch (err) {
        // Đã bỏ : any
        const errorMsg = "Đăng nhập thất bại! Email hoặc mật khẩu sai";
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );


  // 3. Register (Đã bỏ : any)
  const register = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.register(payload);

        toast.success("Đăng ký thành công! Vui lòng check mail...");

        router.push("/login");
        return { success: true };
      } catch (err) {
        // Đã bỏ : any
        // Thêm optional chaining (?) để tránh lỗi văng app nếu err.response bị undefined
        const errorMsg = err?.response?.data?.message || "Đăng ký thất bại";
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );


  // --- 6. Change Password ---
  const changePassword = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.changePassword(payload);
      toast.success("Đổi mật khẩu thành công!");
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Đổi mật khẩu thất bại";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);


  // --- 7. Forgot Password ---
  const sendForgotPasswordEmail = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi đến service bạn đã viết
      await authService.forgotPassword(email);
      toast.success("Yêu cầu thành công! Vui lòng kiểm tra email.");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Email không tồn tại hoặc lỗi hệ thống";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);


  const executeResetPassword = useCallback(
    async (token, newPassword) => {
      setIsLoading(true);
      try {
        // Gọi đến authService.resetPassword(token, newPassword)
        await authService.resetPassword(token, newPassword);
        toast.success("Mật khẩu đã được thay đổi! Hãy đăng nhập lại.");
        router.push("/login"); // Chuyển hướng về trang đăng nhập
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // 4. Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      clearCompanyLocalFlags();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      clearCompanyLocalFlags();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
      toast.error("Có lỗi khi đăng xuất, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  }, [router]);


  // 5. Google Login (Đã bỏ : any)
  const loginWithGoogle = useCallback(
    async (credentialResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await authService.googleLogin(credentialResponse);
        if (result.accessToken) {
          // Xoá flag của session cũ trước khi set user mới
          clearCompanyLocalFlags();
          const parsedUser = parseUser(result);
          setUser(parsedUser);
          setIsAuthenticated(true);
          toast.success("Đăng nhập bằng Google thành công!");

          const roles = parsedUser.roles;
          if (roles.includes(ROLES.ADMIN)) router.push("/admin");
          else if (roles.includes(ROLES.RECRUITER)) {
            await runRecruiterOnboarding(parsedUser);
            router.push("/employer/dashboard");
          }
          else if (roles.includes(ROLES.CANDIDATE)) router.push("/");
          else router.push("/");

          return { success: true };
        }
        return { success: false };
      } catch (err) {
        const errorMsg = "Đăng nhập Google thất bại";
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Đã bỏ : string
  const hasRole = useCallback(
    (role) => user?.roles?.includes(role) ?? false,
    [user],
  );
  const isAdmin = hasRole(ROLES.ADMIN);
  const isRecruiter = hasRole(ROLES.RECRUITER);
  const isCandidate = hasRole(ROLES.CANDIDATE);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        error,
        isAdmin,
        isRecruiter,
        isCandidate,
        hasRole,
        login,
        register,
        logout,
        loginWithGoogle,
        changePassword,
        sendForgotPasswordEmail,
        executeResetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return context;
};

// // Thay vì throw Error, trả về một dữ liệu mặc định (chỉ dùng khi test)
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     console.warn("Đang chạy app không có AuthProvider");
//     return {
//       user: null,
//       isLoading: false,
//       isAuthenticated: false,
//       isAdmin: false,
//       isRecruiter: false,
//       isCandidate: false,
//       // ... thêm các hàm rỗng để tránh lỗi "is not a function"
//       login: () => { },
//       logout: () => { },
//     };
//   }
//   return context;
// };
